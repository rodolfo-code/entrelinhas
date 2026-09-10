"use client";

import { useState } from "react";
import {
  BookOpen,
  Globe,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Quote,
  Repeat2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import { INITIAL_POSTS } from "./posts";


function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-xs tracking-wider text-muted-foreground border border-border/60">
      {initials}
    </div>
  );
}

export function FeedView() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [draft, setDraft] = useState("");
  const [quoteDraft, setQuoteDraft] = useState("");
  const [bookDraft, setBookDraft] = useState("");
  const [showExtras, setShowExtras] = useState(false);

  const handlePublish = () => {
    if (!draft.trim()) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: "Você",
      initials: "VC",
      role: "Leitor · Entrelinhas",
      time: "agora mesmo",
      text: draft.trim(),
      quote: quoteDraft.trim() || undefined,
      book: bookDraft.trim() || undefined,
      likes: 0,
      comments: 0,
      reposts: 0,
      isLiked: false,
      isSaved: false,
    };

    setPosts([newPost, ...posts]);
    setDraft("");
    setQuoteDraft("");
    setBookDraft("");
    setShowExtras(false);
  };

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const toggleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {/* Create Post Section */}
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
        <div className="flex gap-3.5">
          <Avatar initials="EU" />
          <div className="flex-1 space-y-3">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="O que você está pensando ou lendo hoje?"
              className="min-h-[72px] resize-none border-0 border-b border-border/60 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
            />

            {showExtras && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <input
                  type="text"
                  value={quoteDraft}
                  onChange={(e) => setQuoteDraft(e.target.value)}
                  placeholder="Citação ou trecho destacado (opcional)..."
                  className="w-full text-xs rounded-md border border-border/70 bg-secondary/30 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <input
                  type="text"
                  value={bookDraft}
                  onChange={(e) => setBookDraft(e.target.value)}
                  placeholder="Obra e autor referenciado (ex: Dom Casmurro · Machado de Assis)..."
                  className="w-full text-xs rounded-md border border-border/70 bg-secondary/30 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              Visível para leitores
            </span>
            <button
              type="button"
              onClick={() => setShowExtras(!showExtras)}
              className="text-xs text-primary/80 hover:text-primary transition-colors cursor-pointer"
            >
              {showExtras ? "Ocultar campos extras" : "+ Citação / Livro"}
            </button>
          </div>

          <Button
            onClick={handlePublish}
            disabled={!draft.trim()}
            className="rounded-full px-5"
          >
            Publicar
          </Button>
        </div>
      </section>


      {/* Posts List */}
      <div className="space-y-5">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-colors"
          >
            <header className="flex items-start gap-3">
              <Avatar initials={post.initials} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-sm text-foreground">
                    {post.author}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {post.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{post.role}</p>
              </div>
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Seguir
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-sm"
                aria-label="Mais opções"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </header>

            <p className="mt-4 leading-relaxed text-sm text-foreground/90 whitespace-pre-wrap">
              {post.text}
            </p>

            {post.quote && (
              <blockquote className="mt-4 rounded-xl border-l-2 border-primary/70 bg-secondary/50 p-4">
                <Quote className="h-4 w-4 text-primary/70 mb-1" />
                <p className="font-display text-base italic leading-snug text-foreground">
                  “{post.quote}”
                </p>
              </blockquote>
            )}

            {post.book && (
              <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-border/60 bg-secondary/30 px-3.5 py-2 text-xs text-foreground/80">
                <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate font-medium">{post.book}</span>
              </div>
            )}

            <footer className="mt-4 flex items-center gap-6 border-t border-border/50 pt-3 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors cursor-pointer",
                  post.isLiked
                    ? "text-red-500 font-semibold"
                    : "hover:text-foreground"
                )}
              >
                <Heart
                  className={cn("h-4 w-4", post.isLiked && "fill-current")}
                />{" "}
                {post.likes}
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer"
              >
                <Repeat2 className="h-4 w-4" /> {post.reposts}
              </button>

              <button
                type="button"
                onClick={() => toggleBookmark(post.id)}
                className={cn(
                  "ml-auto transition-colors cursor-pointer",
                  post.isSaved
                    ? "text-primary font-semibold"
                    : "hover:text-foreground"
                )}
                aria-label="Salvar publicação"
              >
                <Bookmark
                  className={cn("h-4 w-4", post.isSaved && "fill-current")}
                />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
