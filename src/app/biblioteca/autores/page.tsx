"use client";

import { useMemo } from "react";
import { Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLibrary } from "@/context/library-context";
import { BookCard } from "@/components/library/BookCard";
import { BookDialogs } from "@/components/library/BookDialogs";

export default function AutoresPage() {
  const { books, openDetail } = useLibrary();

  const authorGroups = useMemo(() => {
    const map = new Map<string, typeof books>();
    books.forEach((book) => {
      const list = map.get(book.author) || [];
      list.push(book);
      map.set(book.author, list);
    });

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [books]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Autores"
        description="Mapeamento dos autores que compõem sua formação e trajetória de leitura."
      />

      {authorGroups.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nenhum autor cadastrado ainda.
        </p>
      ) : (
        <div className="space-y-10">
          {authorGroups.map(([author, authorBooks]) => (
            <section key={author} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-border/60 pb-2">
                <h2 className="font-display text-2xl font-medium text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  {author}
                </h2>
                <span className="text-xs text-muted-foreground font-medium">
                  {authorBooks.length} {authorBooks.length === 1 ? "livro" : "livros"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {authorBooks.map((b) => (
                  <BookCard key={b.id} book={b} onOpen={() => openDetail(b.id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <BookDialogs />
    </div>
  );
}
