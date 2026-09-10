import { Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { CATEGORIES, STATUS_LABELS, useLibrary, type Book, type Status } from "@/lib/library";

const EMPTY: Omit<Book, "id"> = {
  title: "",
  author: "",
  category: "Literatura",
  subjects: [],
  status: "quero-ler",
  why: "",
  notes: "",
};

function BookForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: Omit<Book, "id">;
  onCancel: () => void;
  onSubmit: (b: Omit<Book, "id">) => void;
}) {
  const [form, setForm] = useState(initial);
  const [tag, setTag] = useState("");

  useEffect(() => setForm(initial), [initial]);

  const addTag = () => {
    const t = tag.trim().replace(/^#/, "");
    if (t && !form.subjects.includes(t)) setForm({ ...form, subjects: [...form.subjects, t] });
    setTag("");
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSubmit(form);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Crime e Castigo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="Fiódor Dostoiévski"
          />
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger>
              <SelectValue />
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
          <Label>Status de leitura</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm({ ...form, status: v as Status })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Assuntos</Label>
        <Input
          id="subject"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="Digite e pressione Enter"
        />
        {form.subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.subjects.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                #{s}
                <button
                  type="button"
                  aria-label={`Remover ${s}`}
                  onClick={() =>
                    setForm({ ...form, subjects: form.subjects.filter((x) => x !== s) })
                  }
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="why">Por que quero ler?</Label>
        <Textarea
          id="why"
          rows={6}
          value={form.why}
          onChange={(e) => setForm({ ...form, why: e.target.value })}
          placeholder="A intenção intelectual por trás desta leitura…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="rounded-full">
          Salvar livro
        </Button>
      </div>
    </form>
  );
}

function Detail({ book }: { book: Book }) {
  const { openEdit, removeBook, close } = useLibrary();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {book.category} · {STATUS_LABELS[book.status]}
        </p>
        <h2 className="mt-2 font-display text-2xl">{book.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
      </div>

      {book.subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {book.subjects.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              #{s}
            </span>
          ))}
        </div>
      )}

      <section className="space-y-1.5">
        <h3 className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Por que quero ler?
        </h3>
        <p className="text-sm leading-relaxed">{book.why || "—"}</p>
      </section>

      <section className="space-y-1.5">
        <h3 className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Observações
        </h3>
        <p className="text-sm leading-relaxed">{book.notes || "—"}</p>
      </section>

      <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
        <Button
          variant="ghost"
          onClick={() => {
            removeBook(book.id);
            close();
          }}
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.6} />
          Excluir
        </Button>
        <Button variant="outline" className="rounded-full" onClick={() => openEdit(book.id)}>
          <Pencil className="h-4 w-4" strokeWidth={1.6} />
          Editar
        </Button>
      </div>
    </div>
  );
}

export function BookDialogs() {
  const { ui, close, books, addBook, updateBook } = useLibrary();
  const current =
    ui.kind === "detail" || ui.kind === "edit" ? books.find((b) => b.id === ui.id) : undefined;

  return (
    <Dialog open={ui.kind !== "closed"} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {ui.kind === "add"
              ? "Adicionar livro"
              : ui.kind === "edit"
                ? "Editar livro"
                : "Detalhes do livro"}
          </DialogTitle>
        </DialogHeader>

        {ui.kind === "add" && (
          <BookForm
            initial={EMPTY}
            onCancel={close}
            onSubmit={(b) => {
              addBook(b);
              close();
            }}
          />
        )}

        {ui.kind === "edit" && current && (
          <BookForm
            initial={current}
            onCancel={close}
            onSubmit={(b) => {
              updateBook(current.id, b);
              close();
            }}
          />
        )}

        {ui.kind === "detail" && current && <Detail book={current} />}
      </DialogContent>
    </Dialog>
  );
}
