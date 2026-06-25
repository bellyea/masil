import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildEventWhere } from "@/lib/server/eventWhere";
import { isEventStatus } from "@/lib/server/eventStatus";
import { isEventCategory } from "@/lib/server/category";
import { assertSameOrigin } from "@/lib/server/origin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await auth();

  const cursor = searchParams.get("cursor");
  const limit = 10;

  const categoryParam = searchParams.get("category");
  const statusParam = searchParams.get("status");

  const category = isEventCategory(categoryParam) ? categoryParam : undefined;
  const status = isEventStatus(statusParam) ? statusParam : undefined;
  const keyword = searchParams.get("keyword") ?? undefined;

  const where = buildEventWhere({
    category,
    keyword,
    status,
  });

  const events = await prisma.event.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { startDate: "asc" },
  });

  const bookmarkedEventIds = session?.user?.id
    ? new Set(
        (
          await prisma.bookmark.findMany({
            where: {
              userId: session.user.id,
              eventId: {
                in: events.map((event) => event.id),
              },
            },
            select: {
              eventId: true,
            },
          })
        ).map((bookmark) => bookmark.eventId)
      )
    : new Set<string>();

  return NextResponse.json({
    items: events.map((event) => ({
      ...event,
      isBookmarked: bookmarkedEventIds.has(event.id),
    })),
    nextCursor:
      events.length === limit
        ? events[events.length - 1].id
        : null,
  });
}

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

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
