"use client";

import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit3,
  X,
  BookHeart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/PageHeader";
import { JOURNAL_MOODS } from "@/types";
import { cn } from "@/lib/utils";
import { useJournal } from "@/hooks/use-journal";

export function JournalView() {
  const {
    entries,
    isLoading,
    isSubmitting,
    isWriting,
    editingId,
    title,
    setTitle,
    content,
    setContent,
    selectedMood,
    setSelectedMood,
    tagInput,
    setTagInput,
    tags,
    openNewEntry,
    closeForm,
    handleEdit,
    addTag,
    removeTag,
    handleSave,
    handleDelete,
  } = useJournal();

  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <PageHeader
        title="Diário Pessoal"
        description="Espaço intimista para registrar pensamentos diários, sentimentos, análises, conflitos e ideias efêmeras."
        action={
          !isWriting && (
            <Button
              onClick={openNewEntry}
              className="rounded-full shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Escrever entrada
            </Button>
          )
        }
      />

      {/* Editor / Journal Composer */}
      {isWriting && (
        <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground capitalize">
              <CalendarIcon className="h-4 w-4 text-primary" />
              {todayFormatted}
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da reflexão (opcional)..."
              className="font-display text-lg border-0 border-b border-border/60 bg-transparent px-0 rounded-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
            />

            {/* Mood Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Estado mental / Humor:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {JOURNAL_MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMood(m.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1",
                      selectedMood === m.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/70 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que está passando pela sua mente hoje? Descreva sentimentos, conflitos, pensamentos e ideias com total liberdade..."
              rows={8}
              className="resize-none border-border/60 bg-secondary/20 p-4 text-base leading-relaxed focus-visible:ring-primary/40 rounded-xl"
            />

            {/* Tags Input */}
            <div className="space-y-2">
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
                  placeholder="Tags (pressione Enter para adicionar)..."
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="cursor-pointer"
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
                        onClick={() => removeTag(t)}
                        className="hover:text-destructive cursor-pointer ml-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={closeForm}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isSubmitting}
              className="rounded-full px-6 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? "Salvar alterações" : "Guardar no diário"}
            </Button>
          </div>
        </section>
      )}

      {/* Journal Timeline */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm">Carregando seu diário...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
            <BookHeart className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display text-lg font-medium text-foreground">
              Seu diário está em branco
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Comece escrevendo seus pensamentos, impressões de leitura ou conflitos diários.
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const moodObj = JOURNAL_MOODS.find((m) => m.value === entry.mood);
            const dateDisplay = new Date(entry.date + "T12:00:00").toLocaleDateString(
              "pt-BR",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            );

            return (
              <article
                key={entry.id}
                className="group rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-sm"
              >
                <header className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary/70" />
                      <span>{dateDisplay}</span>
                      {moodObj && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground">
                            <span>{moodObj.emoji}</span>
                            <span>{moodObj.label}</span>
                          </span>
                        </>
                      )}
                    </div>
                    {entry.title && (
                      <h3 className="font-display text-xl font-medium text-foreground pt-1">
                        {entry.title}
                      </h3>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(entry)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Editar entrada"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Excluir entrada"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </header>

                <div className="mt-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {entry.content}
                </div>

                {entry.tags.length > 0 && (
                  <footer className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-border/40">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </footer>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
