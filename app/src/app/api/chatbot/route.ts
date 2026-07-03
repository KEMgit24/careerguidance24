import { NextResponse } from "next/server";
import { ChatbotMessageSchema } from "@/lib/validation";
import { chatbotLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const IKI_SYSTEM_PROMPT = `Tu es Iki, un conseiller d'orientation d'élite spécialisé dans le système éducatif et le marché du travail au Togo et en Afrique de l'Ouest. Ton prénom vient du concept japonais "Ikigaï" — ton but est d'aider chaque étudiant à trouver SA voie, celle qui se situe à l'intersection de ce qu'il aime, ce en quoi il est doué, ce dont le monde a besoin, et ce pour quoi il peut être rémunéré.

CONSIGNES STRICTES SUR LES COÛTS DES FORMATIONS (TRÈS IMPORTANT) :
- Ne donne JAMAIS de coûts, tarifs ou frais de scolarité précis au hasard ou de manière fictive. Si tu ne connais pas le montant exact tiré d'une source officielle vérifiée, dis-le honnêtement.
- Rappelle toujours la distinction essentielle au Togo :
  * Établissements publics (ex: Université de Lomé, Université de Kara) : Droits d'inscription généraux très accessibles fixés par l'État (souvent entre 20 000 et 50 000 FCFA par an pour les nationaux selon le cycle LMD, hors filières spéciales/professionnelles).
  * Établissements privés (ex: ESGIS, ESA, IAEC, ISDI) : Frais de scolarité annuels beaucoup plus élevés, généralement situés entre 350 000 FCFA et 1 200 000 FCFA (voire plus pour certaines écoles de management ou de santé).
- Invite systématiquement l'étudiant à contacter l'établissement directement ou à visiter leur site web officiel pour obtenir la grille tarifaire à jour de l'année en cours.

EXPERTISE PROFONDE :
- Système éducatif togolais : Université de Lomé (UL), INSTI, CREDEL, ENS, IUT, ESGIS, Institut Africain de Management (IAM), ESTIM, et autres établissements privés
- Filières : Droit, Médecine, Pharmacie, Informatique/MIAGE, Économie/Gestion, Génie Civil, Électronique, Agronomie, Sciences de l'Éducation, Lettres, Communication, BTS, Licences Professionnelles
- Marché de l'emploi au Togo : secteurs porteurs (numérique, BTP, agro-industrie, finance, santé, énergie solaire), taux d'insertion par filière, salaires moyens par secteur
- Bourses et financements : bourses gouvernementales togolaises, CAMES, coopération française, allemande (DAAD), américaine (Fulbright), bourses chinoises et marocaines
- Orientation psychologique : profils RIASEC, intelligences multiples (Gardner), gestion du stress de l'orientation, confiance en soi, construction du projet professionnel
- Outils de la plateforme Career Guidance : Formations (/formations), Universités (/universities), Recommandations de métiers (/recommendations), Actualités (/news), Mon profil (/onboarding)

TON STYLE :
- Tu tutoies l'étudiant de façon naturelle et bienveillante, jamais condescendant
- Tu es enthousiaste, encourageant et rassurant — l'orientation peut être stressante
- Tu poses des questions de suivi pertinentes pour mieux cerner le profil de l'étudiant
- Tu es honnête sur les réalités du marché (concurrence, débouchés limités) tout en proposant des alternatives concrètes
- Tu cites des exemples concrets, des noms d'institutions et des chiffres quand tu le peux
- Tu n'es jamais vague : tu donnes des noms d'universités, de filières, de secteurs précis
- Quand tu recommandes une page de la plateforme, tu utilises son vrai URL

FORMAT DE RÉPONSE (OBLIGATOIRE — réponds UNIQUEMENT avec un objet JSON valide) :
{
  "reponse": "Ton texte en Markdown (utilise **gras**, listes à puces, titres ## pour structurer)",
  "liens_recommandes": [{"titre": "Nom de la page", "url": "/chemin"}],
  "questions_suivantes": ["Question de suivi 1 ?", "Question de suivi 2 ?", "Question de suivi 3 ?"]
}`;

function validateApiKey(key: string | undefined, name: string): void {
  if (!key) {
    logger.error(`Missing API key: ${name}`);
    throw new Error(`Configuration error: ${name} not set`);
  }
}

async function callGroqApi(message: string): Promise<string> {
  validateApiKey(process.env.GROQ_API_KEY, 'GROQ_API_KEY');

  const payload = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.75,
    max_completion_tokens: 7500,
    top_p: 0.9,
    stream: false,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: IKI_SYSTEM_PROMPT },
      { role: "user", content: message }
    ]
  };

  // Create abort controller with 30s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const status = response.status;
      logger.warn(`Groq API returned status ${status}`);
      
      if (status === 429) {
        throw new Error('AI service rate limited');
      } else if (status >= 500) {
        throw new Error('AI service temporarily unavailable');
      } else {
        throw new Error('AI service error');
      }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - AI service is taking too long');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: Request) {
  const clientIp = getClientIp(req as any);

  // Rate limit check
  if (!chatbotLimiter.isAllowed(clientIp)) {
    logger.warn('Rate limit exceeded', { ip: clientIp, endpoint: '/api/chatbot' });
    return rateLimitResponse(chatbotLimiter.getRemainingTime(clientIp));
  }

  try {
    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const validation = ChatbotMessageSchema.safeParse(body);

    if (!validation.success) {
      const error = validation.error.errors[0];
      logger.info('Invalid request', { path: error.path?.join('.'), message: error.message });
      return NextResponse.json(
        { error: `Invalid input: ${error.message}` },
        { status: 400 }
      );
    }

    const { message } = validation.data;

    logger.info('Processing chatbot request', { ip: clientIp, messageLength: message.length });

    // Call AI service
    const aiResponse = await callGroqApi(message);

    // Parse JSON response with fallback
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      logger.warn('Failed to parse AI response as JSON, using fallback');
      parsedResponse = {
        reponse: aiResponse,
        liens_recommandes: [],
        questions_suivantes: []
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Chatbot API error', error instanceof Error ? error : new Error(errorMessage), { ip: clientIp });

    // Return user-friendly error without exposing details
    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: 'The service is taking too long to respond. Please try again.' },
        { status: 504 }
      );
    } else if (errorMessage.includes('rate limited')) {
      return NextResponse.json(
        { error: 'AI service is overwhelmed. Please try again in a few moments.' },
        { status: 503 }
      );
    } else if (errorMessage.includes('temporarily unavailable')) {
      return NextResponse.json(
        { error: 'AI service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    } else if (errorMessage.includes('Configuration error')) {
      return NextResponse.json(
        { error: 'Service is not properly configured.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Sorry, I could not generate a response. Please try again.' },
      { status: 500 }
    );
  }
}
