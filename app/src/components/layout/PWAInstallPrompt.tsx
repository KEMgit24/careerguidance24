"use client";

import { useState, useEffect } from "react";

export function PWAInstallPrompt() {
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check if already dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) {
      setDismissed(true);
      return;
    }

    // Already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsApple(ios);

    // Chrome/Edge — capture the install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuide(!showGuide);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "true");
  };

  // Don't render on server, when installed, or when dismissed
  if (!isMounted || isInstalled || dismissed) return null;

  return (
    <>
      {/* ── Desktop Navbar Button ── */}
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="hidden lg:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors ml-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Installer l&apos;App
        </button>
      )}

      {/* ── Mobile Floating Banner ── */}
      <div className="lg:hidden fixed bottom-20 left-3 right-3 z-[9999]">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-3.5">
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            {/* Text */}
            <div className="flex-1 text-left min-w-0">
              <h4 className="text-sm font-bold text-foreground">Installer l&apos;application</h4>
              <p className="text-[11px] text-muted-foreground leading-tight truncate">
                Ajoute Career Guidance à ton écran d&apos;accueil
              </p>
            </div>
            {/* Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Fermer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={handleInstall}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-all active:scale-95 shadow-md shadow-primary/20"
              >
                {showGuide ? "Fermer" : "Installer"}
              </button>
            </div>
          </div>

          {/* Guide étape par étape */}
          {showGuide && (
            <div className="border-t border-border bg-muted/40 px-4 py-3.5">
              <p className="text-xs font-bold text-foreground mb-2.5">
                {isApple ? "Sur iPhone / iPad (Safari) :" : "Sur Android (Chrome) :"}
              </p>
              <ol className="space-y-2">
                {isApple ? (
                  <>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
                      <span className="text-[11px] text-muted-foreground">Appuie sur <strong className="text-foreground">Partager</strong> (⎋) en bas de Safari</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">2</span>
                      <span className="text-[11px] text-muted-foreground">Choisis <strong className="text-foreground">« Sur l&apos;écran d&apos;accueil »</strong></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">3</span>
                      <span className="text-[11px] text-muted-foreground">Appuie sur <strong className="text-foreground">« Ajouter »</strong></span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
                      <span className="text-[11px] text-muted-foreground">Appuie sur <strong className="text-foreground">⋮</strong> (menu) en haut à droite</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">2</span>
                      <span className="text-[11px] text-muted-foreground">Choisis <strong className="text-foreground">« Installer l&apos;application »</strong></span>
                    </li>
                  </>
                )}
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
