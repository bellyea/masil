import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({
      isBookmarked: false,
    });
  }

  const userId = session.user.id;

  const eventId = searchParams.get("eventId");

  if (!eventId) {
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