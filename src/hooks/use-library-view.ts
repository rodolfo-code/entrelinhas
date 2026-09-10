"use client";

import { useState, useMemo } from "react";
import { useLibrary } from "@/context/library-context";
import { ReadingStatus } from "@/types/book";

interface UseLibraryViewOptions {
  fixedStatus?: ReadingStatus;
}

export function useLibraryView(options?: UseLibraryViewOptions) {
  const { books, isLoading, openAdd, openDetail } = useLibrary();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | ReadingStatus>("todos");
  const [category, setCategory] = useState<string>("todas");
  const [subject, setSubject] = useState<string>("todos");

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return Array.from(set).sort();
  }, [books]);

  const subjects = useMemo(() => {
    const set = new Set(books.flatMap((b) => b.subjects));
    return Array.from(set).sort();
  }, [books]);

  const effectiveStatus = options?.fixedStatus ?? status;

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const q = query.trim().toLowerCase();
      if (
        q &&
        !`${b.title} ${b.author} ${b.subjects.join(" ")} ${b.whyRead || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      if (effectiveStatus !== "todos" && b.status !== effectiveStatus) return false;
      if (category !== "todas" && b.category !== category) return false;
      if (subject !== "todos" && !b.subjects.includes(subject)) return false;
      return true;
    });
  }, [books, query, effectiveStatus, category, subject]);

  const hasActiveFilters = Boolean(
    query ||
      (!options?.fixedStatus && status !== "todos") ||
      category !== "todas" ||
      subject !== "todos"
  );

  const clearFilters = () => {
    setQuery("");
    setStatus("todos");
    setCategory("todas");
    setSubject("todos");
  };

  return {
    books,
    filteredBooks,
    isLoading,
    query,
    setQuery,
    status,
    setStatus,
    category,
    setCategory,
    subject,
    setSubject,
    categories,
    subjects,
    hasActiveFilters,
    clearFilters,
    openAdd,
    openDetail,
  };
}
