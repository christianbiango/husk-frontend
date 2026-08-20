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

## 2026-08-18 — Badge API déplacé sur Login

Le badge vert/rouge (voir entrée précédente) était sur l'écran placeholder
post-connexion ; déplacé sur l'écran Login (extrait dans
`src/components/ApiStatusBadge.tsx`) puisque le login reste entièrement
mocké — aucun vrai appel réseau côté auth pour l'instant, seul `/health`
reste un appel API réel dans ce repo. Vérifié en conditions réelles
(Playwright) : badge visible sur Login (rouge si backend injoignable),
disparu de l'écran post-connexion.

Décision backend en discussion (hors scope de ce repo, mais notée ici pour
contexte) : le backend husk-backend combine FastAPI + PocketBase. Option
retenue pour préserver le contrat frontend actuel (`POST /auth/login` →
`{token}` sur une seule origine) : FastAPI fait proxy vers l'API PocketBase
en interne, plutôt que le frontend parle directement à PocketBase. Rien à
changer ici tant que husk-backend expose cette route.

## 2026-08-19 — Routing (login → /home) + nomenclature anglaise

**Fait :**
- Ajout de `react-router-dom`. `App.tsx` bascule sur de vraies routes
  (`/login` publique, `/home` protégée via `RequireAuth`) au lieu du
  `useState` Login ↔ placeholder. Connexion réussie redirige vers `/home` ;
  visiter `/login` déjà connecté redirige vers `/home` ; visiter `/home`
  sans token redirige vers `/login`. Vérifié en conditions réelles
  (Playwright).
- Nouvelle règle permanente (voir `CLAUDE.md`) : nomenclature du code en
  anglais (fonctions, fichiers, variables, types, champs d'interface).
  Le texte affiché à l'utilisateur et la prose des `.md`/commentaires
  restent en français.
- Appliqué cette règle à tout le contrat de données, y compris les champs
  qui reflètent le futur schéma PocketBase (décision explicite : le
  backend devra suivre cette nomenclature anglaise, pas l'inverse) :
  `TypeSource`→`SourceType`, `type_source`→`sourceType`,
  `source_url`→`sourceUrl`, `titre`→`title`, `historique`→`history`,
  `reponse`→`answer`, `date_export`→`exportedAt`, `exporte`→`exported`,
  valeur `"notion_libre"`→`"free_question"`, paramètre `contenu`→`content`.
  `SPEC.md` mis à jour en conséquence.
- Renommé `AccueilPage.tsx`/`AccueilPage` → `HomePage.tsx`/`HomePage`,
  route `/accueil` → `/home`.

**Points en suspens :**
- Le vrai schéma PocketBase n'existe pas encore côté backend — à faire
  correspondre à cette nomenclature anglaise quand il sera créé.
- Écrans restants de SPEC.md toujours non construits (nouvelle session,
  session en cours, aperçu flashcards, liste des sessions passées).

## 2026-08-20 — Écran "Nouvelle session" + premier vrai passage design

**Fait :**
- Nouvelle règle précisée (voir `CLAUDE.md`) : les slugs d'URL restent en
  français (contrairement au code, en anglais). Correction des routes
  posées la veille par erreur en anglais : `/home` → `/accueil`,
  `/login` → `/connexion` (fichiers/composants `HomePage`/`LoginPage`
  inchangés, seuls les slugs changent).
- Premier vrai passage design (skill `frontend-design`), construit autour
  du concept Husk (enveloppe) / Kernel (le grain qu'on en extrait) :
  palette ambre chaude sur tokens CSS globaux (`index.css` — remplace le
  gris shadcn par défaut, hérité par Login/Accueil aussi), police
  d'affichage Fraunces branchée sur le token `--font-heading` existant
  (donc tous les `CardTitle` en héritent automatiquement).
- Écran **Nouvelle session** (`/nouvelle-session`, `NewSessionPage.tsx`) :
  sélecteur de type de source en ToggleGroup "chips" avec icônes lucide
  (signature visuelle : chip actif rempli en ambre), textarea avec
  label/placeholder dynamiques selon le type choisi, validation Zod
  (contenu requis, URL valide si YouTube/Article), branché sur
  `createSession()` via le nouveau hook `useCreateSession`.
- Piège rencontré : le style "actif" par défaut des `ToggleGroupItem`
  shadcn (preset base-nova/Base UI) cible `data-[state=on]:` **et**
  `aria-pressed:`, mais Base UI ne pose que `aria-pressed="true"` (pas
  d'attribut `data-state`) — mon override initial en
  `data-[state=on]:bg-primary` ne faisait donc rien ; il fallait cibler
  `aria-pressed:` (avec `!` pour forcer la priorité sur le
  `aria-pressed:bg-muted` déjà présent dans les classes de base du
  composant). À garder en tête pour tout futur `Toggle`/`ToggleGroup`.
- Ajout de deux composants shadcn : `toggle.tsx`/`toggle-group.tsx`
  (récupérés pleins via le CLI, pas de stub vide cette fois — Base UI a
  de vraies primitives pour ceux-là) et `textarea.tsx` (écrit à la main,
  pas de primitive `Textarea` dans `@base-ui/react`).
- Page de résultat minimale **`/session/:id`** (`SessionPage.tsx`,
  hook `useSession`) : titre, badge type de source, résumé généré
  (premier message assistant) — en attendant le vrai écran "Session en
  cours" (chat), qui reste un chantier séparé.
- Accueil (`/accueil`) : ajout d'un bouton "Nouvelle session" (vrai
  composant `Button`, plus de cul-de-sac après connexion).
- Vérifié en conditions réelles (Playwright + captures d'écran) :
  parcours complet connexion → accueil → nouvelle session → validation
  (champ vide, URL invalide) → soumission → page de résultat ; rendu
  visuel de la palette ambre et de Fraunces conforme à la direction
  choisie.

**Points en suspens :**
- Écran "Session en cours" complet (chat de raffinement, génération de
  flashcards) toujours à construire — `/session/:id` n'est qu'un
  résultat minimal en attendant.
- Aperçu des flashcards et liste des sessions passées (SPEC.md) non
  construits.
- `.dark` a reçu une teinte ambre analogue par cohérence, mais aucun
  sélecteur de thème n'existe encore dans l'app pour l'activer/tester
  en usage réel.
- Un `console.log` de debug reste présent dans `ApiStatusBadge.tsx`
  (ajouté hors de ce travail, probablement via l'IDE) — non committé,
  à traiter séparément.

## 2026-08-20 — Atterrissage direct sur Nouvelle session + mobile first

**Fait :**
- Nouvelle règle permanente (voir `CLAUDE.md`) : le design doit être
  pensé mobile-first (classes Tailwind sans préfixe = mobile par
  défaut, `sm:`/`md:`/`lg:` ajoutent la complexité desktop, jamais
  l'inverse), avec des cibles tactiles d'au moins ~44px sur les
  éléments interactifs importants, et un ancrage en haut (pas de
  centrage vertical) sur les pages à formulaire tant qu'on est sur
  mobile — évite que le clavier virtuel fasse sauter la mise en page.
- Suppression de l'écran Accueil (`HomePage.tsx`, route `/accueil`) :
  il ne servait plus qu'à afficher un bouton "Nouvelle session" et la
  déconnexion, ce qui imposait un clic superflu après la connexion.
  Login redirige maintenant directement vers `/nouvelle-session`
  (idem pour `/` et les routes inconnues).
- Nouveau composant `AuthenticatedLayout.tsx` : combine `RequireAuth`
  et un header partagé ("Husk" + bouton de déconnexion) entre tous les
  écrans connectés, pour ne pas dupliquer la déconnexion sur chaque
  page. `NewSessionPage`/`SessionPage` n'ont plus leur propre wrapper
  de page ni de lien "retour" — le header s'en charge.
- Passage mobile-first de l'écran Nouvelle session : le ToggleGroup de
  type de source s'empile en pleine largeur sur mobile (au lieu de
  chips compressées côte à côte) et repasse en ligne compacte à partir
  de `sm:` ; chips et bouton "Générer" à 44px de haut sur mobile
  (36px à partir de `sm:`) ; bouton "Générer" pleine largeur sur
  mobile. Même traitement (ancrage haut, bouton 44px) appliqué à Login
  par cohérence.
- Vérifié en conditions réelles (Playwright, viewports 375×667 et
  1440×900) : atterrissage direct sur `/nouvelle-session` après login
  sur mobile et desktop, hauteurs de cibles tactiles mesurées à 44px,
  rendu visuel conforme sur les deux tailles.

**Points en suspens :**
- Pas encore de dashboard/liste de sessions passées (SPEC.md) — pour
  l'instant `/nouvelle-session` est le seul point d'entrée après
  connexion, ce qui est volontaire mais à revoir quand cet écran
  existera.

## 2026-08-20 — Premier vrai appel réseau métier : résumé YouTube (Gemini)

**Fait :**
- `CLAUDE.md` : la règle "mock uniquement" devient "mock par défaut,
  endpoints réels documentés en exception" — liste explicite des
  endpoints réels approuvés (`/health`, `/test/summarize-youtube`),
  à mettre à jour à chaque nouvel appel réel ajouté.
- Contrat vérifié directement dans le code de `../husk-backend` (pas
  deviné) : `POST /test/summarize-youtube`, body `{ url }`, réponse
  `{ summary }` (erreurs `{ detail }` en 400/401/502), nécessite un
  vrai token PocketBase (`Authorization: Bearer ...`).
- `src/lib/gemini.ts` (nouveau) : appel réel via le client axios
  existant (`src/lib/http.ts`). `src/lib/api.ts` reste 100% mock mais
  `createSession()` accepte désormais un `summaryOverride` optionnel
  pour recevoir un vrai résumé sans faire lui-même d'appel réseau.
- `useCreateSession` orchestre : appelle `summarizeYoutube()` en vrai
  quand `sourceType === "youtube"`, garde le mock pour
  article/question libre ; remonte le message d'erreur exact du
  backend (`error.response.data.detail`) plutôt qu'un message Axios
  générique.
- Validation Zod de l'URL YouTube resserrée pour matcher exactement le
  regex du backend (feedback immédiat côté client avant tout appel
  réseau).
- Vérifié en conditions réelles (Playwright, avec le vrai backend
  tournant en local sur :8000) : la requête part avec le bon corps et
  le bon header d'auth, le mock (question libre) n'est pas cassé, et
  le message d'erreur backend ("Invalid or expired token") s'affiche
  correctement dans l'UI.

**Point bloquant important :**
- Le login de ce repo reste entièrement mocké (`login()` génère un
  faux token `mock_token_...`). Cet endpoint réel exige un vrai token
  PocketBase — donc en l'état, cliquer "Générer" sur une session
  YouTube échouera toujours en 401 tant que le vrai login (ou une
  autre méthode d'obtention d'un vrai token) n'est pas branché. C'est
  la prochaine dépendance à lever pour tester ce flow de bout en bout.
- `VITE_API_URL` doit pointer vers `http://localhost:8000` en local
  (port confirmé dans `../husk-backend`) ; le `.env` local du repo est
  déjà configuré ainsi (confirmé indirectement via le badge de statut
  API, pas relu directement — fichiers `.env*` bloqués en lecture/
  écriture pour Claude Code).
