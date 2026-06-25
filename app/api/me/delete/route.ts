import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/server/origin";

export async function DELETE(req: Request) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.delete({
    where: { email: session.user.email },
  });

  return NextResponse.json({ ok: true, logout: true });
}
