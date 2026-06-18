import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();

  if (now < startDate) return "UPCOMING";
  if (now > endDate) return "ENDED";

  return "ONGOING";
}

export async function GET() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: {
      startDate: "asc",
    },
  });

  const result = exhibitions.map((exhibition) => ({
    ...exhibition,
    status: getStatus(
      exhibition.startDate,
      exhibition.endDate
    ),
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();

  const exhibition = await prisma.exhibition.create({
    data: {
      title: body.title,
      venue: body.venue,
      description: body.description,
      thumbnail: body.thumbnail,
      website: body.website,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isFeatured: body.isFeatured ?? false,
    },
  });

  return NextResponse.json(exhibition);
}