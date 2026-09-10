import { STATUS_LABELS, type Book } from "@/lib/library";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  "quero-ler": "border-border text-muted-foreground",
  lendo: "border-accent bg-accent/50 text-accent-foreground",
  lido: "border-primary/25 bg-primary/5 text-foreground",
  abandonei: "border-border text-muted-foreground/70",
};

export function BookCard({ book, onOpen }: { book: Book; onOpen: () => void }) {
  const initials = book.title
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-5 rounded-lg border border-border/70 bg-card p-5 text-left transition-colors hover:border-border hover:bg-secondary/40"
    >
      <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-sm border border-border/70 bg-secondary font-display text-base text-muted-foreground">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-lg leading-snug">{book.title}</h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{book.author}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {book.category}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {book.subjects.map((s) => (
            <span key={s} className="text-xs text-muted-foreground">
              #{s}
            </span>
          ))}
        </div>
        <span
          className={cn(
            "mt-4 inline-flex rounded-full border px-2.5 py-0.5 text-xs",
            statusStyles[book.status],
          )}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>
    </button>
  );
}
