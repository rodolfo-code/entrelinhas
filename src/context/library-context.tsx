"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BookFormData } from "@/types/book";
import { BookRepository } from "@/lib/repository/book-repository";

type UIState =
  | { kind: "closed" }
  | { kind: "add" }
  | { kind: "edit"; id: string }
  | { kind: "detail"; id: string }
  | { kind: "delete_confirm"; id: string };

interface LibraryContextType {
  books: Book[];
  isLoading: boolean;
  ui: UIState;
  openAdd: () => void;
  openEdit: (id: string) => void;
  openDetail: (id: string) => void;
  openDeleteConfirm: (id: string) => void;
  close: () => void;
  addBook: (data: BookFormData) => Promise<Book>;
  updateBook: (id: string, data: Partial<BookFormData>) => Promise<Book>;
  removeBook: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ui, setUi] = useState<UIState>({ kind: "closed" });

  const loadBooks = async () => {
    try {
      const data = await BookRepository.getBooks();
      setBooks(data);
    } catch (e) {
      console.error("Erro ao carregar livros", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const openAdd = () => setUi({ kind: "add" });
  const openEdit = (id: string) => setUi({ kind: "edit", id });
  const openDetail = (id: string) => setUi({ kind: "detail", id });
  const openDeleteConfirm = (id: string) => setUi({ kind: "delete_confirm", id });
  const close = () => setUi({ kind: "closed" });

  const addBook = async (data: BookFormData) => {
    const created = await BookRepository.createBook(data);
    await loadBooks();
    return created;
  };

  const updateBook = async (id: string, data: Partial<BookFormData>) => {
    const updated = await BookRepository.updateBook(id, data);
    await loadBooks();
    return updated;
  };

  const removeBook = async (id: string) => {
    await BookRepository.deleteBook(id);
    await loadBooks();
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        isLoading,
        ui,
        openAdd,
        openEdit,
        openDetail,
        openDeleteConfirm,
        close,
        addBook,
        updateBook,
        removeBook,
        refresh: loadBooks,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary deve ser usado dentro de um LibraryProvider");
  }
  return context;
}
