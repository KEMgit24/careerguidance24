# Deployment Guide

## Prerequisites

- Node.js 18+
- npm
- Supabase account and project
- Google Gemini API key
- Vercel account (recommended for Next.js deployment)

---

## Local Development

1. **Clone the repository**
   ```bash
   cd d:\Hack_end_year\CAREER_GUIDANCE\app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration files in `supabase/migrations/` in order
3. Enable Row Level Security (RLS) on all tables
4. Configure Supabase Auth (email/password provider)
5. Seed initial data using scripts in `scripts/`

---

## Production Deployment (Vercel)

1. Push the `app/` folder to a GitHub repository
2. Import the repository in [vercel.com](https://vercel.com)
3. Set environment variables in the Vercel dashboard
4. Deploy

**Build command**: `npm run build`  
**Output directory**: `.next`  
**Node.js version**: 18.x

---

## Environment Variables Reference

| Variable                          | Where Used         | Description                    |
|-----------------------------------|--------------------|--------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | Client + Server    | Supabase project URL           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Client-side only   | Supabase anonymous key         |
| `SUPABASE_SERVICE_ROLE_KEY`       | Server-side only   | Supabase admin key (never expose client-side) |
| `GEMINI_API_KEY`                  | Server-side only   | Google Gemini API key          |
