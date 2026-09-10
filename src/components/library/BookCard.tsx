"use client";

import { Book, STATUS_LABELS, STATUS_STYLES } from "@/types/book";
import { cn } from "@/lib/utils";

export function BookCard({ book, onOpen }: { book: Book; onOpen: () => void }) {
  const initials = book.title
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || book.title.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-4 rounded-xl border border-border/70 bg-card p-5 text-left transition-all duration-200 hover:border-border hover:bg-secondary/40 hover:shadow-xs cursor-pointer w-full"
    >
      {/* Book Spine / Cover Monogram */}
      <div className="flex h-24 w-16 shrink-0 items-center justify-center rounded-sm border border-border/70 bg-secondary font-display text-base font-medium text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-foreground">
        {initials}
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="truncate font-display text-lg font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{book.author}</p>
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/80">
            {book.category}
          </p>

          {book.subjects.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {book.subjects.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="inline-flex rounded-full bg-secondary/80 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  #{s}
                </span>
              ))}
              {book.subjects.length > 3 && (
                <span className="text-[11px] text-muted-foreground/70 self-center">
                  +{book.subjects.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors",
              STATUS_STYLES[book.status]
            )}
          >
            {STATUS_LABELS[book.status]}
          </span>
        </div>
      </div>
    </button>
  );
}
