// TypeScript type definitions for Career Guidance

export interface Profile {
  id: string
  nom: string
  prenom: string
  niveau: string
  interets: string[]
  loisirs: string[]
  created_at: string
  updated_at: string
}

export interface Career {
  id: string
  nom_metier: string
  description: string
  secteur: string
  keywords: string[]
}

export interface Roadmap {
  id: string
  career_id: string
  competences_cles: string[]
  matieres_importantes: string[]
}

export interface University {
  id: string
  nom_etablissement: string
  ville: string
  pays: string
  filieres: string[]
  contact?: string
}

export interface CareerRecommendation {
  career_id?: string
  nom_metier: string
  description: string
  pertinence: number
  raison: string
  secteur?: string
}

export interface UserOrientation {
  id: string
  user_id: string
  career_id: string
  pertinence: number
  saved: boolean
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'model'
  content: string
  timestamp?: string
}
