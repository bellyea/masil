import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { tools } from "@/lib/ai/tools";
import { executeTool } from "@/lib/ai/executeTool";

const client = new OpenAI({
  baseURL: "http://localhost:3001/v1",
  apiKey: process.env.FREELLM_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response =
    await client.chat.completions.create({
      model: "auto",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      tools: tools as any,
    });

  const toolCall =
    response.choices[0].message.tool_calls?.[0];

  if (
    !toolCall ||
    toolCall.type !== "function"
  ) {
    return NextResponse.json({
      answer:
        response.choices[0].message.content,
    });
  }

  const toolName =
    toolCall.function.name;

  const args = JSON.parse(
    toolCall.function.arguments
  );

  const result = await executeTool(
    toolName,
    args
  );

  const finalResponse =
  await client.chat.completions.create({
    model: "auto",
    messages: [
      {
        role: "user",
        content: message,
      },
      response.choices[0].message as any,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      },
    ],
  });
  
  return NextResponse.json({
  answer:
    finalResponse.choices[0].message.content,
});
}