# 🚀 GUIDE DÉPLOIEMENT VERCEL — Application Miroir
## Étapes complètes pour mettre en ligne

---

## ÉTAPE 1 — Créer un compte GitHub
> GitHub est le service où tu vas stocker ton code en ligne

1. Va sur https://github.com
2. Clique sur "Sign up"
3. Remplis : Email, Mot de passe, Nom d'utilisateur
4. Vérifie ton email (lien de confirmation)
5. ✅ Ton compte GitHub est prêt

---

## ÉTAPE 2 — Créer le projet sur GitHub

1. Connecte-toi sur github.com
2. Clique sur le "+" en haut à droite → "New repository"
3. Nom du repo : `miroir-app`
4. Laisse tout par défaut
5. Clique "Create repository"
6. ✅ Ton dépôt est créé

---

## ÉTAPE 3 — Uploader les fichiers

Dans ton dépôt GitHub vide :
1. Clique "uploading an existing file"
2. Glisse-dépose TOUS les fichiers du projet (structure ci-dessous)
3. Clique "Commit changes"

### Structure des fichiers à uploader :
```
miroir-app/
├── pages/
│   ├── index.jsx          ← page principale
│   └── api/
│       └── analyze.js     ← route API sécurisée
├── public/
│   └── manifest.json      ← PWA
├── package.json
└── next.config.js
```

---

## ÉTAPE 4 — Créer un compte Vercel

1. Va sur https://vercel.com
2. Clique "Sign Up"
3. Choisis "Continue with GitHub" (connecte ton compte GitHub)
4. ✅ Vercel est lié à ton GitHub

---

## ÉTAPE 5 — Déployer le projet

1. Sur Vercel, clique "Add New Project"
2. Trouve ton repo `miroir-app` dans la liste
3. Clique "Import"
4. Laisse tous les paramètres par défaut
5. **NE PAS encore cliquer Deploy** → d'abord ajouter la clé API

---

## ÉTAPE 6 — Ajouter ta clé API Anthropic (IMPORTANT !)

Avant de déployer, dans Vercel :
1. Clique sur "Environment Variables"
2. Ajoute :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : ta clé API (commence par `sk-ant-...`)
3. Clique "Add"

> 💡 Tu trouves ta clé API sur https://console.anthropic.com

---

## ÉTAPE 7 — Lancer le déploiement

1. Clique "Deploy"
2. Attends 1-2 minutes (tu vois les logs en direct)
3. ✅ Vercel affiche : "Congratulations! Your project has been deployed"
4. Tu reçois ton lien : `https://miroir-app.vercel.app`

---

## ÉTAPE 8 — Tester sur ton téléphone

1. Ouvre le lien sur ton téléphone Android
2. Autorise l'accès à la caméra
3. Tu te vois en miroir instantanément !
4. Capture une photo → Clique "Analyser" → L'IA analyse ton visage

### Pour installer comme une vraie app :
- Sur Chrome Android : Menu (3 points) → "Ajouter à l'écran d'accueil"
- L'app apparaît avec son icône comme une vraie application !

---

## RÉSUMÉ DES COÛTS

| Service | Coût |
|---------|------|
| GitHub | GRATUIT |
| Vercel | GRATUIT (jusqu'à 100GB/mois) |
| Anthropic API | ~0.003$ par analyse IA |

---

## EN CAS DE PROBLÈME

- Erreur "Camera not allowed" → Vérifie que le site est en HTTPS (Vercel le fait automatiquement)
- Erreur "API Key" → Revérifie l'étape 6
- Page blanche → Vérifie les logs dans le dashboard Vercel

---

*Guide créé pour l'application Miroir — IA Académie Excellence*
