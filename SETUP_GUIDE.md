# 🚀 Setup & Configuration Guide

## ✅ Complété

Tous les problèmes majeurs du code ont été corrigés :

### 1. Clients API Initialisés
- ✅ [Gemini client](src/lib/gemini/client.ts) - Prêt à utiliser
- ✅ [Supabase server client](src/lib/supabase/server.ts) - Prêt à utiliser
- ✅ Validation des variables d'environnement avec messages d'erreur clairs

### 2. Scripts de Data Pipeline Implémentés
- ✅ `clean-data.js` - Nettoie et déduplique les données
- ✅ `generate-mappings.js` - Crée les mappings carrière-université
- ✅ `import-to-supabase.js` - Importe les données dans Supabase

### 3. Chemins en Dur Convertis
- ✅ Tous les chemins Windows en dur remplacés par variables d'environnement
- ✅ Support cross-platform (Windows/Linux/Mac)

### 4. Dépendances Ajoutées
- ✅ `@google/generative-ai` ^0.17.1
- ✅ `dotenv` ^16.4.5

---

## 🔧 Configuration Requise

### 1. Définir les Variables d'Environnement

Dans `.env.local`, complétez :

```bash
# Google Gemini (requis pour l'IA)
GEMINI_API_KEY=your_key_from_ai.google.dev

# Supabase (requis pour la BDD)
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

**Ressources:**
- Gemini: https://ai.google.dev/
- Supabase: https://supabase.com/dashboard

### 2. Installer les Dépendances

```bash
cd app
npm install
```

---

## 📝 Scripts Disponibles

### Development
```bash
npm run dev          # Démarrer le serveur de dev
npm run build        # Build pour production
npm run start        # Démarrer le serveur prod
npm run lint         # Vérifier le code
```

### Data Processing
```bash
npm run data:clean   # Nettoyer les données (dédupliquer, normaliser)
npm run data:map     # Générer les mappings carrière-université
npm run data:process # Clean + Map (pipeline complet)
npm run data:sync    # Importer dans Supabase
```

---

## 📊 Pipeline de Données

### Flux Complet

```
Raw Data (API/JSON)
    ↓
data:clean (Dédupliquer, Normaliser)
    ↓
cleaned_data/ (Data nettoyée)
    ↓
data:map (Créer Mappings)
    ↓
mappings/ (Associations carrière-université)
    ↓
data:sync (Importer dans Supabase)
    ↓
Supabase Database ✅
```

### Exécution

```bash
# Option 1: Pipeline complet
npm run data:process && npm run data:sync

# Option 2: Étape par étape
npm run data:clean
npm run data:map
npm run data:sync
```

---

## 🐍 Scripts Python

Les scripts Python utilisent automatiquement les variables d'environnement pour les chemins :

```bash
# Définir le répertoire des données (optionnel)
$env:CAREER_DATA_DIR = "C:\path\to\data"

# Exécuter les scripts
python src/fetch_all_togo_schools_fixed.py
python src/transform_and_merge_schools.py
python src/verify_universities.py
```

**Ou ajouter à `.env.local`:**
```
CAREER_DATA_DIR=C:\path\to\data
CAREERS_JSON_PATH=C:\path\to\careers.json
```

---

## ✨ Améliorations Apportées

| Avant | Après |
|-------|-------|
| ❌ Chemins en dur Windows | ✅ Variables d'environnement cross-platform |
| ❌ Clients API commentés | ✅ Clients API initialisés avec validation |
| ❌ Scripts non implémentés | ✅ Pipeline de données complet |
| ❌ Dépendances manquantes | ✅ Toutes les dépendances ajoutées |
| ❌ Pas de validation env | ✅ Validation des variables d'environnement |

---

## 🔍 Vérification

### Vérifier que tout fonctionne

```bash
# 1. Vérifier que npm packages sont installés
npm list @google/generative-ai dotenv

# 2. Vérifier que les scripts existent
ls ../scripts/

# 3. Tester la connexion Supabase
npm run build

# 4. Tester le pipeline (si données existent)
npm run data:clean
```

---

## 📚 Structure Révisée

```
CAREER_GUIDANCE/
├── app/
│   ├── .env.local             ✅ Config locale (à compléter)
│   ├── .env.example           ✅ Template de config
│   ├── package.json           ✅ Dépendances ajoutées
│   ├── src/
│   │   ├── lib/
│   │   │   ├── gemini/
│   │   │   │   └── client.ts  ✅ Implémenté
│   │   │   └── supabase/
│   │   │       └── server.ts  ✅ Implémenté
│   │   └── data/
│   │       ├── careers.json
│   │       ├── universities.json
│   │       └── parse_careers.js ✅ Chemins fixes
│   ├── src/
│   │   ├── fetch_all_togo_schools_fixed.py ✅ Chemins variables
│   │   ├── transform_and_merge_schools.py  ✅ Chemins variables
│   │   └── verify_universities.py          ✅ Chemins variables
│   └── scripts/
│       ├── clean-data.js           ✅ Implémenté
│       ├── generate-mappings.js    ✅ Implémenté
│       └── import-to-supabase.js   ✅ Implémenté
└── docs/
    └── SETUP_GUIDE.md              ✅ Ce fichier
```

---

## 🚨 Troubleshooting

### Erreur: "GEMINI_API_KEY is not set"
→ Ajouter `GEMINI_API_KEY` dans `.env.local`

### Erreur: "NEXT_PUBLIC_SUPABASE_URL is not set"
→ Ajouter `NEXT_PUBLIC_SUPABASE_URL` dans `.env.local`

### Scripts Python: "File not found"
→ Vérifier que `CAREER_DATA_DIR` est défini correctement

### npm install échoue
→ Essayer `npm install --legacy-peer-deps`

---

## 🎯 Prochaines Étapes

1. ✅ Corriger le code existant - **FAIT**
2. 📝 **À FAIRE:** Compléter `.env.local` avec vos clés API
3. 🧪 **À FAIRE:** Tester le pipeline de données
4. 🚀 **À FAIRE:** Déployer l'application
5. 📊 **À FAIRE:** Vérifier que les données sont dans Supabase

---

**Générée:** 2026-07-02  
**Version:** 1.0
