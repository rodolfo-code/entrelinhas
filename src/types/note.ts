export type JournalMood =
  | "reflexivo"
  | "inspirado"
  | "inquieto"
  | "sereno"
  | "denso"
  | "focado";

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title?: string;
  content: string;
  mood?: JournalMood;
  tags: string[];
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory =
  | "Ensaio"
  | "Reflexão"
  | "Estudo"
  | "Rascunho"
  | "Ideia";

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  bookId?: string;          // FK para books.id
  linkedBookTitle?: string; // título em cache para exibição
  createdAt: string;
  updatedAt: string;
}

export const NOTE_CATEGORIES: NoteCategory[] = [
  "Ensaio",
  "Reflexão",
  "Estudo",
  "Rascunho",
  "Ideia",
];

export const JOURNAL_MOODS: Array<{ value: JournalMood; label: string; emoji: string }> = [
  { value: "reflexivo", label: "Reflexivo", emoji: "💭" },
  { value: "sereno", label: "Sereno", emoji: "🌿" },
  { value: "inspirado", label: "Inspirado", emoji: "✨" },
  { value: "inquieto", label: "Inquieto", emoji: "⚡" },
  { value: "denso", label: "Denso", emoji: "🌑" },
  { value: "focado", label: "Focado", emoji: "🎯" },
];

export interface DictionaryEntry {
  id: string;
  word: string;
  meaning: string;
  grammaticalClass?: string; // ex: "substantivo feminino", "adjetivo"
  contextExample?: string; // Frase ou trecho onde a palavra apareceu
  sourceBook?: string; // Livro onde foi encontrada
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

