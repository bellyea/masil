import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
      return NextResponse.json(
        { error: "Server Error" },
        { status: 500 }
      );
  }
}