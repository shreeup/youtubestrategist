# YouTube AI Strategist

An AI-powered creator analytics platform that analyzes YouTube channels, identifies high-performing content patterns, correlates them with external market trends, and recommends high-opportunity video topics along with optimal publishing windows.

---

# Overview

YouTube AI Strategist is a full-stack analytics platform built to help creators discover:

- Which topics historically perform best on their channel
- Which topics are currently trending externally
- Which content ideas have the highest opportunity potential
- What publishing times correlate with stronger engagement

The project focuses heavily on:

- scalable ingestion architecture
- explainable recommendation systems
- deterministic analytics pipelines
- low operational complexity
- strong TypeScript backend engineering

Unlike simple AI wrappers, this project builds a complete analytics pipeline from ingestion to recommendation generation.

---

# Demo Features

## Channel Analysis

Analyze any public YouTube creator channel by username.

Example:

```text
@fireship
@Theo
@MrBeast
```

---

## Video Ingestion Pipeline

The platform:

1. Resolves the channel from YouTube APIs
2. Fetches the uploads playlist
3. Retrieves latest videos (bounded ingestion)
4. Hydrates video statistics in batches
5. Persists normalized analytics data into PostgreSQL

---

## Topic Extraction Engine

The system performs lightweight NLP on video titles to:

- extract recurring keywords
- identify dominant creator themes
- compute engagement per topic

---

## Trend Intelligence Layer

The platform integrates Google Trends to:

- identify externally trending topics
- correlate creator strengths with market demand
- generate opportunity-driven recommendations

---

## Publish Timing Intelligence

The system analyzes:

- upload weekdays
- upload hours
- historical engagement patterns

To recommend:

- best publish day
- best publish hour
- optimal publishing windows

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts

## Backend

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- Axios
- Zod

## Analytics / NLP

- natural
- google-trends-api

---

# Architecture

```text
User Input
    ↓
YouTube Channel Resolution
    ↓
Uploads Playlist Fetch
    ↓
Video Metadata Hydration
    ↓
PostgreSQL Persistence
    ↓
Analytics Engine
    ↓
Topic Extraction
    ↓
Trend Correlation
    ↓
Recommendation Engine
    ↓
Frontend Dashboard
```

---

# Core Engineering Decisions

## 1. Bounded Video Ingestion

The platform intentionally ingests only the latest 100 videos.

### Why?

- reduces API quota usage
- improves sync speed
- keeps analytics recent
- lowers database growth
- simplifies debugging

### Tradeoff

Historical long-tail analytics become less complete.

This was considered acceptable for MVP-stage recommendation quality.

---

## 2. Sequential Database Writes

Video ingestion uses sequential Prisma upserts.

### Why?

- deterministic ingestion
- easier debugging
- clearer failure isolation
- simpler observability

### Tradeoff

Lower throughput for extremely large datasets.

The architecture can later evolve into batched concurrent writes.

---

## 3. Deterministic Recommendation System

The project intentionally begins with heuristic scoring instead of ML models.

### Why?

- explainable recommendations
- easier debugging
- easier iteration
- lower infrastructure complexity
- faster development velocity

### Tradeoff

Recommendations are less semantically sophisticated than embedding-based systems.

---

## 4. Single Runtime Architecture

The platform intentionally avoids Python microservices during MVP development.

### Why?

- simpler deployment
- lower operational complexity
- easier local development
- fewer moving parts

### Tradeoff

Some analytics ecosystems are stronger in Python.

---

# Recommendation Logic

## Engagement Score

```text
engagementScore =
views + likes * 5 + comments * 10
```

Weights intentionally prioritize:

- comments > likes > views

because comments imply deeper audience engagement.

---

## Opportunity Score

```text
opportunityScore =
trendScore * log10(averageEngagement + 1)
```

This combines:

- external trend momentum
- historical creator strength

to estimate content opportunity.

---

# API Endpoints

## Analyze Channel

```http
POST /api/analyzechannel
```

### Request

```json
{ "username": "@fireship" }
```

### Response

```json
{
  "youtubeId": "UCsBjURrPoezykLs9EqgamOA",
  "channel": "Fireship",
  "videosFetched": 100,
  "syncedAt": "2026-05-22T04:51:00.606Z"
}
```

---

## Channel Analytics

```http
GET /api/channelanalytics?youtubeId=<id>
```

---

## Topic Analytics

```http
GET /api/topicanalytics?youtubeId=<id>
```

---

## Topic Recommendations

```http
GET /api/topicrecommendations?youtubeId=<id>
```

---

## Publish Timing Analytics

```http
GET /api/publishtiming?youtubeId=<id>
```

---

# Database Schema

## Channel

Stores:

- stable YouTube identifiers
- channel metadata
- synchronization timestamps

---

## Video

Stores:

- normalized video metadata
- engagement metrics
- publish timestamps
- channel relations

---

# Local Development

## 1. Clone Repository

```bash
git clone <repo-url>
cd youtube-ai-platform
```

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

Example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/youtube_ai"
YOUTUBE_API_KEY="your_api_key"
```

---

## 4. Run Database Migrations

```bash
npx prisma migrate dev
```

---

## 5. Start Development Server

```bash
pnpm dev
```

Application runs on:

```text
http://localhost:9876
```

---

# Future Improvements

## AI / NLP

- semantic embeddings
- vector search
- topic clustering
- title generation
- thumbnail recommendation engine
- transcript analysis

---

## Analytics

- time-series engagement snapshots
- virality prediction
- audience segmentation
- upload consistency scoring
- anomaly detection

---

## Infrastructure

- Redis caching
- background ingestion jobs
- incremental synchronization
- queue-based ingestion
- rate-limit management

---

# What This Project Demonstrates

This project was intentionally designed to demonstrate:

- full-stack engineering
- API integration
- data ingestion pipelines
- analytics engineering
- recommendation systems thinking
- NLP pipelines
- TypeScript architecture
- scalable backend design
- explainable AI systems
- product-oriented engineering

---

# Why This Project Stands Out

Most AI portfolio projects are thin wrappers around LLM APIs.

This project instead focuses on:

- building analytical infrastructure
- deriving recommendation signals
- engineering explainable ranking systems
- integrating multiple external data sources
- designing scalable ingestion architecture

The emphasis is on engineering depth rather than superficial AI integration.

---
