# PRODUCT_SPEC.md

# Projeto: Biblioteca Pessoal de Leituras

## Objetivo

Construir a primeira funcionalidade do aplicativo: uma biblioteca pessoal para organizar livros.

Nesta primeira etapa, o usuário deve conseguir:

- Adicionar livros
- Editar livros
- Excluir livros
- Pesquisar livros
- Filtrar livros
- Organizar por status de leitura
- Organizar por categoria
- Organizar por assuntos

Não implementar nesta fase:

- Login
- Backend remoto
- IA
- Feed
- Notas
- Publicações
- Recursos sociais

O foco é apenas criar uma excelente biblioteca pessoal.

---

# Conceito principal

O aplicativo deve responder estas perguntas:

- Quais livros quero ler?
- Quais estou lendo?
- Quais já li?
- Quais livros falam sobre determinado tema?
- Quais autores estou estudando?

---

# Modelo de dados

## Entidade: Book

```typescript
type ReadingStatus =
  | "to_read"
  | "reading"
  | "finished"
  | "abandoned";

type Category =
  | "Literatura"
  | "Filosofia"
  | "Psicologia"
  | "História"
  | "Sociologia"
  | "Teologia"
  | "Ciência"
  | "Outro";

interface Book {
  id: string;

  title: string;

  author: string;

  category: Category;

  subjects: string[];

  status: ReadingStatus;

  whyRead?: string;

  notes?: string;

  createdAt: Date;

  updatedAt: Date;

  startedAt?: Date;

  finishedAt?: Date;
}
```

---

# Campos

## title

Título do livro.

Obrigatório.

Exemplo:

```text
Crime e Castigo
```

---

## author

Nome do autor.

Obrigatório.

Exemplo:

```text
Fiódor Dostoiévski
```

---

## category

Área principal.

Valores iniciais:

```text
Literatura
Filosofia
Psicologia
História
Sociologia
Teologia
Ciência
Outro
```

---

## subjects

Lista de temas.

Exemplo:

```text
culpa
moral
liberdade
religião
consciência
```

Um livro pode ter vários assuntos.

---

## status

Valores:

```text
to_read
reading
finished
abandoned
```

---

## whyRead

Campo opcional.

Exemplo:

```text
Quero entender melhor a questão da culpa na literatura russa.
```

---

## notes

Campo opcional.

Não implementar notas avançadas agora.

Apenas um texto simples.

---

# Persistência

Usar armazenamento local.

Pode ser:

- SQLite
- Realm
- IndexedDB
- Local Storage
- Outra solução adequada à stack

A persistência deve sobreviver ao fechamento do aplicativo.

---

# Arquitetura

```text
UI
↓
State
↓
Repository
↓
Storage
```

Criar:

```text
BookRepository
```

Métodos:

```typescript
createBook()

getBooks()

getBookById()

updateBook()

deleteBook()

searchBooks()

filterBooks()
```

---

# Telas

## Tela 1 — Biblioteca

Tela principal.

Estrutura:

```text
Biblioteca

[Buscar...]

Todos | Quero Ler | Lendo | Lidos

+ Novo Livro

-------------------
Crime e Castigo
Dostoiévski

Literatura

culpa • moral

Quero Ler
-------------------
```

---

# Card do livro

Cada card deve mostrar:

- título
- autor
- categoria
- assuntos
- status

---

# Filtros

Filtros iniciais:

## Status

```text
Todos
Quero Ler
Lendo
Lidos
Abandonados
```

---

## Categoria

```text
Literatura
Filosofia
Psicologia
História
Sociologia
Teologia
Ciência
Outro
```

---

# Busca

Buscar por:

- título
- autor
- assuntos

Exemplo:

Pesquisar:

```text
culpa
```

Resultado:

```text
Crime e Castigo
Os Irmãos Karamázov
Genealogia da Moral
```

---

# Tela: Novo Livro

Campos:

```text
Título *
Autor *

Categoria *

Assuntos
[ adicionar tags ]

Status

Por que quero ler? (opcional)

Observações (opcional)

Salvar
```

---

# Validação

Obrigatórios:

- título
- autor
- categoria
- status

Assuntos podem ficar vazios.

---

# Tela: Detalhes do Livro

Mostrar:

```text
Título

Autor

Categoria

Assuntos

Status

Por que quero ler

Observações

Data de criação

Editar

Excluir
```

---

# Exclusão

Antes de excluir:

```text
Excluir livro?

Essa ação não poderá ser desfeita.
```

---

# Estado vazio

Se não houver livros:

```text
Sua biblioteca está vazia.

Adicione seu primeiro livro.
```

---

# Ordem de implementação

## Etapa 1

Criar estrutura do projeto.

Telas:

- Biblioteca
- Novo Livro
- Detalhes

---

## Etapa 2

Criar entidade:

```text
Book
```

---

## Etapa 3

Criar:

```text
BookRepository
```

---

## Etapa 4

Implementar persistência local.

---

## Etapa 5

Criar cadastro de livros.

---

## Etapa 6

Criar listagem.

---

## Etapa 7

Criar filtros.

---

## Etapa 8

Criar busca.

---

## Etapa 9

Criar edição.

---

## Etapa 10

Criar exclusão.

---

# Critérios de conclusão

O usuário deve conseguir:

✅ Adicionar livro

✅ Editar livro

✅ Excluir livro

✅ Buscar livro

✅ Filtrar livro

✅ Organizar por status

✅ Organizar por categoria

✅ Salvar localmente

✅ Fechar e abrir o aplicativo sem perder dados

---

