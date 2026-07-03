"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import universitiesData from "@/data/universities.json";

const QUOTES = [
  "Je ne suis pas un produit de mes circonstances. Je suis un produit de mes décisions. — Stephen Covey",
  "Le succès, c'est de tomber sept fois et de se relever huit. — Proverbe japonais",
  "Beaucoup d'hommes ayant échoué ne savaient pas à quel point ils étaient proches du succès quand ils ont abandonné. — Thomas Edison",
  "La distance entre nos rêves et la réalité s'appelle l'action. — Anonyme",
  "Les opportunités ne se produisent pas toutes seules. C'est à vous de les créer. — Chris Grosser",
  "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte. — Winston Churchill"
];

interface University {
  id: string;
  name: string;
  logo: string;
  header_image: string;
  type: string;
  location: string;
  has_cames: boolean;
  website: string;
  email: string;
  phone: string;
  description: string;
  filieres: string[];
  domains: string[];
}

export default function UniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [university, setUniversity] = useState<University | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Pick a random quote when component mounts
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));

    // Simulate loading delay so user can read the mindset quotes
    const timer = setTimeout(() => {
      const found = universitiesData.find((u) => u.id === id);
      if (found) {
        setUniversity(found as University);
      } else {
        router.push("/universities");
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [id, router]);

  if (!university) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center animate-fade-in bg-background">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-8">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="max-w-xl text-lg font-medium text-foreground italic leading-relaxed">
          &ldquo;{QUOTES[quoteIndex]}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-64 w-full md:h-80 lg:h-96">
        {university.header_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={university.header_image} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary/80 to-accent/80" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-10">
            <Link href="/universities" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white hover:underline">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Retour aux universités
            </Link>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-white shadow-xl md:h-32 md:w-32">
                {university.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={university.logo} alt="" className="h-full w-full object-contain p-2" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-4xl font-bold text-muted-foreground">
                    {university.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {university.type}
                  </span>
                  {university.has_cames && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Reconnu CAMES
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-heading font-bold text-white md:text-5xl drop-shadow-md">
                  {university.name}
                </h1>
                <p className="mt-2 text-lg font-medium text-white/90 drop-shadow">
                  📍 {university.location}
                </p>
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur px-5 py-2.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all shadow-md"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Visiter le site officiel
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-10">
            <section className="animate-fade-in-up delay-100">
              <h2 className="text-2xl font-bold text-foreground mb-4">À propos</h2>
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {university.description}
                </p>
              </div>
            </section>

            <section className="animate-fade-in-up delay-200">
              <h2 className="text-2xl font-bold text-foreground mb-4">Domaines de formation</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {university.domains?.map((domain, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <span className="font-medium text-foreground">{domain}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 animate-fade-in-up delay-300">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-4">
                Informations de contact
              </h3>
              <ul className="space-y-4">
                {university.phone && (
                  <li className="flex items-center gap-3 text-sm text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                    </div>
                    {university.phone}
                  </li>
                )}
                {university.email && (
                  <li className="flex items-center gap-3 text-sm text-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
                    </div>
                    <a href={`mailto:${university.email}`} className="hover:text-primary hover:underline">{university.email}</a>
                  </li>
                )}
                {university.website && (
                  <li className="pt-2">
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-hover hover:shadow-lg"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      Visiter le site officiel
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-b from-primary/10 to-transparent p-6 text-center">
              <h3 className="font-heading text-xl font-bold text-primary mb-2">Une question ?</h3>
              <p className="text-sm text-muted-foreground mb-6">Notre IA Conseiller est là pour vous aider avec cette école.</p>
              <Link href="/chatbot" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-hover">
                Demander à l'IA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
