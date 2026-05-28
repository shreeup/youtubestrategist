import { prisma } from "@/lib/prisma";

interface DayAnalytics {
  day: string;
  averageEngagement: number;
  videoCount: number;
}

interface HourAnalytics {
  hour: number;
  averageEngagement: number;
  videoCount: number;
}

export interface PublishTimingAnalytics {
  bestDays: DayAnalytics[];
  bestHours: HourAnalytics[];
  recommendedPublishWindow: string;
}

function calculateEngagement(
  views: number,
  likes: number,
  comments: number,
): number {
  return views + likes * 5 + comments * 10;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export async function getPublishTimingAnalytics(
  youtubeId: string,
): Promise<PublishTimingAnalytics | null> {
  const channel = await prisma.channel.findUnique({
    where: { youtubeId },
    include: { videos: true },
  });

  if (!channel) {
    return null;
  }

  const dayMap = new Map<
    string,
    { totalEngagement: number; videoCount: number }
  >();

  const hourMap = new Map<
    number,
    { totalEngagement: number; videoCount: number }
  >();

  for (const video of channel.videos) {
    const date = new Date(video.publishedAt);

    const day = DAYS[date.getUTCDay()];
    const hour = date.getUTCHours();

    const engagement = calculateEngagement(
      video.views,
      video.likes,
      video.comments,
    );

    const dayStats = dayMap.get(day);

    if (dayStats) {
      dayStats.totalEngagement += engagement;
      dayStats.videoCount += 1;
    } else {
      dayMap.set(day, { totalEngagement: engagement, videoCount: 1 });
    }

    const hourStats = hourMap.get(hour);

    if (hourStats) {
      hourStats.totalEngagement += engagement;
      hourStats.videoCount += 1;
    } else {
      hourMap.set(hour, { totalEngagement: engagement, videoCount: 1 });
    }
  }

  const bestDays = Array.from(dayMap.entries())
    .map(([day, stats]) => ({
      day,
      averageEngagement: stats.totalEngagement / stats.videoCount,
      videoCount: stats.videoCount,
    }))
    .sort((a, b) => b.averageEngagement - a.averageEngagement);

  const bestHours = Array.from(hourMap.entries())
    .map(([hour, stats]) => ({
      hour,
      averageEngagement: stats.totalEngagement / stats.videoCount,
      videoCount: stats.videoCount,
    }))
    .sort((a, b) => b.averageEngagement - a.averageEngagement);

  const topDay = bestDays[0];
  const topHour = bestHours[0];

  const recommendedPublishWindow =
    topDay && topHour
      ? `${topDay.day} around ${topHour.hour}:00 UTC`
      : "Not enough data";

  return { bestDays, bestHours, recommendedPublishWindow };
}
