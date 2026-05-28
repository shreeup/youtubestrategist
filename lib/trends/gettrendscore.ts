import googleTrends from "google-trends-api";

export async function getTrendScore(keyword: string): Promise<number> {
  try {
    const results = await googleTrends.interestOverTime({
      keyword,
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    });

    const parsedResults = JSON.parse(results);

    const timeline = parsedResults.default.timelineData ?? [];

    if (timeline.length === 0) {
      return 0;
    }

    const values = timeline.map((entry: { value: number[] }) => entry.value[0]);

    const average =
      values.reduce((sum: number, value: number) => sum + value, 0) /
      values.length;

    return average;
  } catch (error) {
    console.error(`Failed to fetch trend for ${keyword}`, error);

    return 0;
  }
}
