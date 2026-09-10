import {
  BookOpen,
  Bookmark,
  CheckCheck,
  Library,
  Newspaper,
  Users,
  Tags,
  Settings,
  NotebookPen,
} from "lucide-react";

export type NavItem = { label: string; to: string; icon: typeof Library };
export type Section = {
  key: string;
  label: string;
  to: string;
  icon: typeof Library;
  sidebarTitle: string;
  items: NavItem[];
};

export const SECTIONS: Section[] = [
  {
    key: "feed",
    label: "Feed",
    to: "/",
    icon: Newspaper,
    sidebarTitle: "Atividade",
    items: [{ label: "Feed", to: "/", icon: Newspaper }],
  },
  {
    key: "biblioteca",
    label: "Biblioteca",
    to: "/biblioteca",
    icon: Library,
    sidebarTitle: "Coleção",
    items: [
      { label: "Biblioteca", to: "/biblioteca", icon: Library },
      { label: "Quero ler", to: "/biblioteca/quero-ler", icon: Bookmark },
      { label: "Lendo", to: "/biblioteca/lendo", icon: BookOpen },
      { label: "Lidos", to: "/biblioteca/lidos", icon: CheckCheck },
      { label: "Autores", to: "/biblioteca/autores", icon: Users },
      { label: "Assuntos", to: "/biblioteca/assuntos", icon: Tags },
    ],
  },
  {
    key: "notas",
    label: "Notas",
    to: "/notas",
    icon: NotebookPen,
    sidebarTitle: "Escrita",
    items: [{ label: "Todas as notas", to: "/notas", icon: NotebookPen }],
  },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Configurações",
  to: "/configuracoes",
  icon: Settings,
};

export function sectionForPath(pathname: string): Section {
  const match = SECTIONS.slice(1).find((s) => pathname.startsWith(s.to));
  return match ?? SECTIONS[0]!;
}
