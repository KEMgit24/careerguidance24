"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const tabs = [
  {
    href: "/",
    label: "Accueil",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9" />
        <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    href: "/recommendations",
    label: "Métiers",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: "/onboarding",
    label: "Bilan",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    href: "/universities",
    label: "Écoles",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    href: "/chatbot",
    label: "Conseil",
    icon: (active: boolean) => (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth="2.5" />
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // ✅ ONLY show when installed as a PWA (standalone mode)
  // In the browser (website), this will ALWAYS return null.
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // iOS Safari uses a different API
        (window.navigator as { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();

    const mq = window.matchMedia("(display-mode: standalone)");
    mq.addEventListener("change", checkStandalone);
    return () => mq.removeEventListener("change", checkStandalone);
  }, []);

  // Never show in the web browser — only in the installed PWA
  if (!isStandalone) return null;

  return (
    <>
      {/* Spacer so page content isn't hidden behind the nav bar */}
      <div className="h-24" />

      {/* Floating Glassmorphism Bottom Nav */}
      <nav className="mobile-bottom-nav fixed bottom-4 left-4 right-4 mx-auto z-50 max-w-sm">
        <div className="mobile-nav-glass flex items-center justify-around px-2 py-2 rounded-[28px]">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname === tab.href || pathname.startsWith(tab.href + "/");

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`mobile-nav-item flex flex-col items-center gap-1 px-3 py-2 rounded-[20px] transition-all duration-300 ${
                  isActive
                    ? "mobile-nav-active text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center transition-transform duration-300 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 scale-150 blur-sm" />
                  )}
                  <div className={`relative z-10 ${isActive ? "text-primary" : ""}`}>
                    {tab.icon(isActive)}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold leading-none tracking-wide transition-all duration-300 ${
                    isActive ? "text-primary opacity-100" : "opacity-60"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
