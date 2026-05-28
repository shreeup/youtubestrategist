import { NextRequest, NextResponse } from "next/server";
import { getChannelAnalytics } from "@/lib/analytics/getchannelanalytics";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const youtubeId = searchParams.get("youtubeId");

  if (!youtubeId) {
    return NextResponse.json(
      { error: "youtubeId is required" },
      { status: 400 },
    );
  }

  const analytics = await getChannelAnalytics(youtubeId);

  if (!analytics) {
    return NextResponse.json({ error: "channel not found" }, { status: 404 });
  }

  return NextResponse.json(analytics);
}
