import { useState, useEffect, useMemo, useCallback } from "react";
import { Note, NoteCategory } from "@/types/note";
import { NoteRepository } from "@/lib/repository";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Reflexão");
  const [linkedBookTitle, setLinkedBookTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await NoteRepository.getNotes();
      setNotes(data);
    } catch (e) {
      console.error("Erro ao carregar notas:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const openNewNote = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("Reflexão");
    setLinkedBookTitle("");
    setTags([]);
    setTagInput("");
    setIsModalOpen(true);
  };

  const openEditNote = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setLinkedBookTitle(n.linkedBookTitle || "");
    setTags(n.tags);
    setTagInput("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("Reflexão");
    setLinkedBookTitle("");
    setTags([]);
    setTagInput("");
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingNote) {
        await NoteRepository.updateNote(editingNote.id, {
          title: title.trim(),
          content: content.trim(),
          category,
          linkedBookTitle: linkedBookTitle.trim() || undefined,
          tags,
        });
      } else {
        await NoteRepository.createNote({
          title: title.trim(),
          content: content.trim(),
          category,
          linkedBookTitle: linkedBookTitle.trim() || undefined,
          tags,
        });
      }

      await loadNotes();
      closeModal();
    } catch (e) {
      console.error("Erro ao salvar nota:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await NoteRepository.deleteNote(id);
      await loadNotes();
    } catch (e) {
      console.error("Erro ao excluir nota:", e);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = query.trim().toLowerCase();
      if (
        q &&
        !`${n.title} ${n.content} ${n.tags.join(" ")} ${n.linkedBookTitle || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      if (categoryFilter !== "todas" && n.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [notes, query, categoryFilter]);

  return {
    notes,
    filteredNotes,
    isLoading,
    isSubmitting,
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    isModalOpen,
    setIsModalOpen,
    editingNote,
    // Form fields
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    linkedBookTitle,
    setLinkedBookTitle,
    tagInput,
    setTagInput,
    tags,
    // Actions
    openNewNote,
    openEditNote,
    closeModal,
    addTag,
    removeTag,
    handleSave,
    handleDelete,
    loadNotes,
  };
}
