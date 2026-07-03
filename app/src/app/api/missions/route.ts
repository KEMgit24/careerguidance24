import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { metier, competences } = await req.json();
    if (!metier) {
      return NextResponse.json({ error: "Métier manquant" }, { status: 400 });
    }

    const competencesList = competences && competences.length > 0 ? competences : ["générales"];
    const prompt = `Liste 3 missions concrètes et courtes (1 phrase chacune) pour un ${metier} au Togo, en te basant sur ses compétences : ${competencesList.join(", ")}. Réponds uniquement sous forme de tableau JSON de chaînes de caractères (ex: ["Mission 1", "Mission 2", "Mission 3"]). Pas d'autres textes, pas de formatage markdown, juste le tableau JSON.`;

    let missions: string[] = [];

    // Try Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        missions = JSON.parse(cleaned);
      } catch (e) {
        console.error("Gemini failed for missions:", e);
      }
    }

    // Try Groq if Gemini failed or key not present
    if ((!missions || missions.length === 0) && process.env.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "You output JSON arrays. For example: {\"missions\": [\"Mission 1\", \"Mission 2\", \"Mission 3\"]}" },
              { role: "user", content: prompt }
            ]
          })
        });
        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0]?.message?.content || "{}");
          missions = parsed.missions || [];
        }
      } catch (e) {
        console.error("Groq failed for missions:", e);
      }
    }

    // Fallback if AI fails
    if (!missions || missions.length < 3) {
      missions = [
        `Participer activement aux projets et tâches de ${metier} au sein des structures togolaises.`,
        `Appliquer les compétences de ${competencesList.slice(0, 2).join(" et ")} pour résoudre des problématiques locales.`,
        `Assurer le suivi régulier et le développement des activités liées au secteur.`
      ];
    }

    return NextResponse.json({ missions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
