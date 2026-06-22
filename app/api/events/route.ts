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

  const cursor = searchParams.get("cursor");
  const limit = 10;

  const category = searchParams.get("category");
  const keyword = searchParams.get("keyword");
  const status = searchParams.get("status");

  let events = await prisma.event.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      startDate: "asc",
    },
  });

  // 필터 (서버에서 유지)
  if (category) {
    events = events.filter((e) => e.category === category);
  }

  if (keyword) {
    events = events.filter((e) =>
      e.title.includes(keyword) ||
      e.description?.includes(keyword)
    );
  }

  if (status) {
    events = events.filter((e) => {
      const now = new Date();

      if (status === "UPCOMING") return new Date(e.startDate) > now;
      if (status === "ONGOING")
        return new Date(e.startDate) <= now && new Date(e.endDate) >= now;
      if (status === "ENDED") return new Date(e.endDate) < now;

      return true;
    });
  }

  return NextResponse.json({
    items: events,
    nextCursor:
      events.length === limit ? events[events.length - 1].id : null,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description,

      category: body.category ?? "ETC",

      venueName: body.venueName ?? "Unknown",

      address: body.address,

      images: body.images ?? [],

      website: body.website,

      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),

      isFeatured: body.isFeatured ?? false,
    },
  });

  return NextResponse.json(event);
}
