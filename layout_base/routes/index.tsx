import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed — Entrelinhas" },
      {
        name: "description",
        content:
          "Acompanhe leituras, passagens e ideias compartilhadas pelos leitores do Entrelinhas.",
      },
      { property: "og:title", content: "Feed — Entrelinhas" },
      {
        property: "og:description",
        content: "Passagens, notas e círculos de leitura em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Feed,
});

type Post = {
  id: string;
  author: string;
  initials: string;
  role: string;
  time: string;
  text: string;
  quote?: string;
  book?: string;
  likes: number;
  comments: number;
  reposts: number;
};

const CIRCLES = [
  { name: "Ficção brasileira", readers: 128 },
  { name: "Ensaios e ideias", readers: 74 },
  { name: "Leituras lentas", readers: 56 },
  { name: "Poesia em voz baixa", readers: 42 },
];

const POSTS: Post[] = [
  {
    id: "1",
    author: "Luiza Nogueira",
    initials: "LN",
    role: "Leitor · Entrelinhas",
    time: "há 18 min",
    text: "Voltei a uma passagem de A paixão segundo G.H. e fiquei pensando como certos livros não querem ser entendidos de uma vez. Eles pedem convivência.",
    quote: "A vida se me é, e eu não entendo.",
    book: "A paixão segundo G.H. · Clarice Lispector",
    likes: 24,
    comments: 6,
    reposts: 2,
  },
  {
    id: "2",
    author: "Marcos Prado",
    initials: "MP",
    role: "Leitor · Entrelinhas",
    time: "há 2 h",
    text: "Terminei O Estrangeiro. Camus não me convenceu do absurdo — ele me convenceu da indiferença, que é bem mais difícil de encarar.",
    book: "O Estrangeiro · Albert Camus",
    likes: 41,
    comments: 12,
    reposts: 5,
  },
  {
    id: "3",
    author: "Ana Beatriz",
    initials: "AB",
    role: "Leitor · Entrelinhas",
    time: "ontem",
    text: "Comecei A República hoje. A pergunta que abre o livro é simples e continua sem resposta: o que é ser justo quando ninguém está olhando?",
    quote: "A justiça é a virtude da alma.",
    book: "A República · Platão",
    likes: 63,
    comments: 19,
    reposts: 8,
  },
  {
    id: "4",
    author: "Rafael Lima",
    initials: "RL",
    role: "Leitor · Entrelinhas",
    time: "há 2 dias",
    text: "Nietzsche tem esse dom de te deixar irritado e lúcido ao mesmo tempo. Anotei três páginas inteiras hoje.",
    book: "Além do Bem e do Mal · Friedrich Nietzsche",
    likes: 37,
    comments: 9,
    reposts: 3,
  },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tracking-wide text-muted-foreground">
      {initials}
    </div>
  );
}

function Feed() {
  const [draft, setDraft] = useState("");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex gap-3">
          <Avatar initials="AM" />
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="O que você está pensando?"
            className="min-h-[64px] resize-none border-0 border-b border-border/60 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            Visível para leitores
          </span>
          <Button disabled={!draft.trim()}>Publicar</Button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Círculos de leitura</h2>
          <button className="text-sm text-primary hover:underline">Ver todos</button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CIRCLES.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.readers} leitores</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6">
        {POSTS.map((post) => (
          <article
            key={post.id}
            className="rounded-xl border border-border/70 bg-card p-5 shadow-sm"
          >
            <header className="flex items-start gap-3">
              <Avatar initials={post.initials} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold">{post.author}</p>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{post.role}</p>
              </div>
              <button className="text-sm text-primary hover:underline">Seguir</button>
              <button className="text-muted-foreground hover:text-foreground" aria-label="Mais opções">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </header>

            <p className="mt-4 leading-relaxed text-foreground/90">{post.text}</p>

            {post.quote && (
              <blockquote className="mt-4 rounded-md border-l-2 border-primary/60 bg-muted/60 p-4">
                <Quote className="h-4 w-4 text-primary/70" />
                <p className="mt-2 font-display text-lg leading-snug">“{post.quote}”</p>
              </blockquote>
            )}

            {post.book && (
              <div className="mt-4 flex items-center gap-3 rounded-md border border-border/70 px-4 py-3 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="truncate">{post.book}</span>
              </div>
            )}

            <footer className="mt-4 flex items-center gap-6 border-t border-border/60 pt-3 text-sm text-muted-foreground">
              <button className="flex items-center gap-2 transition-colors hover:text-primary">
                <Heart className="h-4 w-4" /> {post.likes}
              </button>
              <button className="flex items-center gap-2 transition-colors hover:text-primary">
                <MessageCircle className="h-4 w-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-2 transition-colors hover:text-primary">
                <Repeat2 className="h-4 w-4" /> {post.reposts}
              </button>
              <button
                className="ml-auto transition-colors hover:text-primary"
                aria-label="Salvar publicação"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
