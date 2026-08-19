# Spec — Frontend Husk

## Objectif

Interface web pour Husk : coller une source (lien YouTube, article, ou question libre), voir un résumé généré par IA, affiner par chat, générer et éditer des flashcards, exporter, et consulter l'historique des sessions passées.

Ce repo est **agnostique du backend** — il ne sait pas comment le backend est fait (FastAPI, PocketBase, etc.), seulement à quoi ressemble le contrat de données qu'il attend. Le backend vit dans un autre repo, développé en parallèle.

## Stack

- Vite + React (SPA classique, pas Next.js — pas besoin de rendu serveur pour un outil perso derrière auth, et ça évite un process Node en continu sur le VPS)
- shadcn/ui pour les composants (button, input, select, dialog, card)
- react-hook-form + Zod pour la validation de formulaire
- dnd-kit en réserve, pas nécessaire au départ (réordonnancement de flashcards, si besoin plus tard)

## Écrans à construire

1. **Login** — email/mot de passe (contrat d'auth exact à définir plus tard, construire l'écran dès maintenant avec un formulaire simple)
2. **Nouvelle session** — champ texte (URL ou question) + dropdown de type de source (YouTube / Article / Question libre — dropdown maître, aucune auto-détection) → bouton "Générer"
3. **Session en cours** — résumé affiché, zone de chat pour affiner (historique affiché comme une conversation), bouton "Générer les flashcards", bouton "Exporter"
4. **Aperçu des flashcards** — liste éditable (modifier/supprimer une carte avant export)
5. **Liste des sessions passées** — titre, source, date, tags, clic → recharge la session complète

## Contrat de données attendu (à respecter dans la couche mock)

```typescript
type SourceType = "youtube" | "article" | "free_question";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO 8601
}

interface Flashcard {
  question: string;
  answer: string;
}

interface Session {
  id: string;
  sourceType: SourceType;
  sourceUrl: string | null;
  title: string;
  history: Message[];
  flashcards: Flashcard[];
  created: string;   // ISO 8601, champ auto de PocketBase
  updated: string;   // ISO 8601, champ auto de PocketBase
  exportedAt: string | null;
  exported: boolean;
}
```

## Déploiement final (pour information, pas nécessaire au développement contre mocks)

- Frontend servi sur `https://husk.mondomaine`, en fichiers statiques (build Vite) servis directement par nginx.
- Backend sur un sous-domaine séparé : `https://husk-api.mondomaine`.
- **Conséquence pour plus tard** : les vrais appels réseau devront utiliser l'URL absolue du backend (`https://husk-api.mondomaine/...`), pas un chemin relatif comme `/api/...` — frontend et backend sont sur des origines différentes (CORS géré côté backend). Prévoir une variable d'environnement (ex. `PUBLIC_API_URL`) pour cette base d'URL plutôt que de la coder en dur, pour rester flexible entre dev local et prod.

## La couche mock — principe

Toutes les interactions avec des données passent par `src/lib/api.ts`, qui pour l'instant retourne des données fictives respectant strictement le contrat ci-dessus. Signatures attendues :

```typescript
function login(email: string, password: string): Promise<{ token: string }>
function getSessions(): Promise<Session[]>
function getSession(id: string): Promise<Session>
function createSession(sourceType: SourceType, content: string): Promise<Session>
function sendMessage(sessionId: string, message: string): Promise<Message>
function generateFlashcards(sessionId: string): Promise<Flashcard[]>
function updateFlashcards(sessionId: string, flashcards: Flashcard[]): Promise<void>
function exportSession(sessionId: string): Promise<void>
```

Les composants React appellent ces fonctions et ne doivent jamais dépendre de comment elles sont implémentées à l'intérieur — le jour où le vrai backend est prêt, seul le contenu de `api.ts` change (vrais appels `fetch`), pas les écrans.

## Ce qui n'est volontairement pas dans cette spec

- Comment le backend fonctionne (autre repo)
- Le nom exact de l'URL de déploiement final (pas nécessaire pour développer contre des mocks)
- Le détail de l'auth réelle (PocketBase) — juste construire l'écran de login avec `login()` en mock pour l'instant
