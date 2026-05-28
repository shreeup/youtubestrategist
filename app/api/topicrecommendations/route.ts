import { NextRequest, NextResponse } from "next/server";
import { getTopicRecommendations } from "@/lib/analytics/gettopicrecommendations";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const youtubeId = searchParams.get("youtubeId");

  if (!youtubeId) {
    return NextResponse.json(
      { error: "youtubeId is required" },
      { status: 400 },
    );
  }

  const recommendations = await getTopicRecommendations(youtubeId);

  return NextResponse.json(recommendations);
}
