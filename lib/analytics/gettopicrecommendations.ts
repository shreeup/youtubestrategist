import { getTopicAnalytics } from "./gettopicanalytics";
import { getTrendScore } from "@/lib/trends/gettrendscore";

interface TopicRecommendation {
  topic: string;
  trendScore: number;
  averageEngagement: number;
  opportunityScore: number;
  recommendationReason: string;
}

export async function getTopicRecommendations(
  youtubeId: string,
): Promise<TopicRecommendation[]> {
  const topicAnalytics = await getTopicAnalytics(youtubeId);

  const recommendations: TopicRecommendation[] = [];

  for (const topicData of topicAnalytics.slice(0, 10)) {
    const trendScore = await getTrendScore(topicData.topic);

    const opportunityScore =
      trendScore * Math.log10(topicData.averageEngagement + 1);

    recommendations.push({
      topic: topicData.topic,
      trendScore,
      averageEngagement: topicData.averageEngagement,
      opportunityScore,
      recommendationReason:
        trendScore > 60
          ? "High external trend momentum"
          : "Strong historical channel performance",
    });
  }

  return recommendations.sort(
    (a, b) => b.opportunityScore - a.opportunityScore,
  );
}
