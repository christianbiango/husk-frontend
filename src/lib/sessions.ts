// Appels réels vers husk-backend — voir CLAUDE.md, "endpoints réels".
//
// husk-backend stocke les sessions avec des champs en français
// (type_source, source_url, titre, historique, date_export, exporte) —
// la décision "nomenclature anglaise" de CLAUDE.md n'a jamais été
// répercutée côté backend. Ce fichier traduit à la frontière réseau pour
// que le reste de l'app continue de manipuler le contrat anglais
// (Session, Message) défini dans src/lib/api.ts.
//
// Limitations connues du backend actuel (voir PROGRESS.md) :
// - POST /sessions n'accepte que type_source: "youtube".
// - Pas de route DELETE : si la création réussit mais que l'appel de
//   résumé échoue, la session vide créée dans PocketBase reste orpheline.
//
// Le titre est généré par Gemini (pas fourni par le frontend) : le premier
// appel à /message envoie {titre, resume} en JSON et le backend l'enregistre
// sur la session — createYoutubeSession n'envoie donc pas de titre à la
// création, et ne connaît pas le titre final tant que l'appel /message n'a
// pas répondu (la réponse de /message ne renvoie que { reply, historique },
// pas le titre — SessionPage le récupère via son propre fetch de la session).

import { api, getApiErrorMessage } from "@/lib/http";
import type { Message, Session, SourceType } from "@/lib/api";

interface RawMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

interface RawSession {
  id: string;
  type_source: SourceType;
  source_url: string | null;
  titre: string;
  historique?: RawMessage[];
  flashcards?: Session["flashcards"];
  created: string;
  updated: string;
  date_export?: string | null;
  exporte?: boolean;
}

function mapRawMessage(raw: RawMessage): Message {
  return {
    role: raw.role === "model" ? "assistant" : "user",
    content: raw.content,
    timestamp: raw.timestamp,
  };
}

function mapRawSession(raw: RawSession): Session {
  return {
    id: raw.id,
    sourceType: raw.type_source,
    sourceUrl: raw.source_url,
    title: raw.titre,
    history: (raw.historique ?? []).map(mapRawMessage),
    flashcards: raw.flashcards ?? [],
    created: raw.created,
    updated: raw.updated,
    exportedAt: raw.date_export ?? null,
    exported: raw.exporte ?? false,
  };
}

async function withApiError<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    const message = getApiErrorMessage(error);
    if (message) throw new Error(message);
    throw error;
  }
}

export function getSessions(): Promise<Session[]> {
  return withApiError(
    api<{ items: RawSession[] }>("/sessions", { method: "GET" }).then(
      (response) => response.items.map(mapRawSession)
    )
  );
}

export function getSession(id: string): Promise<Session> {
  return withApiError(
    api<RawSession>(`/sessions/${id}`, { method: "GET" }).then(mapRawSession)
  );
}

interface MessageResult {
  reply: string;
  history: Message[];
}

function postMessage(
  sessionId: string,
  message?: string
): Promise<MessageResult> {
  return withApiError(
    api<{ reply: string; historique: RawMessage[] }>(
      `/sessions/${sessionId}/message`,
      { method: "POST", data: message ? { message } : {} }
    ).then(({ reply, historique }) => ({
      reply,
      history: historique.map(mapRawMessage),
    }))
  );
}

export async function createYoutubeSession(url: string): Promise<Session> {
  return withApiError(
    (async () => {
      const created = await api<RawSession>("/sessions", {
        method: "POST",
        data: { type_source: "youtube", source_url: url },
      });
      const { history } = await postMessage(created.id);
      return { ...mapRawSession(created), history };
    })()
  );
}

// Affinage : envoie un message de suivi une fois la session initialisée.
// Renvoie l'historique complet mis à jour (déjà traduit en anglais).
export function sendMessage(
  sessionId: string,
  message: string
): Promise<Message[]> {
  return postMessage(sessionId, message).then(({ history }) => history);
}
