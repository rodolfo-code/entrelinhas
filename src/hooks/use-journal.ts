import { useState, useEffect, useCallback } from "react";
import { JournalRepository } from "@/lib/repository";
import { JournalEntry, JournalMood } from "@/types";

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<JournalMood>("reflexivo");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await JournalRepository.getEntries();
      setEntries(data);
    } catch (e) {
      console.error("Erro ao carregar entradas do diário:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const openNewEntry = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setSelectedMood("reflexivo");
    setTags([]);
    setTagInput("");
    setIsWriting(true);
  };

  const closeForm = () => {
    setIsWriting(false);
    setEditingId(null);
    setTitle("");
    setContent("");
    setSelectedMood("reflexivo");
    setTags([]);
    setTagInput("");
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title || "");
    setContent(entry.content);
    setSelectedMood(entry.mood || "reflexivo");
    setTags(entry.tags);
    setIsWriting(true);
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
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const dateStr = new Date().toISOString().split("T")[0];

    try {
      if (editingId) {
        await JournalRepository.updateEntry(editingId, {
          title: title.trim() || undefined,
          content: content.trim(),
          mood: selectedMood,
          tags,
        });
      } else {
        await JournalRepository.createEntry({
          date: dateStr,
          title: title.trim() || undefined,
          content: content.trim(),
          mood: selectedMood,
          tags,
        });
      }

      await loadEntries();
      closeForm();
    } catch (e) {
      console.error("Erro ao salvar entrada no diário:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await JournalRepository.deleteEntry(id);
      await loadEntries();
    } catch (e) {
      console.error("Erro ao excluir entrada do diário:", e);
    }
  };

  return {
    entries,
    isLoading,
    isSubmitting,
    isWriting,
    editingId,
    // Form fields
    title,
    setTitle,
    content,
    setContent,
    selectedMood,
    setSelectedMood,
    tagInput,
    setTagInput,
    tags,
    // Form actions
    openNewEntry,
    closeForm,
    handleEdit,
    addTag,
    removeTag,
    handleSave,
    handleDelete,
    loadEntries,
  };
}