import { prisma } from "@/lib/prisma";
import { extractTopics } from "./extracttopics";

interface TopicStats {
  topic: string;
  videoCount: number;
  totalEngagement: number;
  averageEngagement: number;
}

export async function getTopicAnalytics(
  youtubeId: string,
): Promise<TopicStats[]> {
  const channel = await prisma.channel.findUnique({
    where: { youtubeId },
    include: { videos: true },
  });

  if (!channel) {
    return [];
  }

  const topicMap = new Map<
    string,
    { videoCount: number; totalEngagement: number }
  >();

  for (const video of channel.videos) {
    const topics = extractTopics(video.title);

    const engagement = video.views + video.likes * 5 + video.comments * 10;

    for (const topic of topics) {
      const existing = topicMap.get(topic);

      if (existing) {
        existing.videoCount += 1;
        existing.totalEngagement += engagement;
      } else {
        topicMap.set(topic, { videoCount: 1, totalEngagement: engagement });
      }
    }
  }

  return Array.from(topicMap.entries())
    .map(([topic, stats]) => ({
      topic,
      videoCount: stats.videoCount,
      totalEngagement: stats.totalEngagement,
      averageEngagement: stats.totalEngagement / stats.videoCount,
    }))
    .sort((a, b) => b.averageEngagement - a.averageEngagement)
    .slice(0, 20);
}
