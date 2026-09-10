import { JournalEntry, JournalMood } from "@/types/note";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface DbJournalRow {
  id: string;
  date: string;
  title: string | null;
  content: string;
  mood: string | null;
  tags: string[] | null;
  is_draft: boolean | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "literature_app_journal_v1";

export type JournalEntryInput = Omit<JournalEntry, "id" | "createdAt" | "updatedAt">;

function mapDbRowToJournalEntry(row: DbJournalRow): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    title: row.title || undefined,
    content: row.content,
    mood: (row.mood as JournalMood) || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    isDraft: Boolean(row.is_draft),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class JournalRepository {
  private static getStorage(): JournalEntry[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static setStorage(entries: JournalEntry[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Erro ao gravar journal no localStorage", e);
    }
  }

  static async getEntries(): Promise<JournalEntry[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar journal do Supabase:", error.message);
          return this.getStorage();
        }

        if (data) {
          return data.map(mapDbRowToJournalEntry);
        }
      } catch (err) {
        console.error("Exceção ao buscar journal no Supabase:", err);
      }
    }
    return this.getStorage();
  }

  static async createEntry(data: JournalEntryInput): Promise<JournalEntry> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from("journal_entries")
          .insert({
            date: data.date || new Date().toISOString().split("T")[0],
            title: data.title || null,
            content: data.content,
            mood: data.mood || null,
            tags: data.tags || [],
            is_draft: Boolean(data.isDraft),
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) return mapDbRowToJournalEntry(inserted);
      } catch (err) {
        console.error("Erro ao criar entrada no diário via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    const newEntry: JournalEntry = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `journal_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.setStorage([newEntry, ...entries]);
    return newEntry;
  }

  static async updateEntry(
    id: string,
    data: Partial<JournalEntryInput>
  ): Promise<JournalEntry> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, unknown> = { updated_at: now };
        if (data.date !== undefined) payload.date = data.date;
        if (data.title !== undefined) payload.title = data.title || null;
        if (data.content !== undefined) payload.content = data.content;
        if (data.mood !== undefined) payload.mood = data.mood || null;
        if (data.tags !== undefined) payload.tags = data.tags;
        if (data.isDraft !== undefined) payload.is_draft = data.isDraft;

        const { data: updated, error } = await supabase
          .from("journal_entries")
          .update(payload)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        if (updated) return mapDbRowToJournalEntry(updated);
      } catch (err) {
        console.error("Erro ao atualizar entrada no diário via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Entrada do diário não encontrada");

    const updated = {
      ...entries[index],
      ...data,
      updatedAt: now,
    };
    entries[index] = updated;
    this.setStorage(entries);
    return updated;
  }

  static async deleteEntry(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("journal_entries")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return;
      } catch (err) {
        console.error("Erro ao excluir entrada do diário via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    this.setStorage(entries.filter((e) => e.id !== id));
  }
}
