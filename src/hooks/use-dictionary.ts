import { useCallback, useEffect, useMemo, useState } from "react";

import { DictionaryRepository } from "@/lib/repository";
import { DictionaryEntry } from "@/types";


export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);

  // Form State
  const [word, setWord] = useState("");
  const [grammaticalClass, setGrammaticalClass] = useState("");
  const [meaning, setMeaning] = useState("");
  const [contextExample, setContextExample] = useState("");
  const [sourceBook, setSourceBook] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const loadEntries = useCallback(async () => {
      setIsLoading(true);
      try {
        const data = await DictionaryRepository.getEntries();
        setEntries(data);
      } catch (e) {
        console.error("Erro ao carregar palavras do dicionário:", e);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSave = async () => {
    if (!word.trim() || !meaning.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingEntry) {
        await DictionaryRepository.updateEntry(editingEntry.id, {
          word: word.trim(),
          grammaticalClass: grammaticalClass.trim() || undefined,
          meaning: meaning.trim(),
          contextExample: contextExample.trim() || undefined,
          sourceBook: sourceBook.trim() || undefined,
          tags,
        });
      } else {
        await DictionaryRepository.createEntry({
          word: word.trim(),
          grammaticalClass: grammaticalClass.trim() || undefined,
          meaning: meaning.trim(),
          contextExample: contextExample.trim() || undefined,
          sourceBook: sourceBook.trim() || undefined,
          tags,
        });
      }

      await loadEntries();
      closeModal();
    } catch (e) {
      console.error("Erro ao salvar palavra no dicionário:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DictionaryRepository.deleteEntry(id);
      await loadEntries();
    } catch (e) {
      console.error("Erro ao excluir palavra do dicionário:", e);
    }
  };

  const openNew = () => {
      setEditingEntry(null);
      setWord("");
      setGrammaticalClass("");
      setMeaning("");
      setContextExample("");
      setSourceBook("");
      setTags([]);
      setTagInput("");
      setIsModalOpen(true);
    };
  
  const openEdit = (item: DictionaryEntry) => {
    setEditingEntry(item);
    setWord(item.word);
    setGrammaticalClass(item.grammaticalClass || "");
    setMeaning(item.meaning);
    setContextExample(item.contextExample || "");
    setSourceBook(item.sourceBook || "");
    setTags(item.tags);
    setTagInput("");
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setWord("");
    setGrammaticalClass("");
    setMeaning("");
    setContextExample("");
    setSourceBook("");
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


  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        const q = query.trim().toLowerCase();
        if (
          q &&
          !`${e.word} ${e.meaning} ${e.contextExample || ""} ${e.tags.join(" ")}`
            .toLowerCase()
            .includes(q)
        ) {
          return false;
        }
        if (
          selectedLetter &&
          e.word[0]?.toUpperCase() !== selectedLetter.toUpperCase()
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.word.localeCompare(b.word, "pt-BR"));
  }, [entries, query, selectedLetter]);

  const availableLetters = useMemo(() => {
    const set = new Set(
      entries.map((e) => e.word[0]?.toUpperCase()).filter(Boolean)
    );
    return set;
  }, [entries]);

  return {
    handleDelete,
    loadEntries,
    entries,
    isLoading,
    filteredEntries,
    query,
    setQuery,
    selectedLetter,
    setSelectedLetter,
    isModalOpen,
    setIsModalOpen,
    editingEntry,
    setEditingEntry,
    word,
    setWord,
    grammaticalClass,
    setGrammaticalClass,
    meaning,
    setMeaning,
    contextExample,
    setContextExample,
    sourceBook,
    setSourceBook,
    tagInput,
    setTagInput,
    tags,
    setTags,
    addTag,
    removeTag,
    handleSave,
    openNew,
    openEdit,
    closeModal,
    isSubmitting,
    availableLetters
    }
}