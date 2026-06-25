import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/server/origin";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const body = await request.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      nickname: body.nickname,
    },
  });

  return NextResponse.json(user);
}
