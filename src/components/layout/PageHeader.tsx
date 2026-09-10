import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-border/40">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}
