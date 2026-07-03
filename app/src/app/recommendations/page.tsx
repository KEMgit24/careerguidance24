"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import careersData from "@/data/careers.json";
import roadmapsData from "@/data/roadmaps.json";
import universitiesData from "@/data/universities.json";
import { getTopRecommendations, Career as BaseCareer, MatchDetail, generateExplanation, getScoreBreakdown } from "@/lib/careerMatcher";

interface Career extends BaseCareer {
  matchScore?: number;
  detail?: MatchDetail;
}

function parseCareerFormation(career: any) {
  const f = career.formation || "";
  const name = career.nom_metier;
  const sector = career.secteur;

  let fullName = "";
  let duration = "3 ans";
  let type = "Licence / Master";
  let link = "/formations";

  if (sector.includes("Numérique") || sector.includes("Informatique")) {
    link = "/formations#f_01";
  } else if (sector.includes("Santé") || sector.includes("Médecine")) {
    link = "/formations#f_03";
  } else if (sector.includes("Ingénierie") || sector.includes("Sciences")) {
    link = "/formations#f_04";
  } else if (sector.includes("Finance") || sector.includes("Business")) {
    link = "/formations#f_02";
  } else if (sector.includes("Arts") || sector.includes("Création")) {
    link = "/formations#f_07";
  } else if (sector.includes("Éducation") || sector.includes("Formation")) {
    link = "/formations#f_08";
  } else if (sector.includes("Agriculture") || sector.includes("Environnement")) {
    link = "/formations#f_05";
  } else if (sector.includes("Administration")) {
    link = "/formations#f_06";
  }

  switch (career.id) {
    case "car_007":
      fullName = "Diplôme d'État de Docteur en Médecine";
      duration = "9-10 ans";
      type = "Doctorat";
      break;
    case "car_017":
      fullName = "Spécialisation d'Études Médicales (DES)";
      duration = "10-12 ans";
      type = "Doctorat";
      break;
    case "car_021":
      fullName = "Doctorat en Chirurgie Dentaire";
      duration = "6 ans";
      type = "Doctorat";
      break;
    case "car_019":
      fullName = "Diplôme d'État de Docteur en Pharmacie";
      duration = "6 ans";
      type = "Doctorat";
      break;
    case "car_022":
      fullName = "Diplôme d'État de Kinésithérapeute";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_023":
      fullName = "Master Professionnel en Psychologie";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_003":
      fullName = "Licence Professionnelle en Sciences Infirmières";
      duration = "3 ans";
      type = "Licence";
      break;
    case "car_024":
      fullName = "Diplôme d'État de Docteur Vétérinaire";
      duration = "6-8 ans";
      type = "Doctorat";
      break;
    case "car_025":
      fullName = "Licence Professionnelle en Service Social";
      duration = "3 ans";
      type = "Licence";
      break;
    case "car_026":
      fullName = "Licence / Master en Informatique - Spéc. Front-End";
      duration = "2 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_027":
      fullName = "Licence / Master en Informatique - Spéc. Back-End";
      duration = "2 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_001":
      fullName = "Licence / Master en Génie Logiciel (Full-Stack)";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_028":
      fullName = "Master en Cybersécurité et Systèmes";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_011":
      fullName = "Master / Doctorat en Science des Données (Data Science)";
      duration = "5 à 8 ans";
      type = "Master / Doctorat";
      break;
    case "car_029":
      fullName = "Master en Intelligence Artificielle et Deep Learning";
      duration = "5 à 8 ans";
      type = "Master / Doctorat";
      break;
    case "car_030":
      fullName = "Master en Design d'Expérience Utilisateur (UX/UI)";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_008":
      fullName = "Diplôme d'Ingénieur Civil (Génie Civil)";
      duration = "5 ans";
      type = "Master (Ingénieur)";
      break;
    case "car_031":
      fullName = "Diplôme d'Ingénieur en Génie Mécanique";
      duration = "5 ans";
      type = "Master (Ingénieur)";
      break;
    case "car_004":
      fullName = "Diplôme d'Ingénieur en Électronique et Génie Électrique";
      duration = "5 ans";
      type = "Master (Ingénieur)";
      break;
    case "car_032":
      fullName = "Master en Énergies Renouvelables et Transition Énergétique";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_033":
      fullName = "Master / Doctorat en Biologie et Biotechnologies";
      duration = "5 à 8 ans";
      type = "Master / Doctorat";
      break;
    case "car_034":
      fullName = "Master en Mathématiques Appliquées et Statistiques";
      duration = "5 à 8 ans";
      type = "Master / Doctorat";
      break;
    case "car_006":
      fullName = "Diplôme d'Expertise Comptable (DEC)";
      duration = "2 à 8 ans";
      type = "BTS / Master / DEC";
      break;
    case "car_015":
      fullName = "Master en Finance d'Entreprise / Finance de Marché";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_018":
      fullName = "Formation en Entrepreneuriat et Gestion de Projet";
      duration = "Variable";
      type = "Certificat / Autodidacte";
      break;
    case "car_005":
      fullName = "Licence / Master en Marketing et Communication Digitale";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_035":
      fullName = "Master en Gestion des Ressources Humaines";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_036":
      fullName = "Master en Conseil et Management Stratégique";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_013":
      fullName = "Master en Droit des Affaires + CAPA";
      duration = "5 ans";
      type = "Master + Certificat";
      break;
    case "car_010":
      fullName = "Master de l'Enseignement, de l'Éducation et de la Formation (MEEF)";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_037":
      fullName = "Master en Psychologie de l'Orientation scolaire et professionnelle";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_038":
      fullName = "Formation professionnelle spécialisée de formateur";
      duration = "Variable";
      type = "Certificat";
      break;
    case "car_016":
      fullName = "BTS / Licence en Design Graphique et Communication Visuelle";
      duration = "2 à 5 ans";
      type = "BTS / Licence";
      break;
    case "car_039":
      fullName = "Diplôme d'École de Cinéma / Montage et Réalisation";
      duration = "3 ans";
      type = "Licence";
      break;
    case "car_040":
      fullName = "Diplôme de Conservatoire de Musique et Composition";
      duration = "Variable";
      type = "Diplôme d'établissement";
      break;
    case "car_041":
      fullName = "BTS en Photographie / Formations qualifiantes";
      duration = "Variable";
      type = "BTS / Certificat";
      break;
    case "car_042":
      fullName = "Formations en Community Management et Création Digitale";
      duration = "Variable";
      type = "Autodidacte";
      break;
    case "car_043":
      fullName = "Licence en Journalisme et Rédac-Web";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_044":
      fullName = "Master en Game Design et Développement de Jeux Vidéo";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_045":
      fullName = "Master en Traduction et Interprétation de Conférence";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_002":
      fullName = "Diplôme d'Ingénieur Agronome";
      duration = "5 ans";
      type = "Master (Ingénieur)";
      break;
    case "car_009":
      fullName = "Master en Transport, Logistique et Supply Chain";
      duration = "3 à 5 ans";
      type = "Licence / Master";
      break;
    case "car_012":
      fullName = "Master en Gestion de Projets Internationaux (PMP)";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_046":
      fullName = "Licence STAPS / BPJEPS - Éducation Physique";
      duration = "3 ans";
      type = "Licence / Brevet";
      break;
    case "car_020":
      fullName = "Master en Relations Internationales et Diplomatie";
      duration = "5 ans";
      type = "Master";
      break;
    case "car_014":
      fullName = "CAP / BTS en Électrotechnique et Maintenance";
      duration = "2 à 3 ans";
      type = "CAP / BTS";
      break;
    case "car_047":
      fullName = "CAP / BTS en Maintenance et Mécanique Automobile";
      duration = "2 à 3 ans";
      type = "CAP / BTS";
      break;
    case "car_048":
      fullName = "CAP Cuisine / BTS Management en Hôtellerie-Restauration";
      duration = "2 à 3 ans";
      type = "CAP / BTS";
      break;
    case "car_049":
      fullName = "BTS Tourisme / Licence professionnelle en Management Touristique";
      duration = "2 à 3 ans";
      type = "BTS / Licence";
      break;
    default:
      fullName = f ? `Formation en ${f}` : `Formation pour devenir ${name}`;
      duration = "3 ans";
      type = "Licence / Master";
  }

  return { nom: fullName, original: f, duree: duration, type: type, lien: link };
}

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Career[]>([]);
  const [recommendedFormations, setRecommendedFormations] = useState<any[]>([]);
  const [recommendedUniversities, setRecommendedUniversities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedProfile = localStorage.getItem("careerProfile");
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);

      // New Recommendations Logic (Synchronous)
      const sorted = getTopRecommendations(parsedProfile, careersData.careers as any[], 8).map(c => ({
        ...c,
        matchScore: c.score
      }));
      setRecommendations(sorted as Career[]);

      // Persist for chatbot personalization
      try {
        localStorage.setItem("careerRecommendations", JSON.stringify(
          sorted.map(c => ({ id: c.id, nom_metier: c.nom_metier, secteur: c.secteur, score: c.score }))
        ));
      } catch {}

      // Aggregate recommended formations (filières) and universities
      const formationsList: any[] = [];
      const uniIds = new Set<string>();

      sorted.forEach(career => {
        const parsedF = parseCareerFormation(career);
        if (!formationsList.some(item => item.nom === parsedF.nom)) {
          formationsList.push(parsedF);
        }
        
        const roadmap = roadmapsData.roadmaps.find(r => r.career_id === career.id);
        if (roadmap && roadmap.related_universities) {
          roadmap.related_universities.forEach(uid => uniIds.add(uid));
        }
      });

      const universitiesList = universitiesData.filter(u => uniIds.has(u.id));

      setRecommendedFormations(formationsList);
      setRecommendedUniversities(universitiesList);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <svg
          className="h-10 w-10 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-4 text-sm text-muted-foreground">
          Analyse de ton profil en cours...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-foreground">
          Pas encore de profil !
        </h2>
        <p className="mt-3 text-muted-foreground max-w-md">
          Complète le questionnaire d&apos;orientation pour obtenir tes recommandations personnalisées.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Commencer le questionnaire
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground md:text-4xl">
          Tes recommandations de carrières
        </h1>
        {profile && (
          <div className="mt-3 text-sm text-primary font-semibold">
            Profil : {profile.niveau} · {profile.interets?.length || 0} intérêt(s) · {profile.matieres?.length || 0} matière(s) · {profile.competences?.length || 0} compétence(s) · {profile.environnement?.length || 0} env. de travail
          </div>
        )}
        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground px-2">
          Chaque pourcentage reflète la part de tes choix qui correspond aux critères du métier.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((career, index) => (
          <div
            key={career.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {career.secteur}
              </span>
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span className="text-xl">{career.matchScore}%</span>
                <span className="text-xs text-muted-foreground font-normal">match</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-bold text-foreground">
                {career.nom_metier}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {career.description}
              </p>

              {/* Panneau dépliable Pourquoi ce métier ? */}
              {career.detail && (
                <div className="mt-4 border-t border-border/60 pt-3">
                  <button
                    onClick={() => toggleExpand(career.id)}
                    className="flex w-full items-center justify-between py-1 text-xs font-semibold text-primary hover:text-primary-hover focus:outline-none transition-colors"
                  >
                    <span>Pourquoi ce métier ?</span>
                    <svg
                      className={`h-4 w-4 transform transition-transform ${expandedIds[career.id] ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedIds[career.id] && (
                    <div className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="rounded-xl bg-primary/5 p-3 border border-primary/10">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {generateExplanation(career.detail)}
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Décomposition du score :
                        </p>
                        <div className="space-y-2">
                          {getScoreBreakdown(career.detail).map((item, idx) => {
                            let badgeClass = "";
                            if (item.category === "Intérêt") badgeClass = "bg-primary/10 text-primary";
                            else if (item.category === "Matière") badgeClass = "bg-blue-500/10 text-blue-600";
                            else if (item.category === "Compétence") badgeClass = "bg-emerald-500/10 text-emerald-600";
                            else if (item.category === "Environnement") badgeClass = "bg-orange-500/10 text-orange-600";

                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-medium text-foreground">{item.item}</span>
                                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${badgeClass}`}>
                                      {item.category}
                                    </span>
                                  </div>
                                  <span className="font-semibold text-primary">+{Math.round(item.contribution)}%</span>
                                </div>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, Math.round(item.contribution * 5))}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skipped sections */}
                      {(() => {
                        const skipped = [];
                        if (career.detail.interets.skipped) skipped.push("tes intérêts");
                        if (career.detail.matieres.skipped) skipped.push("tes matières préférées");
                        if (career.detail.competences.skipped) skipped.push("tes compétences");
                        if (career.detail.environnement.skipped) skipped.push("ton environnement de travail idéal");

                        if (skipped.length > 0) {
                          return (
                            <p className="text-[10px] text-orange-600 italic mt-1">
                              ⚠️ Complète {skipped.join(", ")} dans ton profil pour affiner ce résultat.
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Infos additionnelles */}
              <div className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
                {career.perspectives && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Perspectives :</span>
                    <span className="font-semibold text-primary line-clamp-1">{career.perspectives}</span>
                  </div>
                )}
                {career.salaire && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Salaire mensuel (FCFA) :</span>
                    <span className="font-medium text-foreground text-right w-1/2 line-clamp-1">{career.salaire}</span>
                  </div>
                )}
              </div>

              {/* Mini Roadmap Schema */}
              {(() => {
                const roadmap = roadmapsData.roadmaps.find(r => r.career_id === career.id);
                if (roadmap && roadmap.etapes_carriere && roadmap.etapes_carriere.length > 0) {
                  return (
                    <div className="mt-5 border-t border-border/60 pt-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Parcours</p>
                      <div className="flex items-center gap-1.5">
                        {roadmap.etapes_carriere.map((etape, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <div className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary whitespace-nowrap">
                              {etape.phase}
                            </div>
                            {idx < roadmap.etapes_carriere!.length - 1 && (
                              <svg className="h-3 w-3 text-muted-foreground/50 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <Link
                href={`/roadmap/${career.id}`}
                className="mt-6 block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Voir la roadmap détaillée →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Formations et Universités */}
      {(recommendedFormations.length > 0 || recommendedUniversities.length > 0) && (
        <div className="mt-16 space-y-12">
          {recommendedFormations.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Filières recommandées</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedFormations.map((f, idx) => (
                  <Link
                    key={idx}
                    href={f.lien}
                    className="flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {f.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ⏳ {f.duree}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-2">{f.nom}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Formation requise pour l'un des métiers recommandés.
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recommendedUniversities.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Écoles & Universités suggérées</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedUniversities.map((uni) => (
                  <Link
                    key={uni.id}
                    href={`/universities/${uni.id}`}
                    className="flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <h3 className="text-sm font-bold text-foreground">{uni.nom}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{uni.type} — {uni.ville}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

