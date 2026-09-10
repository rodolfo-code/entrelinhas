# Especificação Técnica e Funcional (SPEC.md)

## 1. Visão do Produto

O **Literature & Intellectual Formation App** é uma plataforma que vai além de um rastreador de leituras convencional. Trata-se de um **segundo cérebro para formação humanística e filosófica**, integrando acervo bibliográfico, anotações de leitura, pensamentos do dia a dia, reflexões aprofundadas e conexões conceituais.

---

## 2. Entidades Centrais do Domínio

### 2.1 Livro (`Book`)
- **Identificação**: ID, Título, Subtítulo, Autor(es), Ano de Publicação, Edição/Editora, ISBN/Capa.
- **Classificação**: Áreas do conhecimento / Assuntos (ex: Literatura, Filosofia, Psicologia, Teoria Literária, História), Tags personalizadas.
- **Status de Leitura**: `QUERO_LER` (Fila/Wishlist), `LENDO` (Em andamento), `LIDO` (Concluído), `PAUSADO`, `ABANDONADO`.
- **Contexto de Adição**: Campo crucial para responder *"Por que este livro foi adicionado?"* (Recomendação de quem, citação de outro autor, intuito de estudo específico).
- **Avaliação & Impacto**: Nota pessoal, impacto no imaginário / formação pessoal.

### 2.2 Registro de Leitura & Anotações (`ReadingLog` & `Notes`)
- **Sessões de Leitura**: Data, páginas lidas, tempo dedicado.
- **Notas de Livro**:
  - Trechos / Citações com número de página/capítulo.
  - Comentários imediatos de leitura.

### 2.3 Pensamentos & Lampejos Efêmeros (`FleetingThoughts`)
- **Captura Rápida**: Interface simplificada para registrar ideias instantâneas que surgem ao longo do dia, com atalho rápido.
- **Status de Processamento**: `BRUTO` (não processado) -> `REVISADO` -> `CONVERTIDO_EM_REFLEXAO` / `VINCULADO_A_LIVRO`.

### 2.4 Reflexões & Ensaios Pessoais (`Reflections`)
- **Conteúdo**: Textos mais elaborados sintetizando ideias, confrontando teses ou consolidando aprendizados.
- **Vínculos**: Associado a 1 ou mais livros, 1 ou mais autores, tags e temas transversais.

### 2.5 Perguntas & Questões Abertas (`Inquiries` / `OpenQuestions`)
- **Objetivo**: Registrar dúvidas filosóficas, existenciais ou literárias que motivam novas buscas e futuras leituras.
- **Evolução**: Pode apontar para livros sugeridos para responder à pergunta.

### 2.6 Grafo de Conexões / Relações (`KnowledgeGraph` / `CrossLinks`)
- Conexões explícitas: `Livro A -> cita/influencia -> Livro B`, `Reflexão X -> responde a -> Pergunta Y`, `Ideia Z -> conecta -> Livro C`.

---

## 3. Principais Módulos & Funcionalidades

1. **Dashboard / Visão Panorâmica da Formação**
   - Resumo das leituras ativas e metas qualitativas.
   - Caixa de entrada rápida para pensamentos efêmeros ("Quick Capture").
   - "Lampejo do Passado": Destaque de reflexões e notas antigas para revisitá-las aleatoriamente ou por repetição espaçada.

2. **Biblioteca & Gestão de Livros**
   - Catálogo com filtros por assunto, status, autor e tags.
   - Visualização em lista detalhada ou estante visual.
   - Registro de motivação de leitura na adição.

3. **Caderno de Leitura & Estudo**
   - Página dedicada para cada livro contendo resumo, anotações de páginas, citações destacadas e reflexões vinculadas.

4. **Caderno de Reflexões & Perguntas Abertas**
   - Editor focado em escrita sem distrações (Markdown / Rich Text).
   - Sistema de perguntas abertas que guiam próximas leituras.

5. **Trilha & Grafo Intelectual**
   - Visualização da evolução temporal (Timeline da Formação).
   - Mapa mental / grafo de conexões entre autores, livros e conceitos.

---

## 4. Arquitetura Técnica

- **Framework**: Next.js (App Router, React 19 / Server Components + Client Components interativos)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS com tema estético sofisticado (paleta editorial/acadêmica contemporânea, suporte a Dark Mode, tipografia serifada/sans harmoniosa)
- **Persistência / Dados**:
  - Camada de abstração de repositório (inicialmente LocalStorage / IndexedDB / Mock Database com facilidade de migração para SQLite/PostgreSQL/Prisma/Supabase).
- **Ícones & UI**: Lucide Icons, componentes acessíveis e elegantes.
