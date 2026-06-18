import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const eventId = searchParams.get("eventId");

  if (!userId || !eventId) {
    return NextResponse.json(
      { error: "Missing params" },
      { status: 400 }
    );
  }

  const bookmark = await prisma.bookmark.findFirst({
    where: {
      userId,
      eventId,
    },
  });

  return NextResponse.json({
    isBookmarked: !!bookmark,
  });
}