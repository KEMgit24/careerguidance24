"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import careersData from "@/data/careers.json";
import roadmapsData from "@/data/roadmaps.json";
import universitiesData from "@/data/universities.json";
import moodleCoursesData from "@/data/moodle_courses.json";
import { calculateCareerScore, generateExplanation } from "@/lib/careerMatcher";

// ─── Types ────────────────────────────────────────────────────────────────
interface SoftSkill { nom: string; description: string; emoji: string; }
interface EtapeCarriere { phase: string; actions: string[]; couleur: string; }
interface ChapitreDetail { chapitre: string; application: string; }
interface MatierDetail { matiere: string; priorite: string; chapitres: ChapitreDetail[]; }

interface Roadmap {
  career_id: string;
  competences_cles: string[];
  soft_skills?: SoftSkill[];
  etapes_carriere?: EtapeCarriere[];
  matieres_importantes: string[];
  matieres_details?: MatierDetail[];
  related_universities: string[];
}

const COULEUR_MAP: Record<string, string> = {
  primary: "bg-primary/10 border-primary/30 text-primary",
  success: "bg-success/10 border-success/30 text-success",
  warning: "bg-warning/10 border-warning/30 text-warning",
  info: "bg-info/10 border-info/30 text-info",
};

const PRIORITE_COLOR: Record<string, string> = {
  "Indispensable": "bg-primary text-white",
  "Très important": "bg-warning/80 text-white",
  "Important": "bg-muted text-foreground",
};

// ─── Constants ────────────────────────────────────────────────────────────
const MOODLE_CLASSES = [
  "Seconde A4",
  "Seconde C & D",
  "Première A4",
  "Première C",
  "Première D",
  "Terminale A4",
  "Terminale C",
  "Terminale D",
];

const mapSubjectToMoodle = (subject: string): string => {
  const norm = subject.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (norm.includes("math")) return "Mathématiques";
  if (norm.includes("physique") || norm.includes("chimie") || norm.includes("science physique")) return "Physique-Chimie";
  if (norm.includes("svt") || norm.includes("sciences de la vie")) return "SVT";
  if (norm.includes("anglais")) return "Anglais";
  if (norm.includes("francais") || norm.includes("litterature")) return "Français";
  if (norm.includes("histoire") || norm.includes("geographie")) return "Histoire-Géographie";
  if (norm.includes("philo")) return "Philosophie";
  if (norm.includes("allemand")) return "Allemand";
  if (norm.includes("espagnol")) return "Espagnol";
  if (norm.includes("ecm") || norm.includes("civique")) return "ECM";
  return "";
};

// ─── Page ─────────────────────────────────────────────────────────────────
export default function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const career = careersData.careers.find((c) => c.id === id);

  // States
  const [selectedClass, setSelectedClass] = useState<string>("Terminale D");
  const [checkedChapters, setCheckedChapters] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<string[] | null>(null);
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  // Load profile from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedProfile = localStorage.getItem("careerProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        const niveau = parsed.niveau?.toLowerCase() || "";
        if (niveau.includes("seconde")) {
          setSelectedClass("Seconde C & D");
        } else if (niveau.includes("premiere") || niveau.includes("première")) {
          setSelectedClass("Première D");
        } else if (niveau.includes("terminale") || niveau.includes("terminal")) {
          setSelectedClass("Terminale D");
        }
      } catch {}
    }
  }, []);

  // Compute matching explanation
  useEffect(() => {
    if (profile && career) {
      try {
        const { detail } = calculateCareerScore(profile, career as any);
        const expText = generateExplanation(detail);
        setExplanation(expText);
      } catch (err) {
        console.error("Failed to compute explanation:", err);
      }
    }
  }, [profile, career]);

  // Load AI-generated concrete missions
  useEffect(() => {
    if (!career) return;
    setIsLoadingMissions(true);
    fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metier: career.nom_metier,
        competences: (career as any).competences_techniques || [],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMissions(data.missions || []);
        setIsLoadingMissions(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoadingMissions(false);
      });
  }, [career]);

  // Chatbot CTA handler
  const askChatbot = () => {
    if (typeof window !== "undefined" && career) {
      localStorage.setItem(
        "chatbot_context",
        JSON.stringify({
          metier: career.nom_metier,
          secteur: career.secteur,
          description: career.description,
        })
      );
      router.push("/chatbot");
    }
  };

  // Load/save moodle progress
  useEffect(() => {
    if (typeof window === "undefined" || !id || !selectedClass) return;
    const key = `moodle_progress_${id}_${selectedClass}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCheckedChapters(JSON.parse(saved));
      } catch {
        setCheckedChapters({});
      }
    } else {
      setCheckedChapters({});
    }
  }, [id, selectedClass]);

  const handleToggleChapter = (chapter: string) => {
    setCheckedChapters((prev) => {
      const updated = { ...prev, [chapter]: !prev[chapter] };
      const key = `moodle_progress_${id}_${selectedClass}`;
      if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  if (!career) return notFound();

  let roadmap = roadmapsData.roadmaps.find((r) => r.career_id === id) as Roadmap | undefined;
  if (!roadmap) {
    roadmap = {
      career_id: id,
      competences_cles: (career as any).competences_techniques || (career as any).competences || [],
      soft_skills: ((career as any).soft_skills || []).map((sk: string) => ({
        nom: sk,
        description: "Compétence utile pour ce profil.",
        emoji: "✨",
      })),
      etapes_carriere: [
        { phase: "Lycée", actions: ["Obtenir un baccalauréat pertinent (filières adaptées)"], couleur: "primary" },
        { phase: "Études Supérieures", actions: [(career as any).formation || "Poursuivre des études dans ce domaine", "Se spécialiser"], couleur: "warning" },
        { phase: "Vie Professionnelle", actions: ["Acquérir de l'expérience pratique", "Développement continu"], couleur: "success" },
      ],
      matieres_importantes: (career as any).match_matieres || [],
      matieres_details: [],
      related_universities: [],
    };
  }

  const recommendedUniversities = universitiesData.filter((u) =>
    roadmap!.related_universities.includes(u.id)
  );

  // Moodle subjects & progress
  const classCourses = (moodleCoursesData.classes as any)[selectedClass] || {};
  const relevantMoodleSubjects = roadmap.matieres_importantes
    .map((sub) => {
      const moodleSubKey = mapSubjectToMoodle(sub);
      const chapters = moodleSubKey ? (classCourses[moodleSubKey] || []) : [];
      return { originalSubject: sub, moodleSubject: moodleSubKey, chapters: chapters as string[] };
    })
    .filter((item) => item.chapters.length > 0);

  let totalChaptersCount = 0;
  let masteredChaptersCount = 0;
  relevantMoodleSubjects.forEach((sub) => {
    sub.chapters.forEach((chap) => {
      totalChaptersCount++;
      if (checkedChapters[chap]) masteredChaptersCount++;
    });
  });
  const progressPercent = totalChaptersCount > 0
    ? Math.round((masteredChaptersCount / totalChaptersCount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-primary px-6 py-14 text-white md:px-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour aux recommandations
          </Link>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
            {career.secteur}
          </span>
          <h1 className="text-3xl font-bold md:text-5xl leading-tight">{career.nom_metier}</h1>
          <p className="mt-4 text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
            {career.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {career.salaire && (
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20">
                <p className="text-xs text-white/60 uppercase tracking-wide">Salaire mensuel</p>
                <p className="font-semibold mt-0.5">{career.salaire}</p>
              </div>
            )}
            {career.perspectives && (
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20 max-w-sm">
                <p className="text-xs text-white/60 uppercase tracking-wide">Perspectives</p>
                <p className="font-semibold mt-0.5 text-xs sm:text-sm">{career.perspectives}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 space-y-12">

        {/* ── 0. ALIGNEMENT AVEC TON PROFIL ───────────────────────────────── */}
        {explanation && (
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌸</span>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Pourquoi ce métier te correspond ?</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
                <button
                  onClick={askChatbot}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow"
                >
                  💬 Poser une question sur ce métier au chatbot
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── 1. SCHÉMA VISUEL DU PARCOURS ─────────────────────────────────── */}
        {roadmap.etapes_carriere && roadmap.etapes_carriere.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Ton parcours, étape par étape</h2>
              <p className="text-sm text-muted-foreground mt-1">De la classe de Terminale jusqu&apos;au sommet de ta carrière</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-success to-info z-0" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {roadmap.etapes_carriere.map((etape, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg text-2xl ${
                      idx === 0 ? "bg-primary text-white" :
                      idx === 1 ? "bg-success text-white" :
                      idx === 2 ? "bg-amber-400 text-white" :
                      "bg-blue-500 text-white"
                    }`}>
                      {idx + 1}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-foreground">{etape.phase}</h3>
                    <ul className="mt-3 space-y-1.5 w-full">
                      {etape.actions.map((action, i) => (
                        <li key={i} className={`rounded-lg px-3 py-2 text-xs text-left border ${COULEUR_MAP[etape.couleur] ?? "bg-muted border-border text-foreground"}`}>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 2. SOFT SKILLS ──────────────────────────────────────────────── */}
        {roadmap.soft_skills && roadmap.soft_skills.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Soft Skills indispensables</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Les compétences humaines et comportementales qui font la différence dans ce métier.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmap.soft_skills.map((skill, idx) => (
                <div key={idx} className="group rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-primary font-bold text-xs">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{skill.nom}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{skill.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 3. COMPÉTENCES TECHNIQUES ──────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Compétences techniques à maîtriser</h2>
            <p className="text-sm text-muted-foreground mt-1">Ce que tu devras savoir faire concrètement dans ce métier.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.competences_cles.map((skill, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-primary font-bold text-xs">{idx + 1}</span>
                </div>
                <span className="text-sm text-foreground leading-relaxed">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MATIÈRES PRIORITAIRES AU LYCÉE ──────────────────────────── */}
        {roadmap.matieres_details && roadmap.matieres_details.length > 0 ? (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Matières prioritaires au lycée</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pour chaque matière : des <strong>exemples de chapitres</strong> et comment ils s&apos;appliquent <strong>directement dans ce métier</strong>.
              </p>
            </div>
            <div className="space-y-6">
              {roadmap.matieres_details.map((matiere, mIdx) => (
                <div key={mIdx} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-4">
                    <h3 className="font-bold text-foreground text-base">{matiere.matiere}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${PRIORITE_COLOR[matiere.priorite] ?? "bg-muted text-foreground"}`}>
                      {matiere.priorite}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {matiere.chapitres.map((ch, cIdx) => (
                      <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="flex items-start gap-3 px-6 py-4 md:border-r border-border">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Chapitre</p>
                            <p className="text-sm font-medium text-foreground">{ch.chapitre}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 px-6 py-4 bg-success/5">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-success/20">
                            <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-success/80 uppercase tracking-wide mb-1">Dans le métier</p>
                            <p className="text-sm text-foreground leading-relaxed">{ch.application}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Matières importantes au lycée</h2>
            <div className="flex flex-wrap gap-3">
              {roadmap.matieres_importantes.map((matiere, index) => (
                <div key={index} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground">
                  {matiere}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 4.5. COURS MOODLE À MAÎTRISER ──────────────────────────────── */}
        {relevantMoodleSubjects.length > 0 && (
          <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="bg-primary/5 border-b border-border px-6 py-5 sm:flex sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2 md:text-2xl">
                  <span>🎯</span> Préparation Scolaire (Cours Moodle)
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Sélectionne ta classe pour voir les chapitres du programme national à maîtriser pour ce parcours.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <label htmlFor="class-select" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                  Ma classe :
                </label>
                <select
                  id="class-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                >
                  {MOODLE_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6">
              {/* Barre de progression globale */}
              <div className="mb-8 rounded-xl bg-muted/40 p-4 border border-border/60">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-foreground mb-2">
                  <span>Progression globale de préparation</span>
                  <span className="text-primary font-extrabold text-base">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/30">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {masteredChaptersCount} sur {totalChaptersCount} chapitres maîtrisés dans les matières recommandées pour ce métier.
                </p>
              </div>

              {/* Grid des matières */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevantMoodleSubjects.map((sub, sIdx) => {
                  const checkedInSubject = sub.chapters.filter((c) => checkedChapters[c]).length;
                  const subjectProgress = Math.round((checkedInSubject / sub.chapters.length) * 100);
                  return (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-border/70 bg-surface overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between bg-muted/30 px-4 py-3 border-b border-border/70">
                        <span className="font-bold text-foreground text-sm flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                          {sub.originalSubject}
                        </span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {subjectProgress}%
                        </span>
                      </div>
                      <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {sub.chapters.map((chap, cIdx) => {
                          const isChecked = !!checkedChapters[chap];
                          return (
                            <label
                              key={cIdx}
                              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50 ${
                                isChecked
                                  ? "border-success/30 bg-success/5 text-muted-foreground"
                                  : "border-border/60 bg-card text-foreground"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleChapter(chap)}
                                className="mt-0.5 h-4 w-4 border-border rounded text-success focus:ring-success accent-success shrink-0"
                              />
                              <div className="flex-1">
                                <span className={`text-xs sm:text-sm font-medium transition-all ${
                                  isChecked ? "line-through text-muted-foreground/75" : ""
                                }`}>
                                  {chap}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 5. FORMATION REQUISE ────────────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Formation requise</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Parcours académique recommandé pour exercer ce métier au Togo.
          </p>
          <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-5 py-4">
            <svg className="h-6 w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span className="text-sm font-semibold text-foreground">{career.formation}</span>
          </div>
        </section>

        {/* ── 5.5. MISSIONS CONCRÈTES (IA) ────────────────────────────────── */}
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Missions concrètes au Togo</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Exemples de ce que tu feras vraiment dans ce poste, selon le contexte local.
          </p>
          {isLoadingMissions ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <svg className="h-5 w-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">Génération par IA en cours...</span>
            </div>
          ) : missions && missions.length > 0 ? (
            <div className="space-y-3">
              {missions.map((mission, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-5 py-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{mission}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* ── 6. CONTEXTE TOGO ────────────────────────────────────────────── */}
        {(career as any).contexte_togo && (
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Contexte au Togo</h2>
                <p className="text-sm text-foreground leading-relaxed">{(career as any).contexte_togo}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 7. UNIVERSITÉS ──────────────────────────────────────────────── */}
        {recommendedUniversities.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Où étudier au Togo ?</h2>
              <p className="text-sm text-muted-foreground mt-1">Établissements recommandés pour cette carrière</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommendedUniversities.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/universities?search=${encodeURIComponent(uni.name)}`}
                  className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      {uni.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={uni.logo} alt="" className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
                          {uni.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {uni.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">{uni.location}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/universities" className="text-sm font-medium text-primary hover:underline">
                Voir tous les établissements →
              </Link>
            </div>
          </section>
        )}

        {/* ── 8. CTA CHATBOT ──────────────────────────────────────────────── */}
        <section className="rounded-2xl bg-primary px-8 py-10 text-white text-center">
          <div className="mx-auto max-w-md">
            <h2 className="text-xl font-bold mb-2">Des questions sur {career.nom_metier} ?</h2>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Iki, ton conseiller IA, connaît ce métier et le marché togolais. Pose-lui toutes tes questions — formations, salaires, débouchés, candidatures...
            </p>
            <button
              onClick={askChatbot}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-primary hover:bg-white/90 transition-colors shadow-lg"
            >
              💬 Discuter avec Iki
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
