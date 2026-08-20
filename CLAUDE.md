# Projet : Husk — Frontend

Spec complète : voir `SPEC.md` à la racine. La lire avant de démarrer toute implémentation.

## Stack

- Vite + React (SPA) + shadcn/ui + react-hook-form/Zod
- Backend séparé : `husk-backend` (FastAPI + PocketBase), repo voisin (`../husk-backend`). Certains endpoints sont maintenant réels et appelables depuis ce repo (voir liste ci-dessous) ; tout le reste passe encore par la couche mock (`src/lib/api.ts`), cf. SPEC.md.

## Règle permanente — mock par défaut, endpoints réels documentés en exception

Par défaut, ce repo développe contre la couche mock (`src/lib/api.ts`) en respectant le contrat de données défini dans `SPEC.md` — ne jamais deviner ou appeler une URL de backend qui n'est pas explicitement confirmée. Certains endpoints de `husk-backend` sont cependant réels, stables, et approuvés pour un appel direct depuis ce repo (via `src/lib/http.ts`, base URL `VITE_API_URL`) :

- `GET /health` — vérification de disponibilité de l'API (déjà en place).
- `POST /test/summarize-youtube` — résumé Gemini d'une vidéo YouTube (contrat exact vérifié dans le code de `husk-backend`, pas deviné).

Avant d'ajouter un nouvel appel réel à cette liste : vérifier le contrat exact (route, méthode, schéma requête/réponse, auth) directement dans le code de `../husk-backend`, jamais en le devinant. Documenter le nouvel endpoint ici une fois confirmé.

## Règle permanente — suivi d'avancement

Après chaque commit, mets à jour `PROGRESS.md` (journal libre, pas de checklist pré-remplie) : ce qui a été fait, les décisions prises, les points en suspens.

## Règle permanente — nomenclature du code en anglais

Toute la nomenclature du code (noms de fonctions, fichiers, variables, types, champs d'interface...) doit être en anglais, y compris le contrat de données de `SPEC.md` (`Session`, `Message`, `Flashcard`...) même si celui-ci reflète le futur schéma PocketBase — le schéma backend devra suivre cette nomenclature anglaise, pas l'inverse. Le texte affiché à l'utilisateur (labels, boutons, messages) et la prose des fichiers `.md` (SPEC.md, PROGRESS.md, CLAUDE.md, commentaires de code) restent en français. Les slugs d'URL (routes React Router), eux, restent en français (ex. `/nouvelle-session`, `/connexion`).

## Règle permanente — mobile first

Toute interface doit être pensée et construite en priorité pour mobile, puis adaptée aux écrans plus grands (approche mobile-first de Tailwind : classes sans préfixe = mobile par défaut, `sm:`/`md:`/`lg:` ajoutent la complexité pour les écrans larges, jamais l'inverse). Concrètement : cibles tactiles d'au moins ~44px de hauteur sur les éléments interactifs importants (boutons primaires, sélecteurs), layouts empilés/pleine largeur par défaut qui passent en ligne/largeur auto à partir de `sm:`, et éviter le centrage vertical (`justify-center`) sur les pages contenant un formulaire — préférer un ancrage en haut sur mobile (évite que le clavier virtuel fasse sauter la mise en page) et ne centrer verticalement qu'à partir de `sm:`.
