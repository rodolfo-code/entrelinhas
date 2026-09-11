import { Note, NoteCategory } from "@/types/note";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface DbNoteRow {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
  book_id: string | null;
  linked_book_title: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "literature_app_notes_v1";

export type NoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;

function mapDbRowToNote(row: DbNoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: (row.category as NoteCategory) || "Reflexão",
    tags: Array.isArray(row.tags) ? row.tags : [],
    bookId: row.book_id || undefined,
    linkedBookTitle: row.linked_book_title || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class NoteRepository {
  private static getStorage(): Note[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static setStorage(notes: Note[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Erro ao gravar notes no localStorage", e);
    }
  }

  static async getNotes(): Promise<Note[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar notas do Supabase:", error.message);
          return this.getStorage();
        }

        if (data) {
          return data.map(mapDbRowToNote);
        }
      } catch (err) {
        console.error("Exceção ao buscar notas no Supabase:", err);
      }
    }
    return this.getStorage();
  }

  static async createNote(data: NoteInput): Promise<Note> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from("notes")
          .insert({
            title: data.title,
            content: data.content,
            category: data.category,
            tags: data.tags || [],
            book_id: data.bookId || null,
            linked_book_title: data.linkedBookTitle || null,
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) return mapDbRowToNote(inserted);
      } catch (err) {
        console.error("Erro ao criar nota via Supabase:", err);
      }
    }

    const notes = this.getStorage();
    const newNote: Note = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `note_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.setStorage([newNote, ...notes]);
    return newNote;
  }

  static async updateNote(
    id: string,
    data: Partial<NoteInput>
  ): Promise<Note> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const payload: Record<string, unknown> = { updated_at: now };
        if (data.title !== undefined) payload.title = data.title;
        if (data.content !== undefined) payload.content = data.content;
        if (data.category !== undefined) payload.category = data.category;
        if (data.tags !== undefined) payload.tags = data.tags;
        if ("bookId" in data) payload.book_id = data.bookId || null;
        if (data.linkedBookTitle !== undefined)
          payload.linked_book_title = data.linkedBookTitle || null;

        const { data: updated, error } = await supabase
          .from("notes")
          .update(payload)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        if (updated) return mapDbRowToNote(updated);
      } catch (err) {
        console.error("Erro ao atualizar nota via Supabase:", err);
      }
    }

    const notes = this.getStorage();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new Error("Nota não encontrada");

    const updated = {
      ...notes[index],
      ...data,
      updatedAt: now,
    };
    notes[index] = updated;
    this.setStorage(notes);
    return updated;
  }

  static async deleteNote(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) throw error;
        return;
      } catch (err) {
        console.error("Erro ao excluir nota via Supabase:", err);
      }
    }

    const notes = this.getStorage();
    this.setStorage(notes.filter((n) => n.id !== id));
  }
}
