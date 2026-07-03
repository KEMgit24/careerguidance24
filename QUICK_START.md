# ⚡ Quick Start Guide

## 30 Secondes pour Démarrer

### 1️⃣ Configurer les Variables d'Environnement
```bash
# Dans app/.env.local, ajouter:
GEMINI_API_KEY=your_key_from_ai.google.dev
SUPABASE_SERVICE_ROLE_KEY=your_key_from_supabase
```

### 2️⃣ Installer les Dépendances
```bash
cd app
npm install
```

### 3️⃣ Démarrer le Serveur Dev
```bash
npm run dev
# Ouvrir http://localhost:3000
```

---

## 🔄 Pipeline de Données (5 Minutes)

### Nettoyer & Préparer les Données
```bash
cd app
npm run data:process
# ✅ Nettoie les données
# ✅ Crée les mappings carrière-université
```

### Importer dans Supabase
```bash
npm run data:sync
# ✅ Importe dans la base de données
```

---

## 📝 Scripts npm Disponibles

```bash
npm run dev          # 🏃 Serveur de dev (hot reload)
npm run build        # 🏗️ Build production
npm run start        # 🚀 Lancer le serveur prod
npm run lint         # 🔍 Vérifier le code

npm run data:clean   # 🧹 Nettoyer les données
npm run data:map     # 🔗 Générer les mappings
npm run data:sync    # 📤 Importer dans Supabase
npm run data:process # 📊 Pipeline complet (clean + map)
```

---

## 🐛 Erreurs Courantes

| Erreur | Solution |
|--------|----------|
| `GEMINI_API_KEY is not set` | Ajouter dans `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY is not set` | Ajouter dans `.env.local` |
| `Module not found` | `npm install` |
| `Port 3000 déjà utilisé` | `npm run dev -- -p 3001` |

---

## 📚 Documentation Complète

- 📖 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Guide détaillé
- ✅ [COMPLETION_REPORT.md](COMPLETION_REPORT.md) - Rapport complet
- 🔧 [.env.example](app/.env.example) - Variables d'environnement

---

## 🎯 Prochaines Étapes

1. ✅ Configurer les clés API
2. 🧪 Tester : `npm run build`
3. 🚀 Démarrer : `npm run dev`
4. 📊 Traiter les données : `npm run data:process`

---

**Besoin d'aide?** → Consulter [SETUP_GUIDE.md](SETUP_GUIDE.md)
