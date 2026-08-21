# Projet : Husk — Frontend

Spec complète : voir `SPEC.md` à la racine. La lire avant de démarrer toute implémentation.

## Stack

- Vite + React (SPA) + shadcn/ui + react-hook-form/Zod
- Backend séparé : `husk-backend` (FastAPI + PocketBase), repo voisin (`../husk-backend`). La plupart des écrans sont maintenant branchés sur le vrai backend (voir liste ci-dessous) ; ce qui n'a pas d'équivalent backend reste sur la couche mock (`src/lib/api.ts`).

⚠️ **Le code "sessions" de `husk-backend` n'est pas commité** au moment d'écrire ceci (`app/routers/sessions.py`, la migration PocketBase des sessions) — il n'existe que dans l'arbre de travail local. Si le backend est redéployé depuis `origin/main` sans commit côté `husk-backend`, tout ce qui suit sur `/sessions` cesse de fonctionner. Vérifier ce point si quelque chose qui marchait en local casse après un déploiement.

## Règle permanente — réel par défaut, mock documenté en exception

Ce repo appelle le vrai backend `husk-backend` pour tout ce qui existe côté API (via `src/lib/http.ts`, base URL `VITE_API_URL`) :

- `GET /health` — vérification de disponibilité de l'API.
- `POST /auth/login` (`src/lib/auth.ts`) — vrai compte PocketBase requis (pas d'inscription publique, compte créé une fois via le dashboard admin PocketBase — app mono-utilisateur).
- `GET /auth/me` (`src/lib/auth.ts`) — utilisé par `RequireAuth` pour valider le token stocké à l'entrée de toute route protégée. Un 401 sur *n'importe quel* appel réel (pas seulement `/auth/me`) déclenche l'intercepteur global de `src/lib/http.ts` : token nettoyé + redirection dure vers `/connexion` (sauf sur `/auth/login` lui-même, où 401 = mauvais identifiants, pas session expirée).
- `GET /sessions`, `GET /sessions/{id}`, `POST /sessions`, `POST /sessions/{id}/message` (`src/lib/sessions.ts`) — **le backend stocke les champs en français** (`type_source`, `source_url`, `titre`, `historique`, `date_export`, `exporte`, rôles de message `"user"/"model"`) ; `src/lib/sessions.ts` traduit vers le contrat anglais (`Session`, `Message`) à la frontière réseau, le reste de l'app ne voit jamais le français. Le titre d'une session YouTube est généré par Gemini (JSON `{titre, resume}`) lors du premier appel `/message`, pas fourni par le frontend à la création.

Ce qui reste mocké, faute d'équivalent backend, et pourquoi (`src/lib/api.ts`) :

- `createSession()` pour `sourceType` **`article`/`free_question`** — `POST /sessions` n'accepte aujourd'hui que `type_source: "youtube"`. **Aucune UI ne construit plus ces deux types** (l'écran Nouvelle session ne propose que YouTube) — la fonction mock reste dans `api.ts` au cas où, mais n'est plus appelée nulle part. La création YouTube réelle passe par `createYoutubeSession()` dans `src/lib/sessions.ts`, pas par le mock.
- `generateFlashcards()`, `updateFlashcards()`, `exportSession()` — aucune route n'existe pour ces trois fonctions dans `husk-backend`, pas d'UI construite non plus (pas d'écran flashcards/export).
- Conséquence pratique : `useSession`/`useSendMessage` routent vers le mock ou le vrai backend selon que l'id de session est préfixé `sess_` (mock, `src/lib/api.ts`) ou non (id PocketBase réel) — pont volontairement simple pour cette période de transition, à retirer si/quand article/question libre deviennent réels.

Avant d'ajouter un nouvel appel réel ou de lever une exception mock : vérifier le contrat exact (route, méthode, schéma requête/réponse, auth) directement dans le code de `../husk-backend`, jamais en le devinant. Mettre à jour cette liste une fois confirmé.

## Règle permanente — suivi d'avancement

Après chaque commit, mets à jour `PROGRESS.md` (journal libre, pas de checklist pré-remplie) : ce qui a été fait, les décisions prises, les points en suspens.

## Règle permanente — nomenclature du code en anglais

Toute la nomenclature du code (noms de fonctions, fichiers, variables, types, champs d'interface...) doit être en anglais, y compris le contrat de données de `SPEC.md` (`Session`, `Message`, `Flashcard`...) même si celui-ci reflète le futur schéma PocketBase — le schéma backend devra suivre cette nomenclature anglaise, pas l'inverse. Le texte affiché à l'utilisateur (labels, boutons, messages) et la prose des fichiers `.md` (SPEC.md, PROGRESS.md, CLAUDE.md, commentaires de code) restent en français. Les slugs d'URL (routes React Router), eux, restent en français (ex. `/nouvelle-session`, `/connexion`).

## Règle permanente — mobile first

Toute interface doit être pensée et construite en priorité pour mobile, puis adaptée aux écrans plus grands (approche mobile-first de Tailwind : classes sans préfixe = mobile par défaut, `sm:`/`md:`/`lg:` ajoutent la complexité pour les écrans larges, jamais l'inverse). Concrètement : cibles tactiles d'au moins ~44px de hauteur sur les éléments interactifs importants (boutons primaires, sélecteurs), layouts empilés/pleine largeur par défaut qui passent en ligne/largeur auto à partir de `sm:`, et éviter le centrage vertical (`justify-center`) sur les pages contenant un formulaire — préférer un ancrage en haut sur mobile (évite que le clavier virtuel fasse sauter la mise en page) et ne centrer verticalement qu'à partir de `sm:`.
