"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LibraryView } from "@/components/library/LibraryView";
import { ReadingStatus } from "@/types/book";

function LibraryContent() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as ReadingStatus | null;

  let title = "Biblioteca";
  let description = "Organize suas leituras, intenções de estudo e temas de formação.";

  if (statusParam === "to_read") {
    title = "Quero Ler";
    description = "Livros na sua lista de espera com a intenção e contexto de cada estudo.";
  } else if (statusParam === "reading") {
    title = "Leituras em Andamento";
    description = "Livros que você está lendo e acompanhando no momento.";
  } else if (statusParam === "finished") {
    title = "Livros Lidos";
    description = "Acervo de obras concluídas e incorporadas à sua formação.";
  } else if (statusParam === "abandoned") {
    title = "Livros Abandonados / Pausados";
    description = "Leituras interrompidas ou que não atenderam às expectativas no momento.";
  }

  return (
    <LibraryView
      title={title}
      description={description}
      fixedStatus={statusParam || undefined}
    />
  );
}

export default function BibliotecaPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Carregando biblioteca...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
