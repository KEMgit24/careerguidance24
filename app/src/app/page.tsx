"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import universitiesData from "@/data/universities.json";
import newsData from "@/data/news.json";

const UniversityMap = dynamic(() => import('@/components/UniversityMap'), {
  ssr: false,
});

/* ───── Scroll-reveal hook ───── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ───── Animated counter ───── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(interval); }
            setCount(current);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ───── Featured university ───── */
const featuredUni = universitiesData.find((u) => u.id === "uni_022") || universitiesData[0];

/* ───── Testimonials data ───── */
const testimonials = [
  {
    name: "Ama K.",
    role: "Étudiante en Informatique — ESGIS",
    quote: "Grâce à Career Guidance, j'ai découvert que ma passion pour les jeux vidéo pouvait devenir une carrière en développement logiciel. Aujourd'hui je code mes propres projets !",
    avatar: "AK",
  },
  {
    name: "Kodjo M.",
    role: "Ingénieur Agronome — Université de Kara",
    quote: "Je ne savais pas que l'agriculture moderne offrait autant d'opportunités au Togo. La feuille de route m'a donné une vision claire de mon parcours.",
    avatar: "KM",
  },
  {
    name: "Efia D.",
    role: "Infirmière — ENAM Lomé",
    quote: "Le bilan d'orientation m'a confirmé ma vocation pour la santé. Les informations sur les écoles et les salaires m'ont aidée à convaincre mes parents.",
    avatar: "ED",
  },
];

/* ───── Stats ───── */
const stats = [
  { value: 96, suffix: "", label: "Établissements répertoriés" },
  { value: 20, suffix: "+", label: "Carrières analysées" },
  { value: 8, suffix: "", label: "Filières d'études" },
  { value: 500, suffix: "+", label: "Étudiants guidés" },
];

/* ───── Profile cards ───── */
const profiles = [
  {
    title: "Lycéen(ne)",
    desc: "Tu es en 3ème, Seconde, Première ou Terminale et tu veux commencer à réfléchir à ton avenir.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Nouveau Bachelier",
    desc: "Tu viens d'avoir ton Bac et tu dois choisir ta filière et ton université. Le moment est crucial.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Étudiant(e)",
    desc: "Tu es déjà à l'université mais tu envisages une réorientation ou un changement de filière.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

/* ───── Steps ───── */
const steps = [
  { 
    title: "Orientation personnalisée", 
    desc: "Un test intelligent basé sur tes passions et tes talents.",
    icon: (
      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.671zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  { 
    title: "Universités du Togo", 
    desc: "Explore toutes les universités et leurs formations.",
    icon: (
      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
    color: "text-blue-600",
    bgColor: "bg-blue-600/10"
  },
  { 
    title: "Roadmap détaillée", 
    desc: "Un plan pas à pas pour atteindre ton objectif.",
    icon: (
      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    color: "text-purple-600",
    bgColor: "bg-purple-600/10"
  },
  { 
    title: "Assistant IA", 
    desc: "Pose tes questions et reçois des conseils instantanément.",
    icon: (
      <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    color: "text-green-600",
    bgColor: "bg-green-600/10"
  },
];

export default function Home() {
  const heroRef = useReveal();
  const profilesRef = useReveal();
  const stepsRef = useReveal();
  const statsRef = useReveal();
  const testimonialsRef = useReveal();
  const uniRef = useReveal();
  const consultRef = useReveal();

  return (
    <div className="flex flex-col">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden min-h-[100dvh] lg:min-h-0">
        {/* Arrière-plan */}
        <div
          className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat lg:opacity-15"
          style={{ backgroundImage: "url('/bg1.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/55 to-background lg:from-background/40 lg:via-background/80 lg:to-background" />
        <div className="absolute left-[-10%] top-[-10%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute right-[-10%] top-[20%] h-[350px] w-[350px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

        {/* ── MOBILE layout (< lg) ── */}
        <div className="lg:hidden relative z-10 flex flex-col min-h-[100dvh] px-4 pt-12 pb-4">
          {/* Top: titre + sous-titre + bouton + stats légères */}
          <div className="flex-1 flex flex-col justify-start pt-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 mb-3 w-max backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Orientation Intelligente</span>
            </div>
            
            <h1 className="font-heading text-[2.25rem] font-bold leading-tight tracking-tight text-foreground max-w-[280px]">
              Trouve ta voie,{" "}
              <span className="gradient-text">pas au hasard.</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-[280px]">
              Bilan de carrière, vitrine universitaire, feuille de route personnalisée — tout ce qu&apos;il te faut pour choisir avec assurance.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
              >
                Commencer
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/formations"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                S&apos;orienter
              </Link>
            </div>

            {/* Petite ligne de stats très légère */}
            <div className="mt-6 flex items-center gap-4 text-[10px] font-semibold text-muted-foreground">
               <div className="flex items-center gap-1.5">
                 <span className="text-primary font-extrabold text-sm">96</span> Écoles
               </div>
               <div className="h-3 w-px bg-border/60"></div>
               <div className="flex items-center gap-1.5">
                 <span className="text-accent font-extrabold text-sm">20+</span> Carrières
               </div>
               <div className="h-3 w-px bg-border/60"></div>
               <div className="flex items-center gap-1.5">
                 <svg className="h-3.5 w-3.5 text-foreground/70" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                 </svg>
                 <span className="text-foreground/80">Match 92%</span>
               </div>
            </div>
          </div>

          {/* Bottom: carte des 4 étapes, au-dessus de la nav */}
          <div className="shrink-0 mb-20 w-[92%] max-w-[340px]">
            <div className="shadow-premium rounded-3xl border border-border bg-card/95 backdrop-blur-md p-4">
              <div className="grid grid-cols-2 gap-x-2 gap-y-4 divide-x divide-border/40">
                {steps.map((s, index) => (
                  <div key={s.title} className={`flex flex-col items-center text-center px-2 ${index > 1 ? 'pt-2 border-t border-border/40' : ''}`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${s.bgColor} ${s.color} mb-1.5`}>
                      <div className="scale-75">{s.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-foreground leading-tight">{s.title}</h3>
                      <p className="text-[8px] leading-relaxed text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout (>= lg) ── */}
        <div ref={heroRef} className="reveal hidden lg:block relative mx-auto w-full max-w-7xl px-6 py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="mt-6 font-heading text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Trouve ta voie,{" "}
                <span className="gradient-text">pas au hasard.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Bilan de carrière, vitrine universitaire, feuille de route personnalisée —
                tout ce qu&apos;il te faut pour choisir avec assurance.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30"
                >
                  Commencer maintenant
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/formations"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                >
                  S&apos;orienter
                </Link>
              </div>
            </div>
            {/* Hero illustration */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-float glass-panel rounded-2xl p-8 shadow-premium">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-primary/10 p-4 text-center">
                      <p className="text-2xl font-bold text-primary">96</p>
                      <p className="text-xs text-muted-foreground">Écoles</p>
                    </div>
                    <div className="rounded-xl bg-accent/10 p-4 text-center">
                      <p className="text-2xl font-bold text-accent">20+</p>
                      <p className="text-xs text-muted-foreground">Carrières</p>
                    </div>
                    <div className="col-span-2 rounded-xl border border-border bg-surface p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Match: 92%</p>
                          <p className="text-xs text-muted-foreground">Développeur Web</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-xl bg-accent/20 blur-2xl" />
                <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ═══════ QUI ES-TU ? ═══════ */}
      <section className="border-t border-border">
        <div ref={profilesRef} className="reveal mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
              Qui es-tu ?
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground px-4">
              Choisis ton profil pour une expérience personnalisée.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profiles.map((p) => (
              <Link
                key={p.title}
                href="/onboarding"
                className="card-hover shadow-premium group flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all hover:border-primary/40"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  {p.icon}
                </div>
                <h3 className="mt-4 sm:mt-5 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <span className="mt-5 text-sm font-medium text-primary group-hover:underline">
                  C&apos;est moi →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ COMMENT ÇA MARCHE (DESKTOP ONLY) ═══════ */}
      <section id="how-it-works" className="hidden lg:block border-t border-border bg-muted">
        <div ref={stepsRef} className="reveal mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
              Comment ça marche
            </span>
            <h2 className="mt-2 sm:mt-3 font-heading text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
              4 étapes simples
            </h2>
          </div>
          <div className="mt-10 sm:mt-14 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">            {steps.map((s, i) => (
              <div key={s.title} className="shadow-premium relative flex flex-col items-start rounded-2xl border border-border bg-card p-6" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${s.bgColor} ${s.color} mb-4`}>
                  {s.icon}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="border-t border-border">
        <div ref={statsRef} className="reveal mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
              La plateforme en chiffres
            </span>
          </div>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="shadow-premium flex flex-col items-center rounded-2xl border border-border bg-card p-4 sm:p-6 text-center">
                <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground md:text-5xl">
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 sm:mt-2 text-[11px] sm:text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="border-t border-border bg-muted">
        <div ref={testimonialsRef} className="reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Ils ont aussi réussi
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Témoignages
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover shadow-premium flex flex-col rounded-2xl border border-border bg-card p-6">
                <svg className="h-8 w-8 text-primary/30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                </svg>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ UNIVERSITÉ DU MOIS ═══════ */}
      <section className="border-t border-border">
        <div ref={uniRef} className="reveal mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent">
              Université du mois
            </span>
          </div>
          <div className="mt-8 sm:mt-10 mx-auto max-w-3xl overflow-hidden rounded-2xl border-2 border-accent/30 bg-card shadow-premium">
            <div className="h-40 sm:h-48 w-full overflow-hidden bg-muted">
              {featuredUni.header_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredUni.header_image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-accent/10">
                  <svg className="h-12 w-12 sm:h-16 sm:w-16 text-accent/30" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4">
                {featuredUni.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featuredUni.logo} alt="" className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-border object-contain p-1 bg-white" />
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{featuredUni.name}</h3>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5">📍 {featuredUni.location} · {featuredUni.type}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{featuredUni.description}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">

                <Link href="/universities" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
                  En savoir plus
                </Link>
                {featuredUni.website && (
                  <a href={featuredUni.website} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover">
                    Site officiel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CARTE DES UNIVERSITÉS ═══════ */}
      <section className="border-t border-border bg-muted">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Localisation
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Carte des Établissements
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
              Découvrez la répartition géographique des universités et instituts à travers le pays.
            </p>
          </div>
          <UniversityMap universities={universitiesData} />
        </div>
      </section>

      {/* ═══════ ACTUALITÉS (NEWS) ═══════ */}
      <section id="actualites" className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
                S'informer
              </span>
              <h2 className="mt-2 sm:mt-3 font-heading text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
                Actualités & Marché de l'emploi
              </h2>

              <p className="mt-4 max-w-2xl text-base text-muted-foreground">
                Découvrez les dernières avancées du système éducatif togolais et les tendances du marché du recrutement pour mieux orienter votre carrière.
              </p>
            </div>
            <Link
              href="#actualites"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Voir tous les articles
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((news, i) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="card-hover shadow-premium group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <span className="absolute bottom-4 left-4 z-20 rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    {news.category}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    {news.date}
                  </p>
                  <h3 className="mb-3 font-heading text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {news.excerpt}
                  </p>
                  <div className="mt-auto pt-6">
                    <span className="text-sm font-semibold text-primary">
                      Lire la suite →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONSULT ═══════ */}
      <section className="relative border-t border-border bg-muted overflow-hidden">
        {/* Arrière-plan personnalisé (Image 2) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url('/bg2.jpg')" }}
        />
        <div className="absolute inset-0 bg-muted/70" />
        <div ref={consultRef} className="reveal relative mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-2xl glass-panel shadow-premium p-6 sm:p-8 md:p-12 text-center">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tu préfères parler à quelqu&apos;un ?
            </span>
            <h2 className="mt-3 sm:mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
              Consulte un conseiller d&apos;orientation
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pas toujours facile de choisir seul. Notre IA est là pour t&apos;accompagner — sans jugement, sans pression.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/chatbot"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                Lancer le chat IA
              </Link>
              <a
                href="mailto:contact@careerguide.tg"
                className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
              >
                Nous écrire
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
