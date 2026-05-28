import { NextRequest, NextResponse } from "next/server";
import { getPublishTimingAnalytics } from "@/lib/analytics/getpublishtiming";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const youtubeId = searchParams.get("youtubeId");

  if (!youtubeId) {
    return NextResponse.json(
      { error: "youtubeId is required" },
      { status: 400 },
    );
  }

  const analytics = await getPublishTimingAnalytics(youtubeId);

  if (!analytics) {
    return NextResponse.json({ error: "channel not found" }, { status: 404 });
  }

  return NextResponse.json(analytics);
}
