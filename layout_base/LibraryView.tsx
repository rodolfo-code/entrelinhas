import { Plus, Search } from "lucide-react";
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
import { STATUS_LABELS, useLibrary, type Status } from "@/lib/library";
import { cn } from "@/lib/utils";
import { BookCard } from "./BookCard";
import { PageHeader } from "./PageHeader";

const STATUS_FILTERS: Array<{ value: "todos" | Status; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "quero-ler", label: "Quero ler" },
  { value: "lendo", label: "Lendo" },
  { value: "lido", label: "Lidos" },
  { value: "abandonei", label: "Abandonados" },
];

export function LibraryView({
  title,
  description,
  fixedStatus,
}: {
  title: string;
  description: string;
  fixedStatus?: Status;
}) {
  const { books, openAdd, openDetail } = useLibrary();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | Status>("todos");
  const [category, setCategory] = useState("todas");
  const [subject, setSubject] = useState("todos");

  const categories = useMemo(
    () => Array.from(new Set(books.map((b) => b.category))).sort(),
    [books],
  );
  const subjects = useMemo(
    () => Array.from(new Set(books.flatMap((b) => b.subjects))).sort(),
    [books],
  );

  const effectiveStatus = fixedStatus ?? status;
  const filtered = books.filter((b) => {
    const q = query.trim().toLowerCase();
    if (q && !`${b.title} ${b.author} ${b.subjects.join(" ")}`.toLowerCase().includes(q))
      return false;
    if (effectiveStatus !== "todos" && b.status !== effectiveStatus) return false;
    if (category !== "todas" && b.category !== category) return false;
    if (subject !== "todos" && !b.subjects.includes(subject)) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button onClick={openAdd} className="rounded-full">
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            Adicionar livro
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.6}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor ou assunto"
            className="h-11 rounded-full border-border/70 bg-card pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!fixedStatus &&
            STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  status === f.value
                    ? "border-transparent bg-secondary text-foreground"
                    : "border-border/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-[170px] rounded-full border-border/70 bg-card text-sm">
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

          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-9 w-[170px] rounded-full border-border/70 bg-card text-sm">
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
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nenhum livro encontrado
          {fixedStatus ? ` em “${STATUS_LABELS[fixedStatus]}”` : ""}.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <BookCard key={b.id} book={b} onOpen={() => openDetail(b.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
