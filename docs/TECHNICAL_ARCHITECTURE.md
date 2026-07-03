# Technical Architecture

## Stack Overview

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Frontend           | Next.js (App Router) + TypeScript   |
| Styling            | Tailwind CSS v3                     |
| AI Engine          | Google Gemini API                   |
| Backend / Database | Supabase (PostgreSQL)               |
| Authentication     | Supabase Auth                       |
| Package Manager    | npm                                 |

## Frontend - Next.js App Router

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 — all classes defined by the user, zero autonomous design decisions
- **Folder structure**: `src/` directory with App Router (`src/app/`), components, services, lib, hooks, types, store, styles

### Pages / Routes

| Route                  | Description                                              |
|------------------------|----------------------------------------------------------|
| `/`                    | Landing / Home page                                      |
| `/auth`                | Authentication (sign in / sign up)                       |
| `/onboarding`          | Profile setup — interests, hobbies, academic level       |
| `/dashboard`           | Student dashboard overview                               |
| `/recommendations`     | AI-generated career recommendations                      |
| `/roadmap/[careerSlug]`| Detailed roadmap for a specific career                   |
| `/universities`        | List of universities per career/domain                   |
| `/chatbot`             | AI chatbot interface                                     |
| `/profile`             | User profile management                                  |
| `/settings`            | Account settings                                         |

## AI Engine - Google Gemini API

- **Purpose**: Career recommendation generation, roadmap generation, chatbot responses
- **Model**: To be specified (e.g., `gemini-1.5-flash` or `gemini-2.0-flash`)
- **Integration**: Via `@google/generative-ai` SDK or REST API
- **Location**: `src/lib/gemini/` for configuration, `src/services/ai/` for business logic

## Backend - Supabase

- **Database**: PostgreSQL (managed by Supabase)
- **Auth**: Supabase Auth (email/password)
- **Real-time**: Supabase Realtime (optional, for chatbot sessions)
- **Edge Functions**: For server-side AI calls (see `supabase/functions/`)

## Environment Variables

All sensitive credentials are stored in `.env.local` (never committed to version control).

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

## Data Flow

```
Student fills profile
       ↓
Interests + Hobbies + Level → Gemini API
       ↓
AI generates career recommendations
       ↓
Student selects a career
       ↓
Gemini API generates roadmap (skills, subjects, universities)
       ↓
Data persisted in Supabase (user profile, saved careers)
       ↓
Chatbot available for Q&A at any step
```
