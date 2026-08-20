# Projet : Husk — Frontend

Spec complète : voir `SPEC.md` à la racine. La lire avant de démarrer toute implémentation.

## Stack

- Vite + React (SPA) + shadcn/ui + react-hook-form/Zod
- Pas de backend accessible depuis ce repo — tout passe par une couche mock (`src/lib/api.ts`), cf. SPEC.md

## Règle permanente — développement contre mock uniquement

Ce repo n'a et n'aura jamais accès à un vrai backend. Toute donnée vient de `src/lib/api.ts`, qui simule les appels réels en respectant le contrat de données défini dans `SPEC.md`. Ne jamais essayer de deviner ou d'appeler une vraie URL de backend — si une fonctionnalité semble nécessiter un vrai serveur (auth réelle, appel Gemini...), simule-la dans la couche mock avec des données plausibles, sans bloquer sur son absence.

## Règle permanente — suivi d'avancement

Après chaque commit, mets à jour `PROGRESS.md` (journal libre, pas de checklist pré-remplie) : ce qui a été fait, les décisions prises, les points en suspens.

## Règle permanente — nomenclature du code en anglais

Toute la nomenclature du code (noms de fonctions, fichiers, variables, types, champs d'interface...) doit être en anglais, y compris le contrat de données de `SPEC.md` (`Session`, `Message`, `Flashcard`...) même si celui-ci reflète le futur schéma PocketBase — le schéma backend devra suivre cette nomenclature anglaise, pas l'inverse. Le texte affiché à l'utilisateur (labels, boutons, messages) et la prose des fichiers `.md` (SPEC.md, PROGRESS.md, CLAUDE.md, commentaires de code) restent en français. Les slugs d'URL (routes React Router), eux, restent en français (ex. `/nouvelle-session`, `/connexion`).

## Règle permanente — mobile first

Toute interface doit être pensée et construite en priorité pour mobile, puis adaptée aux écrans plus grands (approche mobile-first de Tailwind : classes sans préfixe = mobile par défaut, `sm:`/`md:`/`lg:` ajoutent la complexité pour les écrans larges, jamais l'inverse). Concrètement : cibles tactiles d'au moins ~44px de hauteur sur les éléments interactifs importants (boutons primaires, sélecteurs), layouts empilés/pleine largeur par défaut qui passent en ligne/largeur auto à partir de `sm:`, et éviter le centrage vertical (`justify-center`) sur les pages contenant un formulaire — préférer un ancrage en haut sur mobile (évite que le clavier virtuel fasse sauter la mise en page) et ne centrer verticalement qu'à partir de `sm:`.
