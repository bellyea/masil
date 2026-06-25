import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/server/auth";
import { prisma } from "@/lib/prisma";
import { assertSameOrigin } from "@/lib/server/origin";

export async function GET() {
  const user = await requireUser();

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const user = await requireUser();
  const body = await req.json().catch(() => null);
  const nickname = body?.nickname?.trim();

  if (!nickname) {
    return NextResponse.json(
      { error: "닉네임을 입력해 주세요." },
      { status: 400 }
    );
  }

  if (nickname.length > 20) {
    return NextResponse.json(
      { error: "닉네임은 20자 이하로 입력해 주세요." },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      nickname,
    },
    select: {
      email: true,
      nickname: true,
    },
  });

  return NextResponse.json(updated);
}
