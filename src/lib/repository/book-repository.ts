import { Book, BookFormData, Category, ReadingStatus } from "@/types/book";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface DbBookRow {
  id: string;
  title: string;
  author: string;
  category: string;
  subjects: string[] | null;
  status: string;
  cover_url: string | null;
  why_read: string | null;
  notes: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = "literature_app_books_v1";

function mapDbRowToBook(row: DbBookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category as Category,
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    status: row.status as ReadingStatus,
    coverUrl: row.cover_url || undefined,
    whyRead: row.why_read || undefined,
    notes: row.notes || undefined,
    startedAt: row.started_at || undefined,
    finishedAt: row.finished_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class BookRepository {
  private static getStorage(): Book[] {
    if (typeof window === "undefined") {
      return [];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Erro ao ler do localStorage", e);
      return [];
    }
  }

  private static setStorage(books: Book[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error("Erro ao gravar no localStorage", e);
    }
  }

  static async getBooks(): Promise<Book[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar livros do Supabase:", error.message);
          return this.getStorage();
        }

        if (data && data.length > 0) {
          return data.map(mapDbRowToBook);
        }

        // Se a tabela do Supabase estiver vazia, podemos carregar os iniciais
        return [];
      } catch (err) {
        console.error("Exceção ao conectar no Supabase:", err);
        return this.getStorage();
      }
    }

    return this.getStorage();
  }

  static async getBookById(id: string): Promise<Book | undefined> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar livro por ID:", error.message);
        } else if (data) {
          return mapDbRowToBook(data);
        }
      } catch (err) {
        console.error("Exceção ao buscar livro por ID no Supabase:", err);
      }
    }

    const books = this.getStorage();
    return books.find((b) => b.id === id);
  }

  static async createBook(data: BookFormData): Promise<Book> {
    const now = new Date().toISOString();
    const startedAt = data.status === "reading" ? now : null;
    const finishedAt = data.status === "finished" ? now : null;

    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from("books")
          .insert({
            title: data.title,
            author: data.author,
            category: data.category,
            subjects: data.subjects || [],
            status: data.status,
            cover_url: data.coverUrl || null,
            why_read: data.whyRead || null,
            notes: data.notes || null,
            started_at: startedAt,
            finished_at: finishedAt,
          })
          .select()
          .single();

        if (error) {
          console.error("Erro ao criar livro no Supabase:", error.message);
          throw error;
        }

        if (inserted) {
          return mapDbRowToBook(inserted);
        }
      } catch (err) {
        console.error("Exceção ao criar livro no Supabase, caindo para storage:", err);
      }
    }

    // Fallback para localStorage
    const books = this.getStorage();
    const newBook: Book = {
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : `book_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      startedAt: startedAt || undefined,
      finishedAt: finishedAt || undefined,
    };

    const updated = [newBook, ...books];
    this.setStorage(updated);
    return newBook;
  }

  static async updateBook(id: string, data: Partial<BookFormData>): Promise<Book> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, unknown> = {
          updated_at: now,
        };

        if (data.title !== undefined) updatePayload.title = data.title;
        if (data.author !== undefined) updatePayload.author = data.author;
        if (data.category !== undefined) updatePayload.category = data.category;
        if (data.subjects !== undefined) updatePayload.subjects = data.subjects;
        if (data.status !== undefined) {
          updatePayload.status = data.status;
          if (data.status === "reading") {
            updatePayload.started_at = now;
          } else if (data.status === "finished") {
            updatePayload.finished_at = now;
          }
        }
        if ("coverUrl" in data) updatePayload.cover_url = data.coverUrl || null;
        if ("whyRead" in data) updatePayload.why_read = data.whyRead || null;
        if ("notes" in data) updatePayload.notes = data.notes || null;

        const { data: updated, error } = await supabase
          .from("books")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Erro ao atualizar livro no Supabase:", error.message);
          throw error;
        }

        if (updated) {
          return mapDbRowToBook(updated);
        }
      } catch (err) {
        console.error("Exceção ao atualizar livro no Supabase, caindo para storage:", err);
      }
    }

    // Fallback para localStorage
    const books = this.getStorage();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Livro com ID ${id} não encontrado`);
    }

    const current = books[index];
    const updatedBook: Book = {
      ...current,
      ...data,
      updatedAt: now,
      startedAt:
        data.status === "reading" && !current.startedAt ? now : current.startedAt,
      finishedAt:
        data.status === "finished" && !current.finishedAt ? now : current.finishedAt,
    };

    books[index] = updatedBook;
    this.setStorage(books);
    return updatedBook;
  }

  static async deleteBook(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from("books").delete().eq("id", id);
        if (error) {
          console.error("Erro ao deletar livro no Supabase:", error.message);
          throw error;
        }
        return;
      } catch (err) {
        console.error("Exceção ao deletar livro no Supabase:", err);
      }
    }

    const books = this.getStorage();
    const filtered = books.filter((b) => b.id !== id);
    this.setStorage(filtered);
  }

  static async searchBooks(query: string): Promise<Book[]> {
    const books = await this.getBooks();
    const q = query.trim().toLowerCase();
    if (!q) return books;

    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subjects.some((s) => s.toLowerCase().includes(q)) ||
        (b.whyRead && b.whyRead.toLowerCase().includes(q))
    );
  }

  static async filterBooks(params: {
    status?: ReadingStatus | "todos";
    category?: Category | "todas";
    subject?: string;
  }): Promise<Book[]> {
    let books = await this.getBooks();

    if (params.status && params.status !== "todos") {
      books = books.filter((b) => b.status === params.status);
    }

    if (params.category && params.category !== "todas") {
      books = books.filter((b) => b.category === params.category);
    }

    if (params.subject && params.subject !== "todos") {
      books = books.filter((b) => b.subjects.includes(params.subject!));
    }

    return books;
  }
}
