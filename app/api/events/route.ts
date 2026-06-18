import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "UPCOMING";
  if (now > endDate) return "ENDED";

  return "ONGOING";
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "asc",
    },
  });

  const result = events.map((event) => ({
    ...event,
    status: getStatus(event.startDate, event.endDate),
  }));

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
