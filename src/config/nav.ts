import {
  Library,
  Newspaper,
  Users,
  Tags,
  Settings,
  NotebookPen,
  BookHeart,
  FileText,
  BookA,
} from "lucide-react";
import type { NavItem, Section } from "@/types";

export const SECTIONS: Section[] = [
  {
    key: "biblioteca",
    label: "Biblioteca",
    to: "/biblioteca",
    icon: Library,
    sidebarTitle: "Coleção",
    items: [
      { label: "Biblioteca", to: "/biblioteca", icon: Library },
      { label: "Autores", to: "/biblioteca/autores", icon: Users },
      { label: "Assuntos", to: "/biblioteca/assuntos", icon: Tags },
    ],
  },
  {
    key: "feed",
    label: "Feed",
    to: "/",
    icon: Newspaper,
    sidebarTitle: "Atividade",
    items: [{ label: "Feed", to: "/", icon: Newspaper }],
  },
  {
    key: "notas",
    label: "Notas",
    to: "/notas",
    icon: NotebookPen,
    sidebarTitle: "Escrita & Reflexão",
    items: [
      { label: "Diário", to: "/notas/diario", icon: BookHeart },
      { label: "Caderno de Notas", to: "/notas", icon: FileText },
      { label: "Dicionário", to: "/notas/dicionario", icon: BookA },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Configurações",
  to: "/configuracoes",
  icon: Settings,
};

export function sectionForPath(pathname: string): Section {
  if (pathname === "/") {
    const feed = SECTIONS.find((s) => s.key === "feed");
    return feed ?? SECTIONS[0];
  }
  const match = SECTIONS.find((s) => s.to !== "/" && pathname.startsWith(s.to));
  return match ?? SECTIONS[0];
}
