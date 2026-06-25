import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { auth } from "@/auth";
import { tools } from "@/lib/ai/tools";
import { executeTool } from "@/lib/ai/executeTool";

const client = new OpenAI({
  baseURL: process.env.FREELLM_BASE_URL ?? "http://localhost:3001/v1",
  apiKey: process.env.FREELLM_API_KEY!,
});

const SYSTEM_PROMPT = `
너는 마실(Masil)의 문화행사 추천 도우미입니다.
전시, 공연, 축제, 지역, 일정, 분위기와 관련된 질문에만 답변하세요.
문화행사와 관련 없는 요청은 정중히 거절하세요.
추천은 반드시 제공된 행사 데이터 또는 검색 도구 결과를 기반으로 답변하세요.
행사 데이터가 없으면 임의로 행사를 지어내지 마세요.
답변은 친근하고 간결하게, 200자 이내로 작성하세요.
`.trim();

const ALLOWED_KEYWORDS = [
  "전시",
  "공연",
  "축제",
  "문화",
  "행사",
  "데이트",
  "주말",
  "지역",
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "제주",
  "아이",
  "가족",
  "실내",
  "미술",
  "뮤지컬",
  "콘서트",
  "연극",
  "박물관",
  "갤러리",
  "오페라",
  "클래식",
  "추천",
  "어디",
  "오늘",
  "내일",
  "이번 주",
  "이번주",
  "비 오는 날",
  "나들이",
  "마실",
  "볼만한",
  "가볼만한",
  "혼자",
  "친구",
  "부모님",
];

const MAX_MESSAGE_LENGTH = 200;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60_000;

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitMap = new Map<string, RateLimitEntry>();
let lastRateLimitCleanupAt = 0;

function isCultureRelated(message: string): boolean {
  const normalizedMessage = message.replace(/\s+/g, "");

  return ALLOWED_KEYWORDS.some((keyword) => {
    const normalizedKeyword = keyword.replace(/\s+/g, "");
    return normalizedMessage.includes(normalizedKeyword);
  });
}

function cleanupRateLimitMap(now: number) {
  if (now - lastRateLimitCleanupAt < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }

  lastRateLimitCleanupAt = now;
}

function checkRateLimit(key: string, maxCount: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupRateLimitMap(now);

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxCount) return false;

  entry.count += 1;
  return true;
}

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function parseToolArguments(argumentsText: string) {
  try {
    return JSON.parse(argumentsText);
  } catch {
    return null;
  }
}

function extractRelatedEvents(result: unknown) {
  type RelatedEvent = { id: string; title: string };

  const items = Array.isArray(result)
    ? result
    : result && typeof result === "object" && "items" in result
      ? (result as { items?: unknown }).items
      : [];

  if (!Array.isArray(items)) return [] satisfies RelatedEvent[];

  return items
    .filter(
      (event): event is { id: string; title: string } =>
        typeof event === "object" &&
        event !== null &&
        "id" in event &&
        "title" in event &&
        typeof event.id === "string" &&
        typeof event.title === "string"
    )
    .map((event) => ({ id: event.id, title: event.title }));
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { answer: "요청 형식이 올바르지 않아요.", events: [] },
      { status: 400 }
    );
  }

  const message =
    body && typeof body === "object" && "message" in body
      ? (body as { message?: unknown }).message
      : undefined;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { answer: "메시지를 입력해주세요.", events: [] },
      { status: 400 }
    );
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        answer: `질문은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해주세요.`,
        events: [],
      },
      { status: 400 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id;
  const ip = getClientIp(req);

  if (userId) {
    const allowed = checkRateLimit(`user:${userId}`, 10, 60_000);

    if (!allowed) {
      return NextResponse.json(
        {
          answer: "잠시 후 다시 질문해주세요. 로그인 사용자는 1분에 10회까지 질문할 수 있어요.",
          events: [],
        },
        { status: 429 }
      );
    }
  } else {
    const allowed = checkRateLimit(`ip:${ip}`, 3, 24 * 60 * 60_000);

    if (!allowed) {
      return NextResponse.json(
        {
          answer: "비로그인 사용자는 하루 3회까지 질문할 수 있어요. 로그인하면 더 많이 사용할 수 있어요.",
          events: [],
        },
        { status: 429 }
      );
    }
  }

  const ipAllowed = checkRateLimit(`ip-strict:${ip}`, 20, 60_000);

  if (!ipAllowed) {
    return NextResponse.json(
      {
        answer: "요청이 너무 많아요. 잠시 후 다시 시도해주세요.",
        events: [],
      },
      { status: 429 }
    );
  }

  if (!isCultureRelated(trimmedMessage)) {
    return NextResponse.json({
      answer: "마실은 문화행사 추천 서비스라 전시, 공연, 축제와 관련된 질문에 답변할 수 있어요.",
      events: [],
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: "auto",
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: trimmedMessage },
      ],
      tools: tools as OpenAI.Chat.Completions.ChatCompletionTool[],
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];

    if (!toolCall || toolCall.type !== "function") {
      return NextResponse.json({
        answer: "관련 행사 데이터를 찾지 못했어요. 지역이나 날짜를 조금 더 구체적으로 알려주세요.",
        events: [],
      });
    }

    const args = parseToolArguments(toolCall.function.arguments);

    if (!args) {
      return NextResponse.json(
        {
          answer: "추천 조건을 처리하지 못했어요. 질문을 조금 더 간단히 다시 입력해주세요.",
          events: [],
        },
        { status: 400 }
      );
    }

    const result = await executeTool(toolCall.function.name, args);
    const relatedEvents = extractRelatedEvents(result);

    if (relatedEvents.length === 0) {
      return NextResponse.json({
        answer: "조건에 맞는 행사를 아직 찾지 못했어요. 지역이나 카테고리를 바꿔 다시 찾아볼까요?",
        events: [],
      });
    }

    const finalResponse = await client.chat.completions.create({
      model: "auto",
      max_tokens: 500,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: trimmedMessage },
        response.choices[0].message as OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        },
      ],
    });

    return NextResponse.json({
      answer:
        finalResponse.choices[0].message.content ??
        "추천 결과를 정리하지 못했어요. 다시 질문해주세요.",
      events: relatedEvents,
    });
  } catch (error) {
    console.error("[chat] error:", error);

    return NextResponse.json(
      {
        answer: "AI 추천을 잠시 사용할 수 없어요. 잠시 후 다시 질문해주세요.",
        events: [],
      },
      { status: 500 }
    );
  }
}
