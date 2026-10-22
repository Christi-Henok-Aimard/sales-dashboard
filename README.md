# SalesBoard – Dashboard de ventes avec authentification

Application web complète permettant de se connecter de manière sécurisée à un tableau de bord de ventes. Projet réalisé dans le cadre de la sélection pour le programme de formation intensive.

## Liens

- Application déployée : https://sales-dashboard-orpin-alpha.vercel.app
- API déployée : https://salesboard-api-dqmn.onrender.com/api/health
- Code source : https://github.com/Christi-Henok-Aimard/sales-dashboard

**Compte de démonstration**

- Email : `admin@demo.com`
- Mot de passe : `Admin123!`

> L'API est hébergée sur l'offre gratuite de Render : après une période d'inactivité, elle se met en veille. La première connexion peut donc prendre 30 à 60 secondes.

## Fonctionnalités

- Page de connexion moderne, avec validation des champs et messages d'erreur clairs
- Authentification par API (vérification des identifiants, session sécurisée)
- Routes protégées : le dashboard est inaccessible sans connexion
- Tableau de bord de ventes : indicateurs clés, courbe du chiffre d'affaires, répartition par catégorie, dernières commandes
- Déconnexion et redirection automatique si la session expire
- Interface responsive (mobile, tablette, ordinateur)

## Technologies

| Partie | Outils |
|---|---|
| Front-end | React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide |
| Back-end / API | Node.js, Express |
| Sécurité | bcryptjs, JSON Web Token, cookie-parser, Helmet, CORS, express-rate-limit, Zod |
| Déploiement | Vercel (front-end), Render (API) |

## Sécurité

- Mots de passe **hachés avec bcrypt** (jamais stockés en clair)
- Jeton JWT stocké dans un **cookie `httpOnly`** (inaccessible au JavaScript du navigateur), `secure` en production et `sameSite`
- Message d'erreur identique pour un email inconnu et un mauvais mot de passe
- **Limitation des tentatives** de connexion (10 par tranche de 15 minutes) pour freiner les attaques par force brute
- Validation des données reçues avec Zod
- En-têtes de sécurité (Helmet), CORS restreint à l'adresse du front-end
- Secrets stockés dans des variables d'environnement, jamais dans le dépôt

## Architecture

```
sales-dashboard/
├── backend/
│   └── src/
│       ├── data/          # utilisateurs et données de ventes (démo)
│       ├── middleware/    # vérification du jeton (requireAuth)
│       ├── routes/        # routes d'authentification et de ventes
│       └── server.js      # configuration du serveur
└── frontend/
    └── src/
        ├── components/    # ProtectedRoute
        ├── context/       # AuthContext (état de connexion)
        ├── pages/         # Login, Dashboard
        └── api.js         # client HTTP
```

## API

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Connexion, dépose le cookie de session |
| GET | `/api/auth/me` | Connecté | Retourne l'utilisateur courant |
| POST | `/api/auth/logout` | Public | Supprime le cookie de session |
| GET | `/api/sales` | Connecté | Données du dashboard |
| GET | `/api/health` | Public | Vérification de l'état de l'API |

## Lancer le projet en local

Prérequis : Node.js 18 ou plus.

**1. API**

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Renseigner dans `.env` un `JWT_SECRET` long et aléatoire. Il peut être généré avec :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**2. Front-end** (dans un second terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

L'application est disponible sur http://localhost:5173 et l'API sur http://localhost:5000.

## Variables d'environnement

**Back-end (`backend/.env`)**

| Variable | Description |
|---|---|
| `PORT` | Port du serveur (5000 par défaut) |
| `NODE_ENV` | `development` ou `production` |
| `CLIENT_URL` | Adresse du front-end autorisée par CORS |
| `JWT_SECRET` | Clé secrète de signature des jetons |

**Front-end (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Adresse de l'API (`/api` en production) |

## Déploiement

- **Render** héberge l'API (dossier `backend`).
- **Vercel** héberge le front-end (dossier `frontend`). Le fichier `vercel.json` relaie les appels `/api` vers Render, ce qui permet au navigateur de n'utiliser qu'un seul domaine et d'éviter les problèmes de cookies entre sites.

## Pistes d'amélioration

- Base de données réelle (PostgreSQL ou MongoDB) pour les utilisateurs et les ventes
- Inscription des utilisateurs et réinitialisation du mot de passe par e-mail
- Gestion des rôles (administrateur, vendeur)
- Tests automatisés

## Auteur

OUATTARA Oscar Christ Henok Aïmard – Étudiant en Licence 3 MIAGE, Université Polytechnique de Bingerville (UPB).