"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ACADEMIC_LEVELS } from "@/lib/constants";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { saveProfile } from "@/lib/supabase/auth";

const CENTRES_INTERET_LOISIRS = [
  "Technologie & Informatique",
  "Programmation",
  "Sciences & Recherche",
  "Ingénierie",
  "Échecs & Stratégie",
  "Lecture",
  "Psychologie",
  "Communication & Médias (veille technologique, vulgarisation, réseaux sociaux)",
  "Montage vidéo (présentations, tutoriels, contenu numérique)",
  "Jeux vidéo (principalement jeux de stratégie, simulation ou compétitifs)",
  "Écriture (documentation, articles, prise de notes)",
  "Photographie (technologie, voyages, créativité)",
  "Musique",
  "Voyages (découverte de cultures et technologies)",
  "Sport & Fitness",
  "Cuisine & Gastronomie",
  "Histoire (histoire des sciences, de l'informatique ou des civilisations)",
  "Création de contenu",
  "Podcast",
  "Streaming",
  "Innovation technologique",
  "Entrepreneuriat",
  "Résolution de problèmes",
  "Productivité",
  "Veille scientifique et technologique",
  "Développement de jeux vidéo"
];

const MATIERES = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "SVT",
  "Littérature",
  "Langues",
  "Histoire",
  "Géographie",
  "Philosophie",
  "Informatique",
  "Économie",
  "Sciences Sociales"
];

const COMPETENCES = [
  "Résolution de problèmes",
  "Communication",
  "Créativité",
  "Leadership",
  "Travail en équipe",
  "Analyse de données",
  "Empathie",
  "Organisation",
  "Adaptabilité",
  "Négociation"
];

const ENVIRONNEMENT = [
  "En bureau",
  "En plein air",
  "En télétravail",
  "En équipe",
  "En autonomie",
  "Horaires flexibles",
  "Environnement dynamique/rapide",
  "Cadre structuré"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [niveau, setNiveau] = useState("");
  const [selectedInterestsHobbies, setSelectedInterestsHobbies] = useState<string[]>([]);
  const [selectedMatieres, setSelectedMatieres] = useState<string[]>([]);
  const [selectedCompetences, setSelectedCompetences] = useState<string[]>([]);
  const [selectedEnvironnement, setSelectedEnvironnement] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const profile = {
      niveau,
      interets: selectedInterestsHobbies, // Mapping to 'interets' for now to match backend expectations, or we can use interets_loisirs if we update auth.ts. Let's use interets and hobbies together in auth.ts
      matieres: selectedMatieres,
      competences: selectedCompetences,
      environnement: selectedEnvironnement,
    };
    
    // Always save to localStorage
    localStorage.setItem("careerProfile", JSON.stringify(profile));
    
    // If user is logged in, also save to Supabase
    if (user) {
      await saveProfile(user.id, profile);
    }
    
    setTimeout(() => {
      router.push("/recommendations");
    }, 500);
  };

  const renderOptions = (
    options: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="mt-8 flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            onClick={() => toggleSelection(option, selected, setSelected)}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
              isSelected
                ? "border-primary bg-primary text-white shadow-md"
                : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-12 md:py-20">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span className={step >= 1 ? "text-primary" : "hidden sm:inline"}>Niveau</span>
          <span className={step >= 2 ? "text-primary" : "hidden sm:inline"}>Centres d&apos;intérêt</span>
          <span className={step >= 3 ? "text-primary" : "hidden sm:inline"}>Matières</span>
          <span className={step >= 4 ? "text-primary" : "hidden sm:inline"}>Compétences</span>
          <span className={step >= 5 ? "text-primary" : "hidden sm:inline"}>Environnement</span>
        </div>
        <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Niveau */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quel est ton niveau scolaire ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Cela nous aidera à adapter les parcours et les universités recommandées.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {ACADEMIC_LEVELS.map((level) => (
              <label
                key={level}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:border-primary ${
                  niveau === level
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <span className="font-medium text-foreground">{level}</span>
                <input
                  type="radio"
                  name="niveau"
                  value={level}
                  checked={niveau === level}
                  onChange={() => setNiveau(level)}
                  className="h-5 w-5 border-border text-primary focus:ring-primary accent-primary"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Intérêts & Loisirs */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quels sont tes centres d&apos;intérêt & loisirs ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sélectionne les domaines et activités qui t&apos;attirent le plus (plusieurs choix possibles).
          </p>
          {renderOptions(CENTRES_INTERET_LOISIRS, selectedInterestsHobbies, setSelectedInterestsHobbies)}
        </div>
      )}

      {/* Step 3: Matières */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quelles sont tes matières préférées ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Cette étape est facultative, mais elle permet d&apos;affiner tes recommandations.
          </p>
          {renderOptions(MATIERES, selectedMatieres, setSelectedMatieres)}
        </div>
      )}

      {/* Step 4: Compétences */}
      {step === 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quelles sont tes compétences clés ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Sélectionne tes points forts (soft skills et hard skills). Étape facultative.
          </p>
          {renderOptions(COMPETENCES, selectedCompetences, setSelectedCompetences)}
        </div>
      )}

      {/* Step 5: Environnement */}
      {step === 5 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl font-semibold text-foreground">
            Quel est ton environnement de travail idéal ?
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Comment aimerais-tu travailler ? Étape facultative.
          </p>
          {renderOptions(ENVIRONNEMENT, selectedEnvironnement, setSelectedEnvironnement)}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
        <button
          onClick={handleBack}
          disabled={step === 1 || isLoading}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            step === 1
              ? "text-muted-foreground opacity-50 cursor-not-allowed"
              : "text-foreground hover:text-primary"
          }`}
        >
          Retour
        </button>

        <div className="flex gap-3">
          {step > 2 && step < 5 && (
             <button
               onClick={handleNext}
               className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
             >
               Ignorer
             </button>
          )}

          {step === 5 && (
             <button
               onClick={handleSubmit}
               disabled={isLoading}
               className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
             >
               Ignorer
             </button>
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !niveau) ||
                (step === 2 && selectedInterestsHobbies.length === 0)
              }
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyse en cours...
                </>
              ) : (
                "Découvrir"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
