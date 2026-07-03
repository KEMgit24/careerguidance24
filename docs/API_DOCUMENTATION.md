# API Documentation

## Internal API Routes (Next.js App Router)

All API routes are located under `src/app/api/`.

---

### `POST /api/recommendations`

Generate career recommendations for the authenticated user.

**Auth**: Required (Supabase session)

**Request Body**:
```json
{
  "niveau": "Terminale",
  "interets": ["technologie", "sciences"],
  "loisirs": ["programmation", "lecture", "robotique"]
}
```

**Response**:
```json
{
  "recommendations": [
    {
      "career_id": "uuid",
      "nom_metier": "Ingénieur Logiciel",
      "description": "...",
      "pertinence": 92,
      "raison": "Votre passion pour la programmation..."
    }
  ]
}
```

---

### `POST /api/roadmap`

Generate a roadmap for a specific career.

**Auth**: Required

**Request Body**:
```json
{
  "career_id": "uuid",
  "career_name": "Ingénieur Logiciel"
}
```

**Response**:
```json
{
  "roadmap": {
    "competences_cles": ["Algorithmique", "Python", "Anglais technique"],
    "matieres_importantes": ["Mathématiques", "Physique", "Informatique"],
    "universites": [...]
  }
}
```

---

### `POST /api/chatbot`

Send a message to the AI chatbot.

**Auth**: Required

**Request Body**:
```json
{
  "message": "Quelles sont les conditions d'admission à l'ENSI ?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "model", "content": "..." }
  ]
}
```

**Response**:
```json
{
  "reply": "Pour être admis à l'ENSI, vous devez..."
}
```

---

### `GET /api/universities`

Fetch universities, optionally filtered by career.

**Auth**: Not required

**Query Params**:
- `career_id` (optional): Filter universities linked to a career

**Response**:
```json
{
  "universities": [
    {
      "id": "uuid",
      "nom_etablissement": "Université de Lomé",
      "ville": "Lomé",
      "filieres": ["Informatique", "Mathématiques"]
    }
  ]
}
```

---

## External APIs

### Google Gemini API

- **Base URL**: `https://generativelanguage.googleapis.com`
- **SDK**: `@google/generative-ai`
- **Key**: `GEMINI_API_KEY` in `.env.local`
- **Usage**: Career recommendations, roadmap generation, chatbot

### Supabase

- **Client**: `@supabase/supabase-js`
- **URL**: `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- **Anon Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- **Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (server-side only)
