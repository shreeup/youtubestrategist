export interface ChannelAnalyticsResponse {
  totalVideos: number;
  averageViews: number;
  averageLikes: number;
  averageComments: number;

  topVideos: { videoId: string; title: string; engagementScore: number }[];
}

export interface TopicAnalyticsResponse {
  topic: string;
  videoCount: number;
  averageEngagement: number;
}

export interface TopicRecommendationResponse {
  topic: string;
  trendScore: number;
  averageEngagement: number;
  opportunityScore: number;
  recommendationReason: string;
}

export interface PublishTimingResponse {
  recommendedPublishWindow: string;

  bestDays: { day: string; averageEngagement: number }[];

  bestHours: { hour: number; averageEngagement: number }[];
}
