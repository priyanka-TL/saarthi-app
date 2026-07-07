import chatHistoriesRaw from "@/config/chatHistories.json?raw";
import { parseHomeFlowConfig } from "@/lib/homeFlow";
import type { ChatHistoryEntry } from "@/types/homeFlow";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseChatHistoryEntry(value: unknown): ChatHistoryEntry | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.description !== "string" ||
    !isObject(value.config)
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    description: value.description,
    config: parseHomeFlowConfig(JSON.stringify(value.config)),
  };
}

function parseChatHistories(raw: string): ChatHistoryEntry[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => parseChatHistoryEntry(entry))
      .filter((entry): entry is ChatHistoryEntry => Boolean(entry));
  } catch {
    return [];
  }
}

export const chatHistoryEntries: ChatHistoryEntry[] = parseChatHistories(chatHistoriesRaw);

export function getChatHistoryById(id: string): ChatHistoryEntry | null {
  return chatHistoryEntries.find((entry) => entry.id === id) ?? null;
}
