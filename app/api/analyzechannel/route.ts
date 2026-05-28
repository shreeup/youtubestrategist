import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getChannelByUsername } from "@/lib/youtube/getchannel";
import { getChannelVideos } from "@/lib/youtube/getchannelvideos";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const username = body.username;

    if (!username) {
      return NextResponse.json(
        { error: "username is required" },
        { status: 400 },
      );
    }

    const channel = await getChannelByUsername(username);

    if (!channel) {
      return NextResponse.json({ error: "channel not found" }, { status: 404 });
    }

    const savedChannel = await prisma.channel.upsert({
      where: { youtubeId: channel.youtubeId },
      update: {
        title: channel.title,
        description: channel.description,
        thumbnail: channel.thumbnail,
        uploadsPlaylistId: channel.uploadsPlaylistId,
      },
      create: {
        youtubeId: channel.youtubeId,
        title: channel.title,
        description: channel.description,
        thumbnail: channel.thumbnail,
        uploadsPlaylistId: channel.uploadsPlaylistId,
      },
    });

    const videos = await getChannelVideos(savedChannel.uploadsPlaylistId, 100);
    for (const video of videos) {
      await prisma.video.upsert({
        where: { youtubeId: video.youtubeId },
        update: {
          title: video.title,
          description: video.description,
          publishedAt: new Date(video.publishedAt),
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          lastSyncedAt: new Date(),
        },
        create: {
          youtubeId: video.youtubeId,
          title: video.title,
          description: video.description,
          publishedAt: new Date(video.publishedAt),
          views: video.views,
          likes: video.likes,
          comments: video.comments,
          lastSyncedAt: new Date(),
          channelId: savedChannel.id,
        },
      });
    }

    await prisma.channel.update({
      where: { id: savedChannel.id },
      data: { lastSyncedAt: new Date() },
    });

    return NextResponse.json({
      youtubeId: savedChannel.youtubeId,
      channel: savedChannel.title,
      videosFetched: videos.length,
      syncedAt: new Date(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
