"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, X, Tag, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/book";
import { cn } from "@/lib/utils";

interface SubjectPickerProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
  allBooks: Book[];
}

export function SubjectPicker({
  selectedSubjects,
  onChange,
  allBooks,
}: SubjectPickerProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calcula estritamente os assuntos existentes cadastrados nos livros da biblioteca
  const allAvailableSubjects = useMemo(() => {
    const counts = new Map<string, number>();

    allBooks.forEach((book) => {
      (book.subjects || []).forEach((subj) => {
        const norm = subj.trim().toLowerCase();
        if (norm) {
          counts.set(norm, (counts.get(norm) || 0) + 1);
        }
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [allBooks]);

  // Filtra os assuntos existentes conforme a busca digitada
  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "");
    return allAvailableSubjects.filter(
      (item) =>
        !selectedSubjects.includes(item.name) &&
        (q === "" || item.name.toLowerCase().includes(q))
    );
  }, [allAvailableSubjects, selectedSubjects, query]);

  const cleanQuery = query.trim().toLowerCase().replace(/^#/, "");
  const isExactMatch = allAvailableSubjects.some(
    (item) => item.name === cleanQuery
  );
  const isAlreadySelected = selectedSubjects.includes(cleanQuery);
  const canCreateNew = cleanQuery.length > 0 && !isExactMatch && !isAlreadySelected;

  // Sugestões populares para clique rápido (apenas assuntos reais do banco)
  const topFrequentSuggestions = useMemo(() => {
    return allAvailableSubjects
      .filter((item) => !selectedSubjects.includes(item.name) && item.count > 0)
      .slice(0, 6);
  }, [allAvailableSubjects, selectedSubjects]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addSubject = (subjectName: string) => {
    const clean = subjectName.trim().toLowerCase().replace(/^#/, "");
    if (!clean) return;
    if (!selectedSubjects.includes(clean)) {
      onChange([...selectedSubjects, clean]);
    }
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeSubject = (subjectName: string) => {
    onChange(selectedSubjects.filter((s) => s !== subjectName));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addSubject(filteredSuggestions[highlightedIndex].name);
      } else if (cleanQuery) {
        addSubject(cleanQuery);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Campo de Input com Autocomplete */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              id="subject-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => {
                if (allAvailableSubjects.length > 0 || query) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Digite um assunto..."
              className="pr-8"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => addSubject(cleanQuery)}
            disabled={!cleanQuery}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Dropdown de Sugestões e Criação */}
        {isOpen && (canCreateNew || filteredSuggestions.length > 0) && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg backdrop-blur-md animate-in fade-in-50 zoom-in-95">
            {/* Opção para criar assunto novo digitado */}
            {canCreateNew && (
              <button
                type="button"
                onClick={() => addSubject(cleanQuery)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium text-primary hover:bg-primary/10 transition-colors cursor-pointer border-b border-border/40"
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Criar novo assunto: <strong>#{cleanQuery}</strong>
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Novo
                </span>
              </button>
            )}

            {/* Lista de assuntos existentes no acervo */}
            {filteredSuggestions.length > 0 && (
              <div className="py-1">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {cleanQuery ? "Assuntos correspondentes" : "Assuntos do acervo"}
                </div>
                {filteredSuggestions.map((item, index) => {
                  const isHighlighted = index === highlightedIndex;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => addSubject(item.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-xs transition-colors cursor-pointer",
                        isHighlighted
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-secondary/70"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        #{item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {item.count} {item.count === 1 ? "obra" : "obras"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assuntos Selecionados no Livro Atual */}
      {selectedSubjects.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            {selectedSubjects.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-xs transition-all"
              >
                <span>#{s}</span>
                <button
                  type="button"
                  aria-label={`Remover assunto ${s}`}
                  onClick={() => removeSubject(s)}
                  className="rounded-full hover:bg-primary/20 p-0.5 cursor-pointer text-primary/70 hover:text-primary transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sugestões Rápidas: apenas se já existirem assuntos reais criados */}
      {topFrequentSuggestions.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pb-1.5">
            <Sparkles className="h-3 w-3 text-primary/80" />
            <span>Assuntos já cadastrados no acervo:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topFrequentSuggestions.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => addSubject(item.name)}
                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary/40 hover:bg-secondary hover:border-primary/40 px-2.5 py-0.5 text-xs text-foreground/80 hover:text-foreground transition-all cursor-pointer"
              >
                <span>#{item.name}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({item.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
