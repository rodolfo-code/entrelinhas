"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Edit3,
  X,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Note, NoteCategory, NOTE_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

const NOTES_STORAGE_KEY = "literature_app_notes_v1";

const INITIAL_NOTES: Note[] = [
  {
    id: "n_1",
    title: "O conceito de Culpa em Dostoiévski",
    content:
      "Em Crime e Castigo, Raskólnikov não sofre pela lei humana ou pelo medo da prisão, mas pela fragmentação interna da sua própria consciência. A punição precede o tribunal e reside no isolamento afetivo que o crime impõe ao indivíduo.",
    category: "Ensaio",
    tags: ["dostoievski", "culpa", "moral", "literatura-russa"],
    linkedBookTitle: "Crime e Castigo",
    createdAt: new Date("2026-08-15T14:20:00").toISOString(),
    updatedAt: new Date("2026-08-15T14:20:00").toISOString(),
  },
  {
    id: "n_2",
    title: "A Alegoria da Caverna e a Educação Humanística",
    content:
      "A saída da caverna em Platão não é um acúmulo de fatos, mas uma conversão do olhar (periagoge). O estudante não precisa de 'novos olhos', mas de redirecionar a visão para a luz da verdade.",
    category: "Estudo",
    tags: ["platao", "filosofia", "educacao"],
    linkedBookTitle: "A República",
    createdAt: new Date("2026-08-17T11:00:00").toISOString(),
    updatedAt: new Date("2026-08-17T11:00:00").toISOString(),
  },
  {
    id: "n_3",
    title: "O Absurdo e a Revolta em Camus",
    content:
      "Constatação: para Camus, o absurdo nasce do confronto entre o desejo humano de sentido e o silêncio irracional do mundo. A resposta digna não é o suicídio, mas a revolta lúcida e a paixão pelo presente.",
    category: "Reflexão",
    tags: ["camus", "existencialismo", "absurdo"],
    linkedBookTitle: "O Estrangeiro",
    createdAt: new Date("2026-08-19T18:45:00").toISOString(),
    updatedAt: new Date("2026-08-19T18:45:00").toISOString(),
  },
];

const CATEGORY_STYLES: Record<NoteCategory, string> = {
  Ensaio: "border-primary/40 bg-primary/10 text-primary",
  Reflexão: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  Estudo: "border-blue-600/30 bg-blue-500/10 text-blue-800 dark:text-blue-300",
  Rascunho: "border-border bg-secondary text-muted-foreground",
  Ideia: "border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
};

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Reflexão");
  const [linkedBookTitle, setLinkedBookTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        setNotes(INITIAL_NOTES);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      }
    } catch (e) {
      setNotes(INITIAL_NOTES);
    }
  }, []);

  const saveToStorage = (updated: Note[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const openNewNote = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("Reflexão");
    setLinkedBookTitle("");
    setTags([]);
    setTagInput("");
    setIsModalOpen(true);
  };

  const openEditNote = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setLinkedBookTitle(n.linkedBookTitle || "");
    setTags(n.tags);
    setTagInput("");
    setIsModalOpen(true);
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const now = new Date().toISOString();

    if (editingNote) {
      const updated = notes.map((item) =>
        item.id === editingNote.id
          ? {
              ...item,
              title: title.trim(),
              content: content.trim(),
              category,
              linkedBookTitle: linkedBookTitle.trim() || undefined,
              tags,
              updatedAt: now,
            }
          : item
      );
      saveToStorage(updated);
    } else {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        category,
        linkedBookTitle: linkedBookTitle.trim() || undefined,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      saveToStorage([newNote, ...notes]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveToStorage(updated);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = query.trim().toLowerCase();
      if (
        q &&
        !`${n.title} ${n.content} ${n.tags.join(" ")} ${n.linkedBookTitle || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      if (categoryFilter !== "todas" && n.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [notes, query, categoryFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Caderno de Notas & Escritos"
        description="Seus ensaios, sínteses conceituais, anotações de estudo e reflexões aprofundadas."
        action={
          <Button onClick={openNewNote} className="rounded-full shadow-xs">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Nota
          </Button>
        }
      />

      {/* Toolbar: Search & Category Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, conteúdo ou tema..."
            className="h-11 rounded-full border-border/80 bg-card pl-10 pr-4 text-sm shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCategoryFilter("todas")}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              categoryFilter === "todas"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Todas as notas ({notes.length})
          </button>

          {NOTE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                categoryFilter === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-medium text-foreground">
            Nenhuma nota encontrada
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Crie sua primeira reflexão ou ensaio conectado aos seus livros.
          </p>
          <Button onClick={openNewNote} className="mt-5 rounded-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Escrever nova nota
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredNotes.map((note) => {
            const dateStr = new Date(note.createdAt).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <article
                key={note.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                        CATEGORY_STYLES[note.category]
                      )}
                    >
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditNote(note)}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Editar nota"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                        title="Excluir nota"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-medium text-foreground mt-3 leading-snug">
                    {note.title}
                  </h3>

                  {note.linkedBookTitle && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-primary/90 font-medium">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{note.linkedBookTitle}</span>
                    </div>
                  )}

                  <p className="mt-3 text-sm text-foreground/80 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-border/40 flex flex-col gap-2">
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Dialog: Create / Edit Note */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium">
              {editingNote ? "Editar Nota" : "Nova Nota de Estudo"}
            </DialogTitle>
            <DialogDescription>
              Escreva suas reflexões, ensaios ou ideias conectadas à sua formação.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Título da Nota <span className="text-destructive">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O conceito de culpa em Dostoiévski"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria <span className="text-destructive">*</span>
                </label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as NoteCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Livro vinculado <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
                </label>
                <Input
                  value={linkedBookTitle}
                  onChange={(e) => setLinkedBookTitle(e.target.value)}
                  placeholder="Ex: Crime e Castigo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Conteúdo <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Desenvolva seu raciocínio, cite passagens ou formule suas teses..."
                required
                className="leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tags / Assuntos
              </label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Digite uma tag e pressione Enter..."
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  Adicionar
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="hover:text-destructive cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="rounded-full">
                {editingNote ? "Salvar alterações" : "Criar nota"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
