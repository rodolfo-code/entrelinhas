"use client";

import { useMemo, useState } from "react";
import { Tags, Search, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLibrary } from "@/context/library-context";
import { BookCard } from "@/components/library/BookCard";
import { BookDialogs } from "@/components/library/BookDialogs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AssuntosPage() {
  const { books, openDetail } = useLibrary();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const subjectMap = useMemo(() => {
    const map = new Map<string, typeof books>();
    books.forEach((book) => {
      book.subjects.forEach((subj) => {
        const norm = subj.trim().toLowerCase();
        if (!norm) return;
        const list = map.get(norm) || [];
        list.push(book);
        map.set(norm, list);
      });
    });

    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
  }, [books]);

  const filteredSubjectMap = useMemo(() => {
    let result = subjectMap;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim().replace(/^#/, "");
      result = result.filter(([s]) => s.toLowerCase().includes(q));
    }
    if (selectedSubject) {
      result = result.filter(([s]) => s === selectedSubject);
    }
    return result;
  }, [subjectMap, searchQuery, selectedSubject]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Assuntos & Temas"
          description="Navegue pelas conexões temáticas da sua biblioteca (ex: culpa, moral, justiça, existencialismo)."
        />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (selectedSubject) setSelectedSubject(null);
            }}
            placeholder="Buscar assunto ou tema..."
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {subjectMap.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nenhum assunto cadastrado nos livros ainda.
        </p>
      ) : (
        <>
          {/* Tag cloud pill filters */}
          <div className="flex flex-wrap gap-2 pt-1 pb-4 border-b border-border/60">
            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className={cn(
                "rounded-full border px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer",
                selectedSubject === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              Todos os assuntos ({subjectMap.length})
            </button>
            {subjectMap.map(([subj, subjBooks]) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj === selectedSubject ? null : subj)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5",
                  selectedSubject === subj
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <span>#{subj}</span>
                <span className="text-[10px] opacity-75">({subjBooks.length})</span>
              </button>
            ))}
          </div>

          {/* Grouped Books by Subject */}
          {filteredSubjectMap.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum assunto encontrado para a busca &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="space-y-10">
              {filteredSubjectMap.map(([subj, subjBooks]) => (
                <section key={subj} className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
                    <h2 className="font-display text-2xl font-medium text-foreground flex items-center gap-2">
                      <Tags className="h-4 w-4 text-muted-foreground" />
                      #{subj}
                    </h2>
                    <span className="text-xs text-muted-foreground font-medium">
                      {subjBooks.length} {subjBooks.length === 1 ? "obra associada" : "obras associadas"}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {subjBooks.map((b) => (
                      <BookCard key={b.id} book={b} onOpen={() => openDetail(b.id)} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}

      <BookDialogs />
    </div>
  );
}
