import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "UPCOMING";
  if (now > endDate) return "ENDED";

  return "ONGOING";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const status = searchParams.get("status");

  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "asc",
    },
  });

  // 1차 필터 (DB에서 가져온 뒤 JS 필터링)
  let result = events;

  // 카테고리 필터
  if (category) {
    result = result.filter((e) => e.category === category);
  }

  // 키워드 필터
  if (keyword) {
    result = result.filter(
      (e) =>
        e.title.includes(keyword) ||
        e.description?.includes(keyword)
    );
  }

  // 상태 필터 (핵심)
  if (status) {
    result = result.filter((e) => {
      const s = getStatus(e.startDate, e.endDate);
      return s === status;
    });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  const event = await prisma.event.create({
    data: {
      title: body.title,
      venue: body.venue,
      category: body.category ?? "ETC",
      description: body.description,
      thumbnail: body.thumbnail,
      website: body.website,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isFeatured: body.isFeatured ?? false,
    },
  });

  return NextResponse.json(event);
}
