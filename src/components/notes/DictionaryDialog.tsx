"use client";

import { X, Loader2 } from "lucide-react";
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
import { DictionaryEntry } from "@/types";

interface DictionaryDialogProps {
  isModalOpen: boolean;
  closeModal: () => void;
  editingEntry: DictionaryEntry | null;
  word: string;
  setWord: (v: string) => void;
  grammaticalClass: string;
  setGrammaticalClass: (v: string) => void;
  meaning: string;
  setMeaning: (v: string) => void;
  contextExample: string;
  setContextExample: (v: string) => void;
  sourceBook: string;
  setSourceBook: (v: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  tags: string[];
  addTag: () => void;
  removeTag: (tag: string) => void;
  handleSave: () => void;
  isSubmitting: boolean;
}

export function DictionaryDialog({
  isModalOpen,
  closeModal,
  editingEntry,
  word,
  setWord,
  grammaticalClass,
  setGrammaticalClass,
  meaning,
  setMeaning,
  contextExample,
  setContextExample,
  sourceBook,
  setSourceBook,
  tagInput,
  setTagInput,
  tags,
  addTag,
  removeTag,
  handleSave,
  isSubmitting,
}: DictionaryDialogProps) {
  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
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

          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingEntry ? "Salvar alterações" : "Salvar no dicionário"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
