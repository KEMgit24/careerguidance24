"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { signOut } from "@/lib/supabase/auth";
import { PWAInstallPrompt } from "./PWAInstallPrompt";

const navLinks = [
  { href: "/formations", label: "Formations" },
  { href: "/universities", label: "Universités" },
  { href: "/recommendations", label: "Métiers" },
  { href: "/chatbot", label: "Conseil" },
  { href: "/#actualites", label: "Actualités" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass bg-card/80 border-b border-border shadow-sm"
          : "bg-card border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-transform group-hover:scale-105">
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-foreground">
            Career<span className="text-primary"> Guidance</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary bg-primary-light"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: theme, install, auth */}
        <div className="flex items-center gap-2">
          {/* Desktop-only options */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30"
              title={theme === "light" ? "Mode sombre" : "Mode clair"}
            >
              {theme === "light" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              )}
            </button>

            <PWAInstallPrompt />
          </div>

          {/* Auth / Profile — Always visible */}
          {user ? (
            <Link
              href="/profile"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover transition-colors shrink-0"
              title={`Mon profil — ${user.firstName ?? user.email}`}
            >
              {(user.firstName ?? user.email).charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              Se connecter
            </Link>
          )}

          {/* Mobile menu button — hidden in PWA (handled by bottom bar), visible in browser */}
          <button
            className="hide-in-pwa lg:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-hover transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 border-t border-border" : "max-h-0"
        }`}
      >
        <div className="bg-card px-6 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-primary-light"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-2 pt-3 border-t border-border mt-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground"
            >
              {theme === "light" ? "🌙 Sombre" : "☀️ Clair"}
            </button>
          </div>
          
          <Link
            href="/onboarding"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white mt-3"
          >
            Commencer
          </Link>
        </div>
      </div>
    </header>
  );
}
