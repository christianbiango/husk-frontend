# Journal d'avancement — Husk Frontend

## 2026-08-18 — Démarrage du projet

Scaffold initial du repo à partir de SPEC.md / CLAUDE.md.

**Fait :**
- Vite + React + TypeScript scaffoldé (le scaffold a d'abord atterri dans un
  chemin imbriqué à cause d'un bug de `npm create` avec un chemin absolu ;
  déplacé manuellement à la racine, rien à retenir de ce détail).
- Tailwind v4 + shadcn/ui installés (préréglage « Nova »). Le CLI shadcn de
  cette version n'a pas livré le composant `form` standard (juste
  `{ name: "form", type: "registry:ui" }` vide dans le registry) — écrit à la
  main `src/components/ui/form.tsx` avec le contenu classique
  (Form/FormField/FormItem/FormLabel/FormControl/FormMessage), en installant
  en plus `@radix-ui/react-label` et `@radix-ui/react-slot`.
- `src/lib/api.ts` : couche mock complète du contrat SPEC.md (login,
  getSessions, getSession, createSession, sendMessage, generateFlashcards,
  updateFlashcards, exportSession), avec 3 sessions fictives (youtube,
  article, question libre) et un délai simulé de 400ms.
- `src/lib/http.ts` : client axios réel, séparé du mock, avec intercepteur
  qui injecte le bearer token (stocké en localStorage) sur chaque requête.
  Base URL via `import.meta.env.VITE_API_URL` (Vite exige le préfixe
  `VITE_`, donc pas exactement `PUBLIC_API_URL` comme suggéré dans SPEC.md —
  à garder en tête si SPEC.md est mis à jour plus tard).
- `src/lib/health.ts` + `src/hooks/useHealth.ts` : premier appel réel (pas
  mocké) vers `/health`, suivant le pattern hook + `useQuery` demandé
  (fichier lib avec la fonction fetch, hook séparé qui l'appelle).
- Écran Login (`src/pages/LoginPage.tsx` + `src/hooks/useLogin.ts`) :
  react-hook-form + Zod, branché sur `login()` mocké. `App.tsx` bascule vers
  un écran placeholder « Connecté à Husk » après connexion, qui affiche
  aussi le statut du health check (pour visualiser que l'intercepteur/axios
  fonctionnent réellement).
- Vérifié en conditions réelles (Playwright + Chromium headless, dev server
  Vite) : rendu du formulaire, messages de validation Zod, connexion mockée,
  et le hook `useHealth` bascule bien en erreur (« injoignable ») quand
  `VITE_API_URL` pointe vers un backend absent — confirme que
  intercepteur + wrapper axios fonctionnent de bout en bout.
- Dépôt git initialisé, remote `origin` ajouté
  (`https://github.com/christianbiango/husk-frontend.git`), premier commit
  fait. Pas de push — à faire à la demande.

## 2026-08-18 — Badge de statut API

Remplacé le texte gris discret du statut `/health` par un badge coloré
(`AuthenticatedPlaceholder` dans `src/App.tsx`) : vert « Connecté à l'API »
quand le backend répond, rouge « API injoignable » sinon, gris pendant la
vérification. Vérifié en conditions réelles (Playwright) dans les deux cas —
backend injoignable et un faux serveur `/health` local répondant `{status:
"ok"}` avec les headers CORS nécessaires (Authorization + preflight).

**Points en suspens :**
- `.env` n'a pas pu être créé par Claude Code (règle de permission qui
  bloque l'écriture de fichiers `.env*`, probablement pour éviter les
  fuites de secrets). Il faut le créer à la main à la racine avec au moins :
  `VITE_API_URL=http://localhost:8000` (ou l'URL du backend réel une fois
  disponible). `.env` est dans `.gitignore`.
- Écrans restants de SPEC.md non construits : Nouvelle session, Session en
  cours (résumé + chat), Aperçu des flashcards, Liste des sessions passées.
  Pas de routing (react-router ou autre) mis en place pour l'instant — le
  point d'entrée bascule juste Login ↔ placeholder authentifié via un
  simple `useState`. À revoir dès qu'un deuxième écran réel arrive.
- Le contrat d'auth réel (PocketBase) reste à définir ; `login()` accepte
  actuellement n'importe quel email/mot de passe non vides.
