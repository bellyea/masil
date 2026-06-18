import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId" },
      { status: 400 }
    );
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId,
    },
    include: {
      event: true, // ⭐ 핵심 (이벤트 같이 가져오기)
    },
  });

  return NextResponse.json(bookmarks);
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