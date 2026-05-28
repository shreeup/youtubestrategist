//file: lib/youtube/client.ts
import axios from "axios";

const youtubeClient = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: { key: process.env.YOUTUBE_API_KEY },
});

export default youtubeClient;
