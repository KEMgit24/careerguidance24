# 🎓 Career Guidance

**Description (3 à 5 lignes) :**
Career Guidance est une plateforme web intelligente conçue pour accompagner les lycéens et nouveaux bacheliers togolais dans leur orientation scolaire et professionnelle. En analysant les passions, la personnalité et le niveau académique via l'Intelligence Artificielle, le système génère des recommandations de carrières ciblées et une feuille de route détaillée. Notre objectif est de fournir un conseiller d'orientation numérique, personnalisé et accessible 24h/24 pour transformer l'incertitude étudiante en un parcours structuré.

## ⚠️ Problématique & Track

- **Track correspondant :** Bâtir sa Nation (Hackathon TCC 2026)
- **Problématique choisie :** Au Togo, des milliers de bacheliers s'orientent par mimétisme ou par défaut, sans accompagnement personnalisé. Cela entraîne un fort taux d'échec universitaire et une inadéquation sévère entre les compétences des jeunes diplômés et les besoins réels du marché de l'emploi local.

## 📂 Architecture du Projet

L'architecture repose sur un modèle Frontend/Backend intégré via Next.js, couplé à des services externes pour l'IA et la base de données :

- **Frontend :** Next.js 15 (App Router), Tailwind CSS v3, TypeScript.
- **Backend / API :** Next.js API Routes, intégration avec l'API Google Gemini.
- **Base de Données & Authentification :** Supabase (PostgreSQL).

```text
CAREER_GUIDANCE/
├── app/                  # Application principale
│   ├── src/
│   │   ├── app/          # Pages et Routes de l'application
│   │   ├── components/   # Composants UI réutilisables
│   │   ├── lib/          # Clients API (Supabase, Gemini)
│   │   └── services/     # Logique métier et fonctions utilitaires
├── docs/                 # Documentation technique
├── supabase/             # Fichiers de configuration et schémas SQL
└── data/                 # Données statiques
```

## ⚙️ Prérequis

Pour faire tourner le projet localement, vous aurez besoin des éléments suivants :
- **Système d'exploitation :** Windows 10/11, macOS, ou Linux.
- **Outils :** 
  - Git
  - Node.js (version 18.17 ou supérieure)
  - npm, yarn ou pnpm
- **Comptes / API :** 
  - Un compte Supabase (pour la base de données et l'authentification)
  - Une clé API Google Gemini

## 🛠️ Étapes d'installation détaillées

1. **Cloner le dépôt sur votre machine locale :**
   ```bash
   git clone https://github.com/ZeroDay/TCCHackDefend2026_Zero_Day.git
   ```

2. **Accéder au répertoire de l'application :**
   ```bash
   cd TCCHackDefend2026_Zero_Day/app
   ```
   *(Note : si vous êtes déjà dans le répertoire du projet, placez-vous simplement dans le dossier `app`)*

3. **Installer les dépendances du projet :**
   ```bash
   npm install
   ```

4. **Configurer les variables d'environnement :**
   - Dupliquez le fichier `.env.local.example` et nommez-le `.env.local`.
   - Ouvrez `.env.local` et renseignez les valeurs de vos clés d'API (URL et clé anonyme Supabase, clé API Gemini).

## 🚀 Étapes de lancement de l'application

1. **Démarrer le serveur de développement :**
   Une fois l'installation terminée, exécutez la commande suivante :
   ```bash
   npm run dev
   ```

2. **Accéder à l'application :**
   Ouvrez votre navigateur web et allez à l'adresse suivante :
   [http://localhost:3000](http://localhost:3000)

## 🔑 Identifiants de test (Compte Démo)

Si vous souhaitez tester les fonctionnalités sans créer de compte, utilisez ces identifiants de test :
- **Email :** `jury@tcc-hack.tg`
- **Mot de passe :** `HackDefend2026!`

## 👥 Les membres de l'équipe

Équipe **Zero_Day** :
- KASSANG Essognim Marcel Junior (`kassangjunior24@gmail.com`)
- EZIMORA Chioma (`chiomaezimora93@gmail.com`)
- AGBODJA Edem Delson (`agbodjaedem@gmail.com`)
- ALLAI Edewa Junior
