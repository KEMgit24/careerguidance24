"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import universitiesData from "@/data/universities.json";

// Import map dynamically with no SSR
const UniversityMap = dynamic(() => import("@/components/universities/UniversityMap"), {
  ssr: false,
});

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

const universities: University[] = universitiesData as University[];

const allLocations = [
  ...new Set(universities.map((u) => (u.location || "").trim())),
].filter(Boolean).sort();

const allTypes = [
  ...new Set(universities.map((u) => u.type)),
].filter(Boolean).sort();

import Link from "next/link";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [camesFilter, setCamesFilter] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.domains && u.domains.some((d) => d.toLowerCase().includes(search.toLowerCase())));
      const matchLocation = locationFilter ? u.location === locationFilter : true;
      const matchType = typeFilter ? u.type === typeFilter : true;
      const matchCames = camesFilter ? u.has_cames : true;

      return matchSearch && matchLocation && matchType && matchCames;
    });
  }, [search, locationFilter, typeFilter, camesFilter]);

  return (
    <>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-10 animate-fade-in">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Universités & Écoles
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground mx-auto sm:mx-0">
            Explore {universities.length} établissements d&apos;enseignement supérieur au Togo. Trouve l&apos;école idéale pour ta future carrière.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl glass-panel shadow-premium p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Chercher une école, un domaine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Toutes les villes</option>
                {allLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Tous les types</option>
                {allTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={camesFilter}
                  onChange={(e) => setCamesFilter(e.target.checked)}
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-medium text-foreground">Reconnu CAMES uniquement</span>
              </label>
            </div>
            
            <div className="flex items-center justify-end">
              <div className="flex rounded-lg border border-border p-1 bg-surface">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Carte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {filteredUniversities.length} résultat{filteredUniversities.length !== 1 && "s"}
          </p>
        </div>

        {view === "map" ? (
          <div className="animate-fade-in-up">
            <UniversityMap universities={filteredUniversities} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUniversities.map((uni, i) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.id}`}
                className="card-hover shadow-premium group flex flex-col items-start overflow-hidden rounded-2xl border border-border bg-card text-left"
                style={{ animationDelay: `${(i % 10) * 50}ms` }}
              >
                <div className="flex w-full items-center justify-between border-b border-border bg-muted/50 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                    {uni.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={uni.logo} alt="" className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">{uni.name.charAt(0)}</span>
                    )}
                  </div>
                  {uni.has_cames && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      CAMES
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 w-full">
                  <h3 className="line-clamp-2 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {uni.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-surface px-2 py-1 border border-border/50">{uni.type}</span>
                    <span>·</span>
                    <span>📍 {uni.location}</span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {uni.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Voir les détails →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredUniversities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-lg font-medium text-foreground">Aucune école trouvée</p>
            <p className="mt-2 text-sm text-muted-foreground">Essaie de modifier tes filtres de recherche.</p>
          </div>
        )}
      </div>
    </>
  );
}
