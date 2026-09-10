"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  BookA,
  Trash2,
  Edit3,
  X,
  BookOpen,
  Quote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { DictionaryEntry } from "@/types";
import { cn } from "@/lib/utils";

const DICTIONARY_STORAGE_KEY = "literature_app_dictionary_v1";

const INITIAL_WORDS: DictionaryEntry[] = [
  {
    id: "w_1",
    word: "Aporia",
    grammaticalClass: "substantivo feminino",
    meaning:
      "Dificuldade ou impasse insolúvel num raciocínio filosófico; estado de perplexidade diante de duas teses contraditórias igualmente plausíveis.",
    contextExample:
      "Os primeiros diálogos socráticos de Platão terminam frequentemente em aporia, demonstrando que os interlocutores não conheciam aquilo que julgavam saber.",
    sourceBook: "A República · Platão",
    tags: ["filosofia", "grego", "logica"],
    createdAt: new Date("2026-08-10T10:00:00").toISOString(),
    updatedAt: new Date("2026-08-10T10:00:00").toISOString(),
  },
  {
    id: "w_2",
    word: "Pusilânime",
    grammaticalClass: "adjetivo",
    meaning:
      "Que revela falta de coragem, fraqueza de ânimo, covardia ou medo excessivo de agir perante as dificuldades.",
    contextExample:
      "Raskólnikov temia ser visto como um homem pusilânime caso hesitasse em levar adiante sua teoria sobre homens extraordinários.",
    sourceBook: "Crime e Castigo · Dostoiévski",
    tags: ["moral", "carater"],
    createdAt: new Date("2026-08-12T14:30:00").toISOString(),
    updatedAt: new Date("2026-08-12T14:30:00").toISOString(),
  },
  {
    id: "w_3",
    word: "Verossimilhança",
    grammaticalClass: "substantivo feminino",
    meaning:
      "Qualidade ou caráter do que é verossímil; aquilo que possui aparência de verdade ou coerência interna na obra ficcional, tornando-a crível.",
    contextExample:
      "A tragédia exige não o fato histórico exato, mas a verossimilhança dos motivos que movem as paixões humanas.",
    sourceBook: "Poética · Aristóteles",
    tags: ["literatura", "estetica"],
    createdAt: new Date("2026-08-14T09:15:00").toISOString(),
    updatedAt: new Date("2026-08-14T09:15:00").toISOString(),
  },
  {
    id: "w_4",
    word: "Epifania",
    grammaticalClass: "substantivo feminino",
    meaning:
      "Manifestação ou súbita sensação de revelação; momento em que um evento ordinário revela um sentido profundo ou existencial.",
    contextExample:
      "A visão da barata no quarto desencadeia em G.H. uma profunda epifania sobre a matéria bruta da existência.",
    sourceBook: "A Paixão segundo G.H. · Clarice Lispector",
    tags: ["revelacao", "literatura-brasileira"],
    createdAt: new Date("2026-08-16T16:20:00").toISOString(),
    updatedAt: new Date("2026-08-16T16:20:00").toISOString(),
  },
  {
    id: "w_5",
    word: "Inelutável",
    grammaticalClass: "adjetivo",
    meaning:
      "Contra o qual não se pode lutar nem escapar; inevitável, fatal, irremediável.",
    contextExample:
      "O destino do homem perante a morte surge como uma certeza inelutável que desmascara as ilusões cotidianas.",
    sourceBook: "O Estrangeiro · Albert Camus",
    tags: ["existencialismo", "tempo"],
    createdAt: new Date("2026-08-18T18:00:00").toISOString(),
    updatedAt: new Date("2026-08-18T18:00:00").toISOString(),
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function DictionaryView() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);

  // Form State
  const [word, setWord] = useState("");
  const [grammaticalClass, setGrammaticalClass] = useState("");
  const [meaning, setMeaning] = useState("");
  const [contextExample, setContextExample] = useState("");
  const [sourceBook, setSourceBook] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DICTIONARY_STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        setEntries(INITIAL_WORDS);
        localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(INITIAL_WORDS));
      }
    } catch (e) {
      setEntries(INITIAL_WORDS);
    }
  }, []);

  const saveToStorage = (updated: DictionaryEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(DICTIONARY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const openNew = () => {
    setEditingEntry(null);
    setWord("");
    setGrammaticalClass("");
    setMeaning("");
    setContextExample("");
    setSourceBook("");
    setTags([]);
    setTagInput("");
    setIsModalOpen(true);
  };

  const openEdit = (item: DictionaryEntry) => {
    setEditingEntry(item);
    setWord(item.word);
    setGrammaticalClass(item.grammaticalClass || "");
    setMeaning(item.meaning);
    setContextExample(item.contextExample || "");
    setSourceBook(item.sourceBook || "");
    setTags(item.tags);
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
    if (!word.trim() || !meaning.trim()) return;

    const now = new Date().toISOString();

    if (editingEntry) {
      const updated = entries.map((item) =>
        item.id === editingEntry.id
          ? {
              ...item,
              word: word.trim(),
              grammaticalClass: grammaticalClass.trim() || undefined,
              meaning: meaning.trim(),
              contextExample: contextExample.trim() || undefined,
              sourceBook: sourceBook.trim() || undefined,
              tags,
              updatedAt: now,
            }
          : item
      );
      saveToStorage(updated);
    } else {
      const newEntry: DictionaryEntry = {
        id: `word_${Date.now()}`,
        word: word.trim(),
        grammaticalClass: grammaticalClass.trim() || undefined,
        meaning: meaning.trim(),
        contextExample: contextExample.trim() || undefined,
        sourceBook: sourceBook.trim() || undefined,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      saveToStorage([newEntry, ...entries]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  const availableLetters = useMemo(() => {
    const set = new Set(entries.map((e) => e.word[0]?.toUpperCase()).filter(Boolean));
    return set;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const q = query.trim().toLowerCase();
        if (
          q &&
          !`${e.word} ${e.meaning} ${e.contextExample || ""} ${e.tags.join(" ")}`
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }
        if (
          selectedLetter &&
          e.word[0]?.toUpperCase() !== selectedLetter.toUpperCase()
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.word.localeCompare(b.word, "pt-BR"));
  }, [entries, query, selectedLetter]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dicionário Pessoal"
        description="Termos raros, palavras novas e conceitos literários que você vai descobrindo ao longo das leituras."
        action={
          <Button onClick={openNew} className="rounded-full shadow-xs">
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

          {ALPHABET.map((letter) => {
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
            );
          })}
        </div>
      </div>

      {/* Dictionary Cards */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
          <BookA className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-medium text-foreground">
            Nenhuma palavra encontrada
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Comece salvando as palavras que você encontrou nas suas leituras recentes.
          </p>
          <Button onClick={openNew} className="mt-5 rounded-full">
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

      {/* Dialog: Add / Edit Word */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium">
              {editingEntry ? "Editar Palavra" : "Cadastrar Nova Palavra"}
            </DialogTitle>
            <DialogDescription>
              Salve a palavra, o significado e o contexto em que você a descobriu.
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Palavra / Termo <span className="text-destructive">*</span>
                </label>
                <Input
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Ex: Aporia"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Classe gramatical <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
                </label>
                <Input
                  value={grammaticalClass}
                  onChange={(e) => setGrammaticalClass(e.target.value)}
                  placeholder="Ex: substantivo feminino, adjetivo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Significado / Definição <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={4}
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Definição clara e objetiva do termo..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Exemplo de uso no texto <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
              </label>
              <Textarea
                rows={2}
                value={contextExample}
                onChange={(e) => setContextExample(e.target.value)}
                placeholder="Frase ou citação onde a palavra apareceu..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Livro ou autor de origem <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
              </label>
              <Input
                value={sourceBook}
                onChange={(e) => setSourceBook(e.target.value)}
                placeholder="Ex: A República · Platão"
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
                {editingEntry ? "Salvar alterações" : "Salvar no dicionário"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
