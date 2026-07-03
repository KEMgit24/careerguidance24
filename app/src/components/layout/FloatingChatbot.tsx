"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function FloatingChatbot() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    // Petite animation d'entrée après 1.2s
    const t = setTimeout(() => setVisible(true), 1200);
    // Arrête le pulse après 5s
    const p = setTimeout(() => setPulse(false), 5000);
    return () => { clearTimeout(t); clearTimeout(p); };
  }, []);

  // N'affiche pas sur la page chatbot
  if (pathname === "/chatbot") return null;

  const handleClick = () => {
    router.push("/chatbot");
  };

  return (
    <div
      className={`fixed bottom-24 right-5 z-50 transition-all duration-500 md:bottom-8 md:right-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full right-0 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="whitespace-nowrap rounded-xl bg-card border border-border shadow-lg px-4 py-2.5">
            <p className="text-sm font-semibold text-foreground">Parler à Iki</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ton conseiller d&apos;orientation IA</p>
          </div>
          {/* Flèche vers le bas */}
          <div className="absolute right-5 top-full -translate-y-px border-4 border-transparent border-t-border" />
          <div className="absolute right-5 top-full -translate-y-[3px] border-4 border-transparent border-t-card" />
        </div>
      )}

      {/* Pulse ring */}
      {pulse && (
        <span className="absolute inset-0 rounded-full animate-ping bg-primary/40" />
      )}

      {/* Bouton principal */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
        aria-label="Ouvrir le conseiller IA Iki"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:bg-primary-hover hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/30"
      >
        {/* Chapeau de diplômé — même SVG que la navbar */}
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>

        {/* Point vert "en ligne" */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success ring-2 ring-card">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </span>
      </button>
    </div>
  );
}
