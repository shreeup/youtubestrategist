import {
  ChannelAnalyticsResponse,
  TopicAnalyticsResponse,
  TopicRecommendationResponse,
  PublishTimingResponse,
} from "@/types/dashboard";

const API_BASE = "http://localhost:9876/api";

export async function analyzeChannel(username: string) {
  const response = await fetch(`${API_BASE}/analyzechannel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze channel");
  }

  return response.json();
}

export async function getChannelAnalytics(
  youtubeId: string,
): Promise<ChannelAnalyticsResponse> {
  const response = await fetch(
    `${API_BASE}/channelanalytics?youtubeId=${youtubeId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return response.json();
}

export async function getTopicAnalytics(
  youtubeId: string,
): Promise<TopicAnalyticsResponse[]> {
  const response = await fetch(
    `${API_BASE}/topicanalytics?youtubeId=${youtubeId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch topic analytics");
  }

  return response.json();
}

export async function getTopicRecommendations(
  youtubeId: string,
): Promise<TopicRecommendationResponse[]> {
  const response = await fetch(
    `${API_BASE}/topicrecommendations?youtubeId=${youtubeId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return response.json();
}

export async function getPublishTiming(
  youtubeId: string,
): Promise<PublishTimingResponse> {
  const response = await fetch(
    `${API_BASE}/publishtiming?youtubeId=${youtubeId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch publish timing");
  }

  return response.json();
}
