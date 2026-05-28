//file: lib/youtube/getchannel.ts
import youtubeClient from "./client";

export interface YouTubeChannel {
  youtubeId: string;
  uploadsPlaylistId: string;
  title: string;
  description: string;
  thumbnail: string;
}

export async function getChannelByUsername(
  username: string,
): Promise<YouTubeChannel | null> {
  const cleanUsername = username.replace("@", "");

  const response = await youtubeClient.get("/channels", {
    params: { part: "snippet,contentDetails", forHandle: cleanUsername },
  });

  const item = response.data.items?.[0];

  if (!item) {
    return null;
  }

  return {
    youtubeId: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url ?? "",
    uploadsPlaylistId: item.contentDetails.relatedPlaylists.uploads,
  };
}
