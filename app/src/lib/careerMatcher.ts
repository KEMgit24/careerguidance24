// ─────────────────────────────────────────────────────────────────────────────
// careerMatcher.ts — Algorithme de recommandation par poids par proposition
// Zero_Day · Career Guidance · TCC Hack & Defend 2026
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  niveau?: string;
  interets?: string[];
  matieres?: string[];
  competences?: string[];
  environnement?: string[];
}

export interface Career {
  id: string;
  nom_metier: string;
  secteur: string;
  description: string;
  salaire: string;
  formation: string;
  competences_techniques: string[];
  soft_skills: string[];
  perspectives: string;
  match_interets: string[];
  match_matieres: string[];
  match_competences: string[];
  match_environnement: string[];
  contexte_togo?: string;
  keywords?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// POIDS DU FORMULAIRE
// Les 100 points sont repartis entre les 4 categories selon leur importance.
// Chaque item selectionne dans une categorie a un poids unitaire egal.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_WEIGHTS = {
  interets: 40,  // 40 pts repartis sur les items interets
  matieres: 25,  // 25 pts repartis sur les items matieres
  competences: 20,  // 20 pts repartis sur les items competences
  environnement: 15,  // 15 pts repartis sur les items environnement
};

// Nombre total d'options disponibles dans chaque categorie du formulaire
const CATEGORY_SIZES = {
  interets: 26,
  matieres: 12,
  competences: 10,
  environnement: 8,
};

// Poids unitaire par item selectionne dans chaque categorie
const ITEM_WEIGHTS = {
  interets: CATEGORY_WEIGHTS.interets / CATEGORY_SIZES.interets,      // ~1.54 pts
  matieres: CATEGORY_WEIGHTS.matieres / CATEGORY_SIZES.matieres,      // ~2.08 pts
  competences: CATEGORY_WEIGHTS.competences / CATEGORY_SIZES.competences,   // ~2.00 pts
  environnement: CATEGORY_WEIGHTS.environnement / CATEGORY_SIZES.environnement, // ~1.875 pts
};

// ─────────────────────────────────────────────────────────────────────────────
// NORMALISATION — supprime les accents et met en minuscule pour la comparaison
// ─────────────────────────────────────────────────────────────────────────────

const normalize = (str: string): string =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

// ─────────────────────────────────────────────────────────────────────────────
// MATCH D'UN ITEM — exact = 1.0, partiel = 0.5, aucun = 0
// ─────────────────────────────────────────────────────────────────────────────

const matchScore = (userItem: string, careerItems: string[]): number => {
  const nc = normalize(userItem);
  const normalizedCareer = careerItems.map(normalize);

  // Match exact
  if (normalizedCareer.includes(nc)) return 1.0;

  // Match partiel — evite les faux positifs courts (< 4 caracteres)
  if (nc.length >= 4) {
    const partial = normalizedCareer.some(
      c => c.includes(nc) || nc.includes(c)
    );
    if (partial) return 0.5;
  }

  return 0;
};

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL D'UN MATCH PAR CATEGORIE
// Retourne pour chaque item selectionne : son nom, sa contribution en points,
// et s'il a matche ou non.
// ─────────────────────────────────────────────────────────────────────────────

export interface ItemMatch {
  item: string;
  matched: boolean;
  contribution: number; // points apportes au score final
}

export interface CategoryDetail {
  items: ItemMatch[];
  totalContribution: number;
  maxPossible: number;
  skipped: boolean; // l'utilisateur a ignore cette etape
}

export interface MatchDetail {
  interets: CategoryDetail;
  matieres: CategoryDetail;
  competences: CategoryDetail;
  environnement: CategoryDetail;
}

// ─────────────────────────────────────────────────────────────────────────────
// CALCUL DU SCORE ET DES DETAILS — coeur de l'algorithme
// ─────────────────────────────────────────────────────────────────────────────

const computeCategoryDetail = (
  userChoices: string[] | undefined,
  careerMatches: string[],
  category: keyof typeof ITEM_WEIGHTS
): CategoryDetail => {
  const skipped = !userChoices || userChoices.length === 0;

  if (skipped) {
    return {
      items: [],
      totalContribution: 0,
      maxPossible: 0,
      skipped: true,
    };
  }

  const unitWeight = ITEM_WEIGHTS[category];
  const items: ItemMatch[] = userChoices.map(choice => {
    const score = matchScore(choice, careerMatches);
    return {
      item: choice,
      matched: score > 0,
      contribution: parseFloat((score * unitWeight).toFixed(2)),
    };
  });

  const totalContribution = items.reduce((sum, i) => sum + i.contribution, 0);
  // Score maximum possible si tous les items selectionnes matchaient a 100%
  const maxPossible = parseFloat((userChoices.length * unitWeight).toFixed(2));

  return { items, totalContribution, maxPossible, skipped: false };
};

export const calculateCareerScore = (
  user: UserProfile,
  career: Career
): { score: number; detail: MatchDetail } => {

  const interetsDetail = computeCategoryDetail(user.interets, career.match_interets || [], "interets");
  const matieresDetail = computeCategoryDetail(user.matieres, career.match_matieres || [], "matieres");
  const competencesDetail = computeCategoryDetail(user.competences, career.match_competences || [], "competences");
  const environnementDetail = computeCategoryDetail(user.environnement, career.match_environnement || [], "environnement");

  // Score brut = somme des contributions de tous les items matches
  const rawScore =
    interetsDetail.totalContribution +
    matieresDetail.totalContribution +
    competencesDetail.totalContribution +
    environnementDetail.totalContribution;

  // Score maximum possible compte tenu des items selectionnes par l'utilisateur
  const maxPossible =
    interetsDetail.maxPossible +
    matieresDetail.maxPossible +
    competencesDetail.maxPossible +
    environnementDetail.maxPossible;

  // Score final = proportion du max possible atteint, ramene sur 100
  // Si l'utilisateur a tres peu d'items, le score reflete mieux la realite
  const score = maxPossible > 0
    ? Math.round((rawScore / maxPossible) * 100)
    : 0;

  return {
    score,
    detail: {
      interets: interetsDetail,
      matieres: matieresDetail,
      competences: competencesDetail,
      environnement: environnementDetail,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP RECOMMANDATIONS — avec diversite forcee par secteur (max 2 par secteur)
// ─────────────────────────────────────────────────────────────────────────────

export interface ScoredCareer extends Career {
  score: number;
  detail: MatchDetail;
}

export const getTopRecommendations = (
  user: UserProfile,
  careers: Career[],
  topN: number = 8
): ScoredCareer[] => {

  // 1. Calcul du score pour chaque metier
  const scored: ScoredCareer[] = careers
    .map(c => {
      const { score, detail } = calculateCareerScore(user, c);
      return { ...c, score, detail };
    })
    .filter(c => c.score >= 10) // seuil minimum — evite les recommandations non pertinentes
    .sort((a, b) => b.score - a.score);

  // 2. Diversite forcee — max 2 metiers par secteur dans le top N
  const result: ScoredCareer[] = [];
  const sectorCount: Record<string, number> = {};

  for (const career of scored) {
    if (result.length >= topN) break;
    const count = sectorCount[career.secteur] || 0;
    if (count < 2) {
      result.push(career);
      sectorCount[career.secteur] = count + 1;
    }
  }

  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERATION DE L'EXPLANATION PERSONNALISEE
// Produit une phrase naturelle expliquant pourquoi ce metier a ete recommande.
// ─────────────────────────────────────────────────────────────────────────────

export const generateExplanation = (detail: MatchDetail): string => {
  const parts: string[] = [];

  // Items qui ont matche dans chaque categorie, tries par contribution decroissante
  const matched = (cat: CategoryDetail) =>
    cat.items
      .filter(i => i.matched)
      .sort((a, b) => b.contribution - a.contribution)
      .map(i => i.item);

  const interetsMatched = matched(detail.interets);
  const matieresMatched = matched(detail.matieres);
  const competencesMatched = matched(detail.competences);
  const environnementMatched = matched(detail.environnement);

  if (interetsMatched.length > 0) {
    const top = interetsMatched.slice(0, 3);
    parts.push(`ton intérêt pour ${formatList(top)}`);
  }

  if (matieresMatched.length > 0) {
    const top = matieresMatched.slice(0, 2);
    parts.push(`tes résultats en ${formatList(top)}`);
  }

  if (competencesMatched.length > 0) {
    const top = competencesMatched.slice(0, 2);
    parts.push(`ta compétence en ${formatList(top)}`);
  }

  if (environnementMatched.length > 0) {
    const top = environnementMatched.slice(0, 2);
    parts.push(`ta préférence pour le travail ${formatList(top).toLowerCase()}`);
  }

  // Etapes ignorees — invite a completer le profil
  const skippedHints: string[] = [];
  if (detail.matieres.skipped) skippedHints.push("tes matières préférées");
  if (detail.competences.skipped) skippedHints.push("tes compétences");
  if (detail.environnement.skipped) skippedHints.push("ton environnement de travail idéal");

  if (parts.length === 0) {
    return "Ajoute plus d'informations à ton profil pour obtenir une explication personnalisée.";
  }

  let explanation = `Ce métier correspond à ${parts.join(", ")}.`;

  if (skippedHints.length > 0) {
    explanation += ` Précise ${formatList(skippedHints)} pour affiner ce résultat.`;
  }

  return explanation;
};

// ─────────────────────────────────────────────────────────────────────────────
// DECOMPOSITION DU SCORE — pour afficher "ton score se decompose ainsi..."
// ─────────────────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  item: string;
  category: string;
  contribution: number;
}

export const getScoreBreakdown = (detail: MatchDetail): ScoreBreakdown[] => {
  const breakdown: ScoreBreakdown[] = [];

  const addCategory = (cat: CategoryDetail, label: string) => {
    cat.items
      .filter(i => i.matched && i.contribution > 0)
      .forEach(i => breakdown.push({
        item: i.item,
        category: label,
        contribution: i.contribution,
      }));
  };

  addCategory(detail.interets, "Intérêt");
  addCategory(detail.matieres, "Matière");
  addCategory(detail.competences, "Compétence");
  addCategory(detail.environnement, "Environnement");

  // Trier par contribution decroissante
  return breakdown.sort((a, b) => b.contribution - a.contribution);
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRE — formatte une liste en francais : "A, B et C"
// ─────────────────────────────────────────────────────────────────────────────

const formatList = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(", ")} et ${last}`;
};
