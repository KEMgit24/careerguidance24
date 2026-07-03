"use client";

import { useState, useEffect } from "react";

const QUOTES = [
  "Je ne suis pas un produit de mes circonstances. Je suis un produit de mes décisions. — Stephen Covey",
  "Le succès, c'est de tomber sept fois et de se relever huit. — Proverbe japonais",
  "Beaucoup d'hommes ayant échoué ne savaient pas à quel point ils étaient proches du succès quand ils ont abandonné. — Thomas Edison",
  "La distance entre nos rêves et la réalité s'appelle l'action. — Anonyme",
  "Les opportunités ne se produisent pas toutes seules. C'est à vous de les créer. — Chris Grosser",
  "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte. — Winston Churchill"
];

export default function Loading() {
  const [quote, setQuote] = useState(QUOTES[0]);

  useEffect(() => {
    // Pick a random quote on mount
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm px-6">
      <div className="flex flex-col items-center max-w-2xl text-center">
        {/* Loading Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center mb-8">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          <svg className="h-6 w-6 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        
        {/* Quote */}
        <p className="text-lg md:text-xl font-heading font-medium text-foreground italic animate-fade-in-up">
          "{quote.split("—")[0].trim()}"
        </p>
        <p className="mt-4 text-sm font-semibold text-primary animate-fade-in-up delay-200">
          — {quote.split("—")[1]?.trim()}
        </p>
        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground animate-pulse">
            Chargement en cours...
          </p>
        </div>
      </div>
    </div>
  );
}
