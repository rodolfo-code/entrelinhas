export type ReadingStatus = "to_read" | "reading" | "finished" | "abandoned";

export type Category =
  | "Literatura"
  | "Filosofia"
  | "Psicologia"
  | "História"
  | "Sociologia"
  | "Teologia"
  | "Ciência"
  | "Outro";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  subjects: string[];
  status: ReadingStatus;
  whyRead?: string;
  notes?: string;
  createdAt: string; // ISO date string for easy serialization
  updatedAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export type BookFormData = Omit<Book, "id" | "createdAt" | "updatedAt">;

export const CATEGORIES: Category[] = [
  "Literatura",
  "Filosofia",
  "Psicologia",
  "História",
  "Sociologia",
  "Teologia",
  "Ciência",
  "Outro",
];

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  to_read: "Quero ler",
  reading: "Lendo",
  finished: "Lido",
  abandoned: "Abandonado",
};

export const STATUS_STYLES: Record<ReadingStatus, string> = {
  to_read: "border-border text-muted-foreground bg-secondary/50",
  reading: "border-primary/40 bg-primary/10 text-primary font-medium",
  finished: "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium",
  abandoned: "border-border text-muted-foreground/70 bg-muted/30",
};
