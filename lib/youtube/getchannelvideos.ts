import youtubeClient from "./client";

interface PlaylistItemsResponse {
  items?: Array<{ contentDetails: { videoId: string } }>;
  nextPageToken?: string;
}

interface VideosResponse {
  items?: Array<{
    id: string;
    snippet: { title: string; description: string; publishedAt: string };
    statistics: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }>;
}

export interface YouTubeVideo {
  youtubeId: string;
  title: string;
  description: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
}

async function getPlaylistVideoIds(
  uploadsPlaylistId: string,
  maxVideos = 100,
): Promise<string[]> {
  let nextPageToken: string | undefined = undefined;

  const videoIds: string[] = [];

  while (videoIds.length < maxVideos) {
    const response: PlaylistItemsResponse = (
      await youtubeClient.get<PlaylistItemsResponse>("/playlistItems", {
        params: {
          part: "contentDetails",
          playlistId: uploadsPlaylistId,
          maxResults: 50,
          pageToken: nextPageToken,
        },
      })
    ).data;

    const items = response.items ?? [];

    for (const item of items) {
      const videoId = item.contentDetails.videoId;

      if (videoId) {
        videoIds.push(videoId);
      }

      if (videoIds.length >= maxVideos) {
        break;
      }
    }

    nextPageToken = response.nextPageToken;

    if (!nextPageToken) {
      break;
    }
  }

  return videoIds;
}
async function getVideosByIds(videoIds: string[]): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);

    const response = await youtubeClient.get<VideosResponse>("/videos", {
      params: { part: "snippet,statistics", id: chunk.join(",") },
    });

    const items = response.data.items ?? [];

    for (const item of items) {
      videos.push({
        youtubeId: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        views: Number(item.statistics.viewCount ?? 0),
        likes: Number(item.statistics.likeCount ?? 0),
        comments: Number(item.statistics.commentCount ?? 0),
      });
    }
  }

  return videos;
}
export async function getChannelVideos(
  uploadsPlaylistId: string,
  maxVideos = 100,
): Promise<YouTubeVideo[]> {
  const videoIds = await getPlaylistVideoIds(uploadsPlaylistId, maxVideos);

  return getVideosByIds(videoIds);
}
