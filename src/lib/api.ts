// Couche mock — voir SPEC.md "La couche mock — principe".
// Aucun appel réseau réel ici : uniquement des données fictives plausibles.
// Le jour où le vrai backend est prêt, seul ce fichier change (vrais appels fetch/axios),
// pas les écrans qui le consomment.

export type TypeSource = "youtube" | "article" | "notion_libre";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO 8601
}

export interface Flashcard {
  question: string;
  reponse: string;
}

export interface Session {
  id: string;
  type_source: TypeSource;
  source_url: string | null;
  titre: string;
  historique: Message[];
  flashcards: Flashcard[];
  created: string; // ISO 8601, champ auto de PocketBase
  updated: string; // ISO 8601, champ auto de PocketBase
  date_export: string | null;
  exporte: boolean;
}

const MOCK_DELAY_MS = 400;

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 12);
}

let sessions: Session[] = [
  {
    id: "sess_1a2b3c",
    type_source: "youtube",
    source_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    titre: "Les bases de la thermodynamique",
    historique: [
      {
        role: "user",
        content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "2026-08-10T09:12:00.000Z",
      },
      {
        role: "assistant",
        content:
          "Voici un résumé de la vidéo : elle couvre les trois principes de la thermodynamique, avec des exemples appliqués aux moteurs thermiques et aux cycles de Carnot.",
        timestamp: "2026-08-10T09:12:04.000Z",
      },
      {
        role: "user",
        content: "Peux-tu détailler le deuxième principe ?",
        timestamp: "2026-08-10T09:14:30.000Z",
      },
      {
        role: "assistant",
        content:
          "Le deuxième principe introduit la notion d'entropie : dans un système isolé, l'entropie ne peut qu'augmenter ou rester constante, ce qui explique l'irréversibilité des phénomènes naturels.",
        timestamp: "2026-08-10T09:14:36.000Z",
      },
    ],
    flashcards: [
      {
        question: "Que dit le premier principe de la thermodynamique ?",
        reponse:
          "L'énergie totale d'un système isolé se conserve : elle ne peut être ni créée ni détruite, seulement transformée.",
      },
      {
        question: "Qu'est-ce que l'entropie ?",
        reponse:
          "Une grandeur qui mesure le désordre d'un système ; elle croît toujours dans un système isolé (2e principe).",
      },
    ],
    created: "2026-08-10T09:12:00.000Z",
    updated: "2026-08-10T09:14:36.000Z",
    date_export: null,
    exporte: false,
  },
  {
    id: "sess_4d5e6f",
    type_source: "article",
    source_url: "https://example.com/articles/histoire-du-web",
    titre: "Histoire du World Wide Web",
    historique: [
      {
        role: "user",
        content: "https://example.com/articles/histoire-du-web",
        timestamp: "2026-08-05T14:00:00.000Z",
      },
      {
        role: "assistant",
        content:
          "L'article retrace la création du Web par Tim Berners-Lee en 1989 au CERN, jusqu'à l'explosion des navigateurs grand public dans les années 90.",
        timestamp: "2026-08-05T14:00:05.000Z",
      },
    ],
    flashcards: [
      {
        question: "Qui a inventé le World Wide Web ?",
        reponse: "Tim Berners-Lee, en 1989, au CERN.",
      },
      {
        question: "Quel est le premier navigateur web grand public ?",
        reponse: "Mosaic, sorti en 1993.",
      },
    ],
    created: "2026-08-05T14:00:00.000Z",
    updated: "2026-08-05T14:00:05.000Z",
    date_export: "2026-08-06T08:30:00.000Z",
    exporte: true,
  },
  {
    id: "sess_7g8h9i",
    type_source: "notion_libre",
    source_url: null,
    titre: "Quelle est la différence entre TCP et UDP ?",
    historique: [
      {
        role: "user",
        content: "Quelle est la différence entre TCP et UDP ?",
        timestamp: "2026-08-15T18:20:00.000Z",
      },
      {
        role: "assistant",
        content:
          "TCP est un protocole fiable et orienté connexion (avec accusés de réception et retransmission), tandis qu'UDP est plus rapide mais ne garantit ni l'ordre ni la livraison des paquets.",
        timestamp: "2026-08-15T18:20:03.000Z",
      },
    ],
    flashcards: [],
    created: "2026-08-15T18:20:00.000Z",
    updated: "2026-08-15T18:20:03.000Z",
    date_export: null,
    exporte: false,
  },
];

export function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  if (!email || !password) {
    return Promise.reject(new Error("Email et mot de passe requis."));
  }
  const token = `mock_token_${btoa(email)}_${generateId()}`;
  return delay({ token });
}

export function getSessions(): Promise<Session[]> {
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
  );
  return delay(sorted);
}

export function getSession(id: string): Promise<Session> {
  const found = sessions.find((s) => s.id === id);
  if (!found) {
    return Promise.reject(new Error(`Session ${id} introuvable.`));
  }
  return delay(found);
}

export function createSession(
  type_source: TypeSource,
  contenu: string
): Promise<Session> {
  const now = new Date().toISOString();
  const isUrl = type_source === "youtube" || type_source === "article";
  const session: Session = {
    id: `sess_${generateId()}`,
    type_source,
    source_url: isUrl ? contenu : null,
    titre: isUrl ? "Nouvelle session" : contenu,
    historique: [
      {
        role: "user",
        content: contenu,
        timestamp: now,
      },
      {
        role: "assistant",
        content:
          "Voici un résumé généré automatiquement à partir de votre source. (Contenu fictif — mock.)",
        timestamp: now,
      },
    ],
    flashcards: [],
    created: now,
    updated: now,
    date_export: null,
    exporte: false,
  };
  sessions = [session, ...sessions];
  return delay(session);
}

export function sendMessage(
  sessionId: string,
  message: string
): Promise<Message> {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    return Promise.reject(new Error(`Session ${sessionId} introuvable.`));
  }
  const now = new Date().toISOString();
  const userMessage: Message = { role: "user", content: message, timestamp: now };
  const assistantMessage: Message = {
    role: "assistant",
    content: `Réponse fictive à : « ${message} » (mock).`,
    timestamp: new Date(Date.now() + 500).toISOString(),
  };
  session.historique = [...session.historique, userMessage, assistantMessage];
  session.updated = assistantMessage.timestamp;
  return delay(assistantMessage);
}

export function generateFlashcards(sessionId: string): Promise<Flashcard[]> {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    return Promise.reject(new Error(`Session ${sessionId} introuvable.`));
  }
  const flashcards: Flashcard[] = [
    {
      question: `Question générée automatiquement sur « ${session.titre} » ?`,
      reponse: "Réponse fictive générée par le mock.",
    },
    {
      question: "Deuxième question fictive ?",
      reponse: "Deuxième réponse fictive.",
    },
  ];
  session.flashcards = flashcards;
  session.updated = new Date().toISOString();
  return delay(flashcards);
}

export function updateFlashcards(
  sessionId: string,
  flashcards: Flashcard[]
): Promise<void> {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    return Promise.reject(new Error(`Session ${sessionId} introuvable.`));
  }
  session.flashcards = flashcards;
  session.updated = new Date().toISOString();
  return delay(undefined);
}

export function exportSession(sessionId: string): Promise<void> {
  const session = sessions.find((s) => s.id === sessionId);
  if (!session) {
    return Promise.reject(new Error(`Session ${sessionId} introuvable.`));
  }
  session.exporte = true;
  session.date_export = new Date().toISOString();
  return delay(undefined);
}
