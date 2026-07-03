# AI Recommendation Engine

## Overview

The AI recommendation engine is the core intelligence of Career Guidance. It uses the Google Gemini API to analyze a student's profile (interests, hobbies, academic level) and generate personalized career recommendations and detailed roadmaps.

## Responsibilities

1. **Career Recommendation**: Given a student's profile, generate a ranked list of suitable career paths.
2. **Roadmap Generation**: For a chosen career, generate a detailed action plan (skills, subjects, timeline).
3. **Chatbot Responses**: Answer student questions about careers, universities, and orientation.

## Integration

- **SDK**: `@google/generative-ai` (Node.js)
- **Configuration**: `src/lib/gemini/client.ts`
- **Business Logic**: `src/services/ai/`

## Prompt Design

### Career Recommendation Prompt

```
You are a career guidance advisor for students in Togo.
Given the following student profile:
- Academic level: {niveau}
- Interests: {interets}
- Hobbies: {loisirs}

Generate a list of 5 suitable career paths. For each career, provide:
- Career name
- Why it matches the student's profile
- A relevance score (0-100)
- Key sectors in the Togolese economy where this career is in demand

Respond in JSON format.
```

### Roadmap Generation Prompt

```
You are a career guidance advisor for students in Togo.
Generate a detailed roadmap for a student who wants to become a {career_name}.

The roadmap should include:
- Key skills to acquire
- Important subjects to prioritize at school/university
- Recommended university programs in Togo
- Estimated duration

Respond in JSON format.
```

### Chatbot System Prompt

```
You are "Career Guide", a friendly and knowledgeable academic advisor
for Togolese high school students and baccalaureate graduates.
Your role is to help students make informed decisions about their
academic and professional future. Be clear, encouraging, and factual.
Answer in French unless the student writes in another language.
```

## Data Flow

```
src/services/ai/recommendation.ts
    → Builds prompt from user profile
    → Calls src/lib/gemini/client.ts
    → Parses AI JSON response
    → Returns structured CareerRecommendation[]

src/services/ai/roadmap.ts
    → Builds prompt from career name
    → Calls src/lib/gemini/client.ts
    → Parses AI JSON response
    → Returns structured Roadmap

src/services/ai/chatbot.ts
    → Manages conversation history
    → Calls src/lib/gemini/client.ts (chat mode)
    → Returns string response
```

## Error Handling

- API rate limits: exponential backoff retry
- Malformed JSON response: fallback to raw text display
- Network errors: display user-friendly error message

## Model Selection

> TODO: Specify exact Gemini model (e.g., `gemini-2.0-flash`, `gemini-1.5-pro`) once API key is provided.
