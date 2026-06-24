import { NextResponse } from "next/server";
import { getTrendingEvents } from "@/lib/mcp/tools/getTrendingEvents";

export async function GET() {
  const result = await getTrendingEvents();

  return NextResponse.json(result);
}