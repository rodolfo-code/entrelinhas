"use client";

import { Plus, Search, BookOpen, Library as LibraryIcon, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLibrary } from "@/context/library-context";
import { CATEGORIES, ReadingStatus, STATUS_LABELS } from "@/types/book";
import { cn } from "@/lib/utils";
import { BookCard } from "./BookCard";
import { BookDialogs } from "./BookDialogs";
import { PageHeader } from "@/components/layout/PageHeader";

const STATUS_FILTERS: Array<{ value: "todos" | ReadingStatus; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "to_read", label: "Quero ler" },
  { value: "reading", label: "Lendo" },
  { value: "finished", label: "Lidos" },
  { value: "abandoned", label: "Abandonados" },
];

export function LibraryView({
  title = "Biblioteca",
  description = "Organize suas leituras, intenções de estudo e temas de formação.",
  fixedStatus,
}: {
  title?: string;
  description?: string;
  fixedStatus?: ReadingStatus;
}) {
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

  const effectiveStatus = fixedStatus ?? status;

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

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button onClick={openAdd} className="rounded-full shadow-sm">
            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2} />
            Adicionar livro
          </Button>
        }
      />

      {/* Filters & Search Toolbar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor ou assunto..."
            className="h-11 rounded-full border-border/80 bg-card pl-10 pr-4 text-sm shadow-xs focus-visible:ring-primary/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Status Filter Buttons */}
          {!fixedStatus &&
            STATUS_FILTERS.map((f) => {
              const active = status === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setStatus(f.value)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              );
            })}

          {/* Category Dropdown */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-[180px] rounded-full border-border/70 bg-card text-xs">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subject / Tag Dropdown */}
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-9 w-[180px] rounded-full border-border/70 bg-card text-xs">
              <SelectValue placeholder="Assunto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os assuntos</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  #{s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Filters if modified */}
          {(query || status !== "todos" || category !== "todas" || subject !== "todos") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setStatus("todos");
                setCategory("todas");
                setSubject("todos");
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Book Grid or Empty State */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted-foreground">
          Carregando sua biblioteca...
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 py-20 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
            <LibraryIcon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-medium text-foreground">
            Sua biblioteca está vazia
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Comece cadastrando os primeiros livros que você deseja ler ou já está estudando.
          </p>
          <Button onClick={openAdd} className="mt-6 rounded-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Adicionar primeiro livro
          </Button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-base font-medium text-foreground">
            Nenhum livro encontrado
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente buscar com outros termos ou redefinir os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((b) => (
            <BookCard key={b.id} book={b} onOpen={() => openDetail(b.id)} />
          ))}
        </div>
      )}

      {/* Dialogs for Add/Edit/Detail/Delete */}
      <BookDialogs />
    </div>
  );
}
