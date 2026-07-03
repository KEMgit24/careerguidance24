"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/lib/supabase/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      const { error: err } = await signUp(email, password, firstName);
      if (err) {
        setError(err);
      } else {
        setSuccess("Compte créé ! Vérifie ta boite email pour confirmer ton inscription, puis connecte-toi.");
        setMode("login");
      }
    } else {
      const { user, error: err } = await signIn(email, password);
      if (err || !user) {
        setError(err ?? "Erreur de connexion");
      } else {
        router.push("/profile");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">
              Career<span className="text-primary"> Guidance</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-8">
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                mode === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                mode === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ton prénom"
                  required
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground mt-1">Minimum 6 caractères</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? "Chargement..."
                : mode === "login"
                ? "Se connecter"
                : "Créer mon compte"}
            </button>
          </form>

          {/* Back to home */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link href="/" className="hover:text-primary transition-colors">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Tes données sont sécurisées et ne sont jamais partagées.
        </p>
      </div>
    </div>
  );
}
