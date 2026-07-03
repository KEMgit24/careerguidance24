"use client";

import { useState } from "react";
import Link from "next/link";

const formations = [
  {
    id: "f_01",
    domaine: "Numérique & Informatique",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Le secteur numérique est en pleine explosion au Togo. Développeurs, ingénieurs réseaux, spécialistes en cybersécurité et data scientists sont parmi les profils les plus recherchés.",
    niveaux: ["Bac+2 (BTS)", "Bac+3 (Licence)", "Bac+5 (Master/Ingénieur)"],
    metiers: ["Développeur Web & Mobile", "Ingénieur Réseaux", "Spécialiste Cybersécurité", "Data Scientist"],
    etablissements: ["ESGIS", "DEFITECH", "Université de Lomé (CIC)", "ESAT-TOGO"],
    duree: "2 à 5 ans",
    debouches: "Excellent — forte demande locale",
    salaire_debutant: "200 000 – 450 000 FCFA/mois",
    niveauCode: "bac+3",
  },
  {
    id: "f_02",
    domaine: "Commerce & Gestion",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    description: "La gestion des entreprises et le commerce constituent le cœur de l'économie togolaise. Ces formations débouchent sur des postes dans tous les secteurs d'activité.",
    niveaux: ["Bac+2 (BTS)", "Bac+3 (Licence)", "Bac+5 (Master/MBA)"],
    metiers: ["Comptable / Contrôleur", "Responsable Commercial", "Manager", "Entrepreneur"],
    etablissements: ["ESA", "IAEC", "ESAG-NDE", "IPM-Togo", "LBS"],
    duree: "2 à 5 ans",
    debouches: "Très bon — débouchés variés",
    salaire_debutant: "150 000 – 300 000 FCFA/mois",
    niveauCode: "bac+3",
  },
  {
    id: "f_03",
    domaine: "Santé & Médecine",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    description: "Le secteur de la santé au Togo cherche constamment de nouveaux professionnels. Des médecins aux infirmiers, en passant par les techniciens de laboratoire, les besoins sont immenses.",
    niveaux: ["Bac+3 (Soins infirmiers)", "Bac+5 (Pharmacie)", "Bac+7 (Médecine)"],
    metiers: ["Médecin", "Infirmier(e)", "Sage-Femme", "Technicien de Labo", "Pharmacien"],
    etablissements: ["Université de Lomé (CHU)", "ENAM", "IADSS"],
    duree: "3 à 7 ans",
    debouches: "Excellent — pénurie locale",
    salaire_debutant: "200 000 – 500 000 FCFA/mois",
    niveauCode: "bac+7",
  },
  {
    id: "f_04",
    domaine: "Ingénierie & BTP",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    description: "Le Togo investit massivement dans ses infrastructures. Les ingénieurs en génie civil, architectes et techniciens du bâtiment ont de nombreuses opportunités sur les grands chantiers nationaux.",
    niveaux: ["Bac+2 (BTS)", "Bac+3 (Licence)", "Bac+5 (Ingénieur)"],
    metiers: ["Ingénieur Civil", "Architecte", "Topographe", "Chef de Chantier"],
    etablissements: ["EAMAU", "ESPC", "IFTS", "Université de Lomé"],
    duree: "2 à 5 ans",
    debouches: "Bon — grands chantiers en cours",
    salaire_debutant: "180 000 – 400 000 FCFA/mois",
    niveauCode: "bac+5",
  },
  {
    id: "f_05",
    domaine: "Agriculture & Agrobusiness",
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a3865?auto=format&fit=crop&w=800&q=80",
    description: "L'agriculture est le premier secteur de l'économie togolaise. L'agrobusiness moderne et les technologies agricoles offrent des perspectives d'avenir exceptionnelles pour les jeunes entrepreneurs.",
    niveaux: ["Bac+2 (Technicien)", "Bac+3 (Licence)", "Bac+5 (Master)"],
    metiers: ["Ingénieur Agronome", "Gestionnaire de Projet Agricole", "Entrepreneur Agricole"],
    etablissements: ["Université de Kara", "Université de Lomé", "École d'Agriculture"],
    duree: "2 à 5 ans",
    debouches: "Très bon — secteur prioritaire",
    salaire_debutant: "150 000 – 350 000 FCFA/mois",
    niveauCode: "bac+3",
  },
  {
    id: "f_06",
    domaine: "Droit & Administration",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    description: "Le droit et l'administration ouvrent les portes de la fonction publique, de la diplomatie, du barreau et des organisations internationales. Des formations solides et reconnues.",
    niveaux: ["Bac+3 (Licence)", "Bac+5 (Master)", "Bac+8 (Doctorat)"],
    metiers: ["Avocat", "Magistrat", "Fonctionnaire d'État", "Diplomate", "Juriste"],
    etablissements: ["Université de Lomé", "UCAO-UUT", "ISDI", "ENA"],
    duree: "3 à 8 ans",
    debouches: "Bon — secteur public et privé",
    salaire_debutant: "150 000 – 400 000 FCFA/mois",
    niveauCode: "bac+5",
  },
  {
    id: "f_07",
    domaine: "Communication & Médias",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    description: "Avec la montée du digital, les métiers de la communication et des médias se réinventent. Community managers, journalistes digitaux et spécialistes en marketing digital sont très demandés.",
    niveaux: ["Bac+2 (BTS)", "Bac+3 (Licence)", "Bac+5 (Master)"],
    metiers: ["Community Manager", "Journaliste", "Chargé de Communication", "Graphiste"],
    etablissements: ["UCAO-UUT", "Université de Lomé", "LBS", "Institut UPSILON"],
    duree: "2 à 5 ans",
    debouches: "Bon — croissance forte du digital",
    salaire_debutant: "120 000 – 280 000 FCFA/mois",
    niveauCode: "bac+3",
  },
  {
    id: "f_08",
    domaine: "Enseignement & Éducation",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    description: "Former les générations futures est une mission noble et essentielle. Les professeurs et formateurs professionnels sont toujours demandés dans les établissements publics et privés du Togo.",
    niveaux: ["Bac+3 (Licence)", "Bac+5 (CAPES/Master)"],
    metiers: ["Professeur de Collège/Lycée", "Formateur Professionnel", "Conseiller d'Orientation"],
    etablissements: ["ENS Atakpamé", "Université de Lomé", "Université de Kara"],
    duree: "3 à 5 ans",
    debouches: "Stable — recrutements réguliers",
    salaire_debutant: "130 000 – 250 000 FCFA/mois",
    niveauCode: "bac+5",
  }
];

export default function FormationsPage() {
  const [selected, setSelected] = useState<typeof formations[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filtered = formations.filter(f => {
    const matchSearch =
      f.domaine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.metiers.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchLevel = levelFilter ? f.niveauCode === levelFilter : true;
    
    return matchSearch && matchLevel;
  });

  return (
    <>
      {/* Detail panel modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center backdrop-blur-sm transition-opacity"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-premium animate-fade-in-up">
            <div className="h-48 w-full overflow-hidden rounded-t-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.domaine} className="h-full w-full object-cover" />
            </div>

            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow backdrop-blur-sm hover:bg-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">{selected.domaine}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Durée</p>
                  <p className="mt-1 font-medium text-foreground">{selected.duree}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Salaire estimé</p>
                  <p className="mt-1 font-medium text-foreground">{selected.salaire_debutant}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Niveaux disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {selected.niveaux.map((n, i) => (
                    <span key={i} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground">{n}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Métiers visés</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {selected.metiers.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Où étudier au Togo</p>
                <div className="flex flex-wrap gap-2">
                  {selected.etablissements.map((e, i) => (
                    <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{e}</span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/onboarding"
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover shadow-lg shadow-primary/20"
                >
                  Tester mon affinité
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-warm-gradient">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-heading text-4xl font-bold text-foreground">Filières & Formations</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Explore les grands domaines d&apos;études disponibles au Togo. Découvre les métiers qui recrutent, les salaires et les écoles pour chaque filière.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              placeholder="Chercher un domaine ou un métier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-panel shadow-premium flex-1 rounded-xl px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="glass-panel shadow-premium rounded-xl px-5 py-3 text-sm text-foreground focus:border-primary focus:outline-none sm:w-48"
            >
              <option value="">Tous les niveaux</option>
              <option value="bac+3">Jusqu'à Bac+3/Licence</option>
              <option value="bac+5">Jusqu'à Bac+5/Master</option>
              <option value="bac+7">Études longues (Bac+7+)</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((formation, i) => (
              <button
                key={formation.id}
                onClick={() => setSelected(formation)}
                className="card-hover shadow-premium group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-40 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formation.image} alt={formation.domaine} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">{formation.domaine}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{formation.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {formation.metiers.slice(0, 2).map((m, i) => (
                      <span key={i} className="rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">Explorer →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center bg-card">
              <p className="text-lg font-medium text-foreground">Aucun résultat</p>
              <p className="mt-2 text-sm text-muted-foreground">Modifie tes filtres pour voir plus de formations.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
