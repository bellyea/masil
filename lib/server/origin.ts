import { NextResponse } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function normalizeOrigin(origin: string) {
  return origin.replace(/\/$/, "");
}

function getAllowedOrigins() {
  return new Set(
    [
      ...DEFAULT_ALLOWED_ORIGINS,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.AUTH_URL,
      process.env.NEXTAUTH_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ]
      .filter((origin): origin is string => Boolean(origin))
      .map(normalizeOrigin)
  );
}

function isRequestHostOrigin(req: Request, origin: string) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";

  if (!host) return false;

  try {
    return normalizeOrigin(origin) === `${protocol}://${host}`;
  } catch {
    return false;
  }
}

export function assertSameOrigin(req: Request) {
  const origin = req.headers.get("origin");

  if (!origin) return null;

  const normalizedOrigin = normalizeOrigin(origin);

  if (getAllowedOrigins().has(normalizedOrigin) || isRequestHostOrigin(req, normalizedOrigin)) {
    return null;
  }

  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}