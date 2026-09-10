import { DictionaryEntry } from "@/types/note";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface DbDictionaryRow {
  id: string;
  word: string;
  meaning: string;
  grammatical_class: string | null;
  context_example: string | null;
  source_book: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "literature_app_dictionary_v1";

export type DictionaryEntryInput = Omit<
  DictionaryEntry,
  "id" | "createdAt" | "updatedAt"
>;

function mapDbRowToDictionaryEntry(row: DbDictionaryRow): DictionaryEntry {
  return {
    id: row.id,
    word: row.word,
    meaning: row.meaning,
    grammaticalClass: row.grammatical_class || undefined,
    contextExample: row.context_example || undefined,
    sourceBook: row.source_book || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class DictionaryRepository {
  private static getStorage(): DictionaryEntry[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static setStorage(entries: DictionaryEntry[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Erro ao gravar dicionário no localStorage", e);
    }
  }

  static async getEntries(): Promise<DictionaryEntry[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("dictionary_entries")
          .select("*")
          .order("word", { ascending: true });

        if (error) {
          console.error("Erro ao buscar dicionário do Supabase:", error.message);
          return this.getStorage();
        }

        if (data) {
          return data.map(mapDbRowToDictionaryEntry);
        }
      } catch (err) {
        console.error("Exceção ao buscar dicionário no Supabase:", err);
      }
    }
    return this.getStorage();
  }

  static async createEntry(
    data: DictionaryEntryInput
  ): Promise<DictionaryEntry> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from("dictionary_entries")
          .insert({
            word: data.word.trim(),
            meaning: data.meaning.trim(),
            grammatical_class: data.grammaticalClass || null,
            context_example: data.contextExample || null,
            source_book: data.sourceBook || null,
            tags: data.tags || [],
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) return mapDbRowToDictionaryEntry(inserted);
      } catch (err) {
        console.error("Erro ao criar verbete via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    const newEntry: DictionaryEntry = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `dict_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.setStorage([...entries, newEntry]);
    return newEntry;
  }

  static async updateEntry(
    id: string,
    data: Partial<DictionaryEntryInput>
  ): Promise<DictionaryEntry> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, unknown> = { updated_at: now };
        if (data.word !== undefined) payload.word = data.word.trim();
        if (data.meaning !== undefined) payload.meaning = data.meaning.trim();
        if (data.grammaticalClass !== undefined)
          payload.grammatical_class = data.grammaticalClass || null;
        if (data.contextExample !== undefined)
          payload.context_example = data.contextExample || null;
        if (data.sourceBook !== undefined)
          payload.source_book = data.sourceBook || null;
        if (data.tags !== undefined) payload.tags = data.tags;

        const { data: updated, error } = await supabase
          .from("dictionary_entries")
          .update(payload)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        if (updated) return mapDbRowToDictionaryEntry(updated);
      } catch (err) {
        console.error("Erro ao atualizar verbete via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Verbete não encontrado");

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
          .from("dictionary_entries")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return;
      } catch (err) {
        console.error("Erro ao excluir verbete via Supabase:", err);
      }
    }

    const entries = this.getStorage();
    this.setStorage(entries.filter((e) => e.id !== id));
  }
}
