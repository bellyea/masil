import { NextResponse } from "next/server";
import { syncCultureEvents } from "@/lib/services/eventService";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting culture event sync");
    const result = await syncCultureEvents();
    console.log("Culture event sync completed", result);

    return NextResponse.json({ success: true, inserted: result.inserted });
  } catch (error) {
    console.error("Culture event sync failed", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
