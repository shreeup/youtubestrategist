"use client";
import { useState } from "react";

import {
  analyzeChannel,
  getChannelAnalytics,
  getTopicAnalytics,
  getTopicRecommendations,
  getPublishTiming,
} from "@/lib/dashboard/client";

import {
  ChannelAnalyticsResponse,
  TopicAnalyticsResponse,
  TopicRecommendationResponse,
  PublishTimingResponse,
} from "@/types/dashboard";
export default function HomePage() {
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [channelAnalytics, setChannelAnalytics] =
    useState<ChannelAnalyticsResponse | null>(null);

  const [topicAnalytics, setTopicAnalytics] = useState<
    TopicAnalyticsResponse[]
  >([]);

  const [topicRecommendations, setTopicRecommendations] = useState<
    TopicRecommendationResponse[]
  >([]);

  const [publishTiming, setPublishTiming] =
    useState<PublishTimingResponse | null>(null);

  async function handleAnalyze() {
    try {
      setLoading(true);
      setError(null);

      setChannelAnalytics(null);
      setTopicAnalytics([]);
      setTopicRecommendations([]);
      setPublishTiming(null);

      const analyzeResult = await analyzeChannel(username);

      const youtubeId = analyzeResult.youtubeId;

      const [analytics, topics, recommendations, timing] = await Promise.all([
        getChannelAnalytics(youtubeId),
        getTopicAnalytics(youtubeId),
        getTopicRecommendations(youtubeId),
        getPublishTiming(youtubeId),
      ]);

      setChannelAnalytics(analytics);
      setTopicAnalytics(topics);
      setTopicRecommendations(recommendations);
      setPublishTiming(timing);
    } catch (err) {
      console.error(err);

      setError("Failed to analyze channel");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold">YouTube AI Strategist</h1>

        <p className="mt-4 text-zinc-400">
          Analyze creator channels and discover high-opportunity content ideas.
        </p>

        <div className="mt-10 flex gap-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@fireship"
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 w-full"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {channelAnalytics && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold">Channel Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-zinc-900 p-6 rounded-2xl">
                <p className="text-zinc-400">Total Videos</p>

                <h3 className="text-4xl font-bold mt-2">
                  {channelAnalytics.totalVideos}
                </h3>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl">
                <p className="text-zinc-400">Average Views</p>

                <h3 className="text-4xl font-bold mt-2">
                  {Math.round(channelAnalytics.averageViews).toLocaleString()}
                </h3>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl">
                <p className="text-zinc-400">Average Likes</p>

                <h3 className="text-4xl font-bold mt-2">
                  {Math.round(channelAnalytics.averageLikes).toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        )}

        {topicRecommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold">Recommended Topics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {topicRecommendations.map((recommendation) => (
                <div
                  key={recommendation.topic}
                  className="bg-zinc-900 p-6 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold capitalize">
                    {recommendation.topic}
                  </h3>

                  <p className="text-zinc-400 mt-2">
                    {recommendation.recommendationReason}
                  </p>

                  <div className="mt-4 space-y-2">
                    <p>Trend Score: {Math.round(recommendation.trendScore)}</p>

                    <p>
                      Opportunity Score:{" "}
                      {Math.round(recommendation.opportunityScore)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {publishTiming && (
          <div className="mt-12 bg-zinc-900 p-6 rounded-2xl">
            <h2 className="text-3xl font-bold">Best Publish Time</h2>

            <p className="text-2xl mt-4 text-green-400">
              {publishTiming.recommendedPublishWindow}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
