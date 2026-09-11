"use client";

import {
  Plus,
  Search,
  BookA,
  Trash2,
  Edit3,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/hooks/use-dictionary";
import { DictionaryDialog } from "@/components/notes/DictionaryDialog";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function DictionaryView() {
  const {
    entries,
    isLoading,
    filteredEntries,
    query,
    setQuery,
    selectedLetter,
    setSelectedLetter,
    handleDelete,
    openNew,
    openEdit,
    availableLetters,
    ...dictionaryDialogProps
  } = useDictionary();

  const AlphabetComponent = () => {
    return ALPHABET.map((letter) => {
    const hasWords = availableLetters.has(letter);
    const isSelected = selectedLetter === letter;
    return (
      <button
        key={letter}
        type="button"
        disabled={!hasWords}
        onClick={() => setSelectedLetter(isSelected ? null : letter)}
        className={cn(
          "h-7 w-7 rounded-md text-xs font-medium transition-colors flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed",
          isSelected
            ? "bg-primary text-primary-foreground font-semibold"
            : hasWords
              ? "text-foreground hover:bg-secondary font-semibold"
              : "text-muted-foreground/40"
        )}
      >
        {letter}
      </button>
    )
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dicionário Pessoal"
        description="Termos raros, palavras novas e conceitos literários que você vai descobrindo ao longo das leituras."
        action={
          <Button onClick={openNew} className="rounded-full shadow-xs cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Palavra
          </Button>
        }
      />

      {/* Toolbar: Search & Alphabet Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palavra, significado ou contexto..."
            className="h-11 rounded-full border-border/80 bg-card pl-10 pr-4 text-sm shadow-xs"
          />
        </div>

        {/* Alphabet Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-1 pb-2 border-b border-border/50">
          <button
            type="button"
            onClick={() => setSelectedLetter(null)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer",
              selectedLetter === null
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Todas ({entries.length})
          </button>
          
          <AlphabetComponent />
          
        </div>
      </div>

      {/* Dictionary Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm">Carregando dicionário...</span>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
          <BookA className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-medium text-foreground">
            Nenhuma palavra encontrada
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Comece salvando as palavras que você encontrou nas suas leituras recentes.
          </p>
          <Button onClick={openNew} className="mt-5 rounded-full cursor-pointer">
            <Plus className="h-4 w-4 mr-1.5" />
            Cadastrar primeira palavra
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredEntries.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-border hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-3">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-foreground leading-tight">
                      {item.word}
                    </h3>
                    {item.grammaticalClass && (
                      <span className="text-[11px] font-mono italic text-muted-foreground">
                        {item.grammaticalClass}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Editar termo"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                      title="Excluir termo"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Meaning */}
                <p className="mt-3.5 text-sm text-foreground/90 leading-relaxed">
                  {item.meaning}
                </p>

                {/* Context Example */}
                {item.contextExample && (
                  <blockquote className="mt-3 rounded-lg border-l-2 border-primary/50 bg-secondary/40 p-3 text-xs italic text-muted-foreground leading-relaxed">
                    “{item.contextExample}”
                  </blockquote>
                )}

                {/* Source Book */}
                {item.sourceBook && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.sourceBook}</span>
                  </div>
                )}
              </div>

              {item.tags.length > 0 && (
                <footer className="mt-5 pt-3 border-t border-border/40 flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] text-muted-foreground font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </footer>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Modal Dialog Component */}
      <DictionaryDialog {...dictionaryDialogProps} />
    </div>
  );
}
