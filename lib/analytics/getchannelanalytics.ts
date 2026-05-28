import { prisma } from "@/lib/prisma";
export interface VideoAnalytics {
  videoId: string;
  title: string;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  engagementScore: number;
}

export interface ChannelAnalytics {
  totalVideos: number;
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  topVideos: VideoAnalytics[];
}

function calculateEngagementScore(
  views: number,
  likes: number,
  comments: number,
): number {
  return views + likes * 5 + comments * 10;
}

export async function getChannelAnalytics(
  youtubeId: string,
): Promise<ChannelAnalytics | null> {
  const channel = await prisma.channel.findUnique({
    where: { youtubeId },
    include: { videos: true },
  });

  if (!channel) {
    return null;
  }

  const videos = channel.videos;

  const analytics: VideoAnalytics[] = videos.map((video) => ({
    videoId: video.youtubeId,
    title: video.title,
    publishedAt: video.publishedAt,
    views: video.views,
    likes: video.likes,
    comments: video.comments,
    engagementScore: calculateEngagementScore(
      video.views,
      video.likes,
      video.comments,
    ),
  }));

  const sortedVideos = analytics.sort(
    (a, b) => b.engagementScore - a.engagementScore,
  );

  const totalVideos = analytics.length;

  const averageViews =
    analytics.reduce((sum, video) => sum + video.views, 0) / totalVideos;

  const averageLikes =
    analytics.reduce((sum, video) => sum + video.likes, 0) / totalVideos;

  const averageComments =
    analytics.reduce((sum, video) => sum + video.comments, 0) / totalVideos;

  return {
    totalVideos,
    averageViews,
    averageLikes,
    averageComments,
    topVideos: sortedVideos.slice(0, 10),
  };
}
