import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId") ?? "test-user";
  const cursor = searchParams.get("cursor");
  const limit = 10;

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
    },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    items: bookmarks,
    nextCursor:
      bookmarks.length === limit
        ? bookmarks[bookmarks.length - 1].id
        : null,
  });
}

export async function POST(req: Request) {
  const { userId, eventId } = await req.json();

  const existing = await prisma.bookmark.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  // 이미 있으면 삭제
  if (existing) {
    await prisma.bookmark.delete({
      where: {
        id: existing.id,
      },
    });

    return NextResponse.json({ status: "deleted" });
  }

  // 없으면 생성
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      eventId,
    },
  });

  return NextResponse.json({ status: "created", bookmark });
}