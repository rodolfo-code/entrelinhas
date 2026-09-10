"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SECTIONS, SETTINGS_ITEM, sectionForPath } from "@/config/nav";

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const section = sectionForPath(pathname);
  return (
    <div className="flex h-full flex-col justify-between gap-8 py-6">
      <div>
        <p className="px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {section.sidebarTitle}
        </p>
        <nav className="mt-4 space-y-1">
          {section.items.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname === item.to;
            return (
              <Link
                key={item.label}
                href={item.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent/70 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border/60 pt-4">
        <Link
          href={SETTINGS_ITEM.to}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === SETTINGS_ITEM.to
              ? "bg-accent/70 text-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <SETTINGS_ITEM.icon className="h-4 w-4" strokeWidth={1.75} />
          {SETTINGS_ITEM.label}
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const current = sectionForPath(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          {/* Mobile Sheet Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="-ml-1 rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden cursor-pointer"
              aria-label="Abrir navegação"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 px-4">
              <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
              <div className="pb-4 pt-2">
                <Link
                  href="/"
                  className="font-display text-xl tracking-tight text-foreground"
                >
                  Entrelinhas
                </Link>
              </div>
              <SidebarNav
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Brand Logo */}
          <Link
            href="/"
            className="font-display text-2xl tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            Entrelinhas
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
            {SECTIONS.map((s) => {
              const active = s.key === current.key;
              return (
                <Link
                  key={s.key}
                  href={s.to}
                  className={cn(
                    "group relative flex items-center gap-2 px-4 py-5 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{s.label}</span>
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[2px] w-full origin-center scale-x-0 rounded-full bg-primary transition-transform duration-200",
                      active && "scale-x-100"
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Current Section Name */}
          <div className="ml-auto flex items-center md:hidden">
            <span className="text-sm font-medium text-muted-foreground">
              {current.label}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <SidebarNav pathname={pathname} />
          </div>
        </aside>
        <main className="min-w-0 flex-1 py-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
