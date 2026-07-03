"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { signOut, saveProfile } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";

interface LocalProfile {
  niveau?: string;
  interets?: string[];
  loisirs?: string[];
}

interface ChatSession {
  id: string;
  titre: string;
  messages?: any[];
  createdAt: string;
  created_at?: string;
}

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [localProfile, setLocalProfile] = useState<LocalProfile | null>(null);
  const [localSessions, setLocalSessions] = useState<ChatSession[]>([]);
  const [cloudSessions, setCloudSessions] = useState<ChatSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [syncingProfile, setSyncingProfile] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const rawProfile = localStorage.getItem("careerProfile");
      if (rawProfile) setLocalProfile(JSON.parse(rawProfile));
      const rawSessions = localStorage.getItem("iki_chat_sessions");
      if (rawSessions) setLocalSessions(JSON.parse(rawSessions));
    } catch {}
  }, []);

  // Load cloud sessions if user is logged in
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_sessions")
      .select("id, titre, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setCloudSessions(data.map(s => ({ ...s, createdAt: s.created_at })));
      });
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    await refresh();
    router.push("/");
  };

  // Sync local profile to cloud
  const handleSyncProfile = async () => {
    if (!user || !localProfile) return;
    setSyncingProfile(true);
    setSyncMessage(null);
    const { error } = await saveProfile(user.id, {
      niveau: localProfile.niveau ?? "",
      interets: localProfile.interets ?? [],
      hobbies: localProfile.loisirs ?? [],
    });
    setSyncingProfile(false);
    setSyncMessage(error ? "Erreur de synchronisation." : "Profil synchronisé !");
    await refresh();
    setTimeout(() => setSyncMessage(null), 3000);
  };

  if (!mounted || loading) return null;

  // Displayed profile: cloud data takes priority
  const displayProfile = user
    ? {
        niveau: user.niveau ?? localProfile?.niveau,
        interets: user.interets ?? localProfile?.interets ?? [],
        loisirs: user.hobbies ?? localProfile?.loisirs ?? [],
      }
    : localProfile;

  const displaySessions = user && cloudSessions.length > 0 ? cloudSessions : localSessions;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── HEADER ── */}
      <div className="relative overflow-hidden bg-primary px-6 py-16 text-white md:px-12 md:py-24">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-4xl font-bold shadow-lg backdrop-blur-md">
              {user ? (user.firstName ?? user.email).charAt(0).toUpperCase() : "👤"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-5xl">
                {user ? `Bonjour, ${user.firstName ?? "toi"} !` : "Mon Espace Personnel"}
              </h1>
              <p className="mt-2 text-white/80 text-sm md:text-base max-w-xl">
                {user
                  ? `Connecté avec ${user.email} · Toutes tes données sont sauvegardées dans le cloud.`
                  : "Tes données sont locales. Connecte-toi pour les retrouver partout."}
              </p>
            </div>
            {user && (
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="shrink-0 rounded-xl bg-white/20 hover:bg-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
              >
                {signingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mx-auto mt-8 max-w-5xl px-6 md:-mt-12 md:px-12 relative z-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ── COLONNE GAUCHE ── */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Informations</h2>
                <Link
                  href="/onboarding"
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  Modifier
                </Link>
              </div>

              {displayProfile ? (
                <div className="space-y-5">
                  {displayProfile.niveau && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Niveau Scolaire</p>
                      <p className="text-sm font-medium text-foreground">{displayProfile.niveau}</p>
                    </div>
                  )}

                  {displayProfile.interets && displayProfile.interets.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Centres d'intérêt</p>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.interets.map((i) => (
                          <span key={i} className="rounded-lg border border-primary/20 bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {displayProfile.loisirs && displayProfile.loisirs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Loisirs & Passions</p>
                      <div className="flex flex-wrap gap-2">
                        {displayProfile.loisirs.map((l) => (
                          <span key={l} className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu n'as pas encore enregistré tes informations.
                  </p>
                  <Link
                    href="/onboarding"
                    className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all"
                  >
                    Créer mon profil
                  </Link>
                </div>
              )}
            </div>

            {/* Cloud Card */}

            <div className={`rounded-2xl border p-6 ${user ? "border-success/20 bg-success/5" : "border-primary/20 bg-primary-light/40"}`}>
              {user ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <h3 className="text-sm font-bold text-foreground">Cloud actif</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Toutes tes données sont sauvegardées dans le cloud. Tu peux y accéder depuis n'importe quel appareil.
                  </p>
                  {localProfile && (
                    <>
                      <button
                        onClick={handleSyncProfile}
                        disabled={syncingProfile}
                        className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 shadow-sm"
                      >
                        {syncingProfile ? "Synchronisation..." : "Sync profil local → cloud"}
                      </button>
                      {syncMessage && (
                        <p className={`text-xs text-center mt-2 ${syncMessage.startsWith("Erreur") ? "text-error" : "text-success"}`}>
                          {syncMessage}
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-primary mb-2">Sauvegarde cloud</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Tes données sont actuellement sauvegardées sur cet appareil uniquement. Connecte-toi pour les retrouver partout.
                  </p>
                  <Link
                    href="/auth"
                    className="block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm"
                  >
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── COLONNE DROITE ── */}
          <div className="space-y-6 lg:col-span-2">
            {/* Raccourcis */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">Explorer mes pistes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/recommendations" className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary hover:bg-primary-light transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary">Métiers recommandés</p>
                    <p className="text-xs text-muted-foreground mt-1">Découvre les carrières qui correspondent à ton profil.</p>
                  </div>
                </Link>
                <Link href="/universities" className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary hover:bg-primary-light transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary">Écoles & Universités</p>
                    <p className="text-xs text-muted-foreground mt-1">Trouve les meilleures formations près de chez toi.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Historique */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">Historique avec Iki</h2>
                  {user && cloudSessions.length > 0 && (
                    <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary font-medium">Cloud</span>
                  )}
                </div>
                <Link href="/chatbot" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm">
                  Nouveau Chat
                </Link>
              </div>

              {displaySessions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {displaySessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/40 transition-colors">
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{s.titre}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {s.messages && <span>{s.messages.length} messages</span>}
                          {s.messages && <span>&bull;</span>}
                          <span>{new Date(s.createdAt ?? s.created_at ?? "").toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <Link
                        href="/chatbot"
                        onClick={() => localStorage.setItem("iki_active_session", s.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors"
                        title="Reprendre la conversation"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3">Tu n'as pas encore discuté avec ton conseiller virtuel.</p>
                  <p className="text-xs text-muted-foreground">Iki peut t'aider à y voir plus clair sur ton orientation !</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
