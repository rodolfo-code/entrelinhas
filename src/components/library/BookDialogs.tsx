"use client";

import { Pencil, Trash2, X, AlertTriangle, Calendar, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLibrary } from "@/context/library-context";
import {
  Book,
  BookFormData,
  CATEGORIES,
  Category,
  ReadingStatus,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/types/book";
import { cn } from "@/lib/utils";

import { SubjectPicker } from "@/components/library/SubjectPicker";

const EMPTY_FORM: BookFormData = {
  title: "",
  author: "",
  category: "Literatura",
  subjects: [],
  status: "to_read",
  whyRead: "",
  notes: "",
};

function BookForm({
  initial,
  onCancel,
  onSubmit,
  isEditing = false,
}: {
  initial: BookFormData;
  onCancel: () => void;
  onSubmit: (b: BookFormData) => void;
  isEditing?: boolean;
}) {
  const { books } = useLibrary();
  const [form, setForm] = useState<BookFormData>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim()) return;
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Crime e Castigo"
            required
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author" className="text-foreground">
            Autor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="Ex: Fiódor Dostoiévski"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Categoria / Área <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm({ ...form, category: v as Category })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">
            Status de leitura <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as ReadingStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_LABELS) as ReadingStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject-input" className="text-foreground">
          Assuntos / Temas
        </Label>
        <SubjectPicker
          selectedSubjects={form.subjects}
          onChange={(subjects) => setForm({ ...form, subjects })}
          allBooks={books}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyRead" className="text-foreground">
          Por que quero ler? <span className="text-xs font-normal text-muted-foreground">(Contexto / Motivação intelectual)</span>
        </Label>
        <Textarea
          id="whyRead"
          rows={3}
          value={form.whyRead || ""}
          onChange={(e) => setForm({ ...form, whyRead: e.target.value })}
          placeholder="Ex: Quero entender a visão de Dostoiévski sobre o problema da consciência moral..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-foreground">
          Observações / Notas breves <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
        </Label>
        <Textarea
          id="notes"
          rows={2}
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Ex: Tradução de Rubens Figueiredo recomendada."
        />
      </div>

      <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="rounded-full">
          {isEditing ? "Salvar alterações" : "Cadastrar livro"}
        </Button>
      </div>
    </form>
  );
}

function Detail({ book }: { book: Book }) {
  const { openEdit, openDeleteConfirm } = useLibrary();

  const formattedDate = new Date(book.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {book.category}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span
            className={cn(
              "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
              STATUS_STYLES[book.status]
            )}
          >
            {STATUS_LABELS[book.status]}
          </span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-medium sm:text-3xl text-foreground">
          {book.title}
        </h2>
        <p className="mt-1 text-base text-muted-foreground">{book.author}</p>
      </div>

      {book.subjects.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Assuntos
          </h3>
          <div className="flex flex-wrap gap-2">
            {book.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border/70 bg-secondary/50 px-2.5 py-0.5 text-xs text-foreground"
              >
                #{s}
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="space-y-2 rounded-lg bg-secondary/30 p-4 border border-border/50">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Por que quero ler?
        </h3>
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {book.whyRead || "Nenhuma motivação informada."}
        </p>
      </section>

      {book.notes && (
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Observações
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {book.notes}
          </p>
        </section>
      )}

      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
        <Calendar className="h-3.5 w-3.5" />
        <span>Adicionado em {formattedDate}</span>
      </div>

      <div className="flex justify-between items-center border-t border-border/70 pt-4">
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => openDeleteConfirm(book.id)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" strokeWidth={1.6} />
          Excluir
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => openEdit(book.id)}
        >
          <Pencil className="h-4 w-4 mr-1.5" strokeWidth={1.6} />
          Editar livro
        </Button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  book,
  onConfirm,
  onCancel,
}: {
  book: Book;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-medium text-foreground">
            Excluir livro?
          </h3>
          <p className="text-sm text-muted-foreground">
            Tem certeza de que deseja remover <strong className="text-foreground">“{book.title}”</strong> da sua biblioteca? Essa ação não poderá ser desfeita.
          </p>
        </div>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm} className="rounded-full">
          Confirmar exclusão
        </Button>
      </DialogFooter>
    </div>
  );
}

export function BookDialogs() {
  const { ui, close, books, addBook, updateBook, removeBook } = useLibrary();

  const currentBook =
    ui.kind === "detail" || ui.kind === "edit" || ui.kind === "delete_confirm"
      ? books.find((b) => b.id === ui.id)
      : undefined;

  return (
    <Dialog open={ui.kind !== "closed"} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {ui.kind === "add" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-medium">
                Adicionar livro
              </DialogTitle>
              <DialogDescription>
                Registre um novo livro na sua biblioteca com sua motivação de estudo.
              </DialogDescription>
            </DialogHeader>
            <BookForm
              initial={EMPTY_FORM}
              onCancel={close}
              onSubmit={async (b) => {
                await addBook(b);
                close();
              }}
            />
          </>
        )}

        {ui.kind === "edit" && currentBook && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-medium">
                Editar livro
              </DialogTitle>
              <DialogDescription>
                Atualize as informações e anotações deste livro.
              </DialogDescription>
            </DialogHeader>
            <BookForm
              initial={currentBook}
              isEditing
              onCancel={close}
              onSubmit={async (b) => {
                await updateBook(currentBook.id, b);
                close();
              }}
            />
          </>
        )}

        {ui.kind === "detail" && currentBook && (
          <Detail book={currentBook} />
        )}

        {ui.kind === "delete_confirm" && currentBook && (
          <DeleteConfirmModal
            book={currentBook}
            onCancel={close}
            onConfirm={async () => {
              await removeBook(currentBook.id);
              close();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
