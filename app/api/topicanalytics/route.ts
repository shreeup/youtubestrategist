import { NextRequest, NextResponse } from "next/server";
import { getTopicAnalytics } from "@/lib/analytics/gettopicanalytics";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const youtubeId = searchParams.get("youtubeId");

  if (!youtubeId) {
    return NextResponse.json(
      { error: "youtubeId is required" },
      { status: 400 },
    );
  }

  const analytics = await getTopicAnalytics(youtubeId);

  return NextResponse.json(analytics);
}
