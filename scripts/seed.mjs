import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Read .env manually
const envPath = path.resolve(process.cwd(), ".env");
let envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      envVars[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  });
}

const supabaseUrl =
  envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Variáveis de ambiente do Supabase não encontradas no .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INITIAL_BOOKS = [
  {
    title: "Crime e Castigo",
    author: "Fiódor Dostoiévski",
    category: "Literatura",
    subjects: ["culpa", "moral", "redenção", "psicologia"],
    status: "to_read",
    why_read:
      "Quero entender melhor a questão da culpa e da consciência na literatura russa.",
    notes: "Indicação fundamental para estudo do imaginário moral.",
  },
  {
    title: "A República",
    author: "Platão",
    category: "Filosofia",
    subjects: ["justiça", "política", "alma", "conhecimento"],
    status: "reading",
    why_read:
      "Base para entender a teoria das formas e o conceito clássico de virtude.",
    notes: "No Livro II, Glaucon apresenta o mito do anel de Giges.",
    started_at: new Date("2026-08-10").toISOString(),
  },
  {
    title: "O Estrangeiro",
    author: "Albert Camus",
    category: "Literatura",
    subjects: ["absurdo", "existencialismo", "indiferença"],
    status: "finished",
    why_read:
      "Compreender a visão existencialista sobre o absurdo do cotidiano.",
    notes:
      "A indiferença de Meursault confronta a hipocrisia das convenções sociais.",
    started_at: new Date("2026-07-22").toISOString(),
    finished_at: new Date("2026-08-18").toISOString(),
  },
  {
    title: "Os Irmãos Karamázov",
    author: "Fiódor Dostoiévski",
    category: "Literatura",
    subjects: ["fé", "livre-arbítrio", "família", "deus"],
    status: "to_read",
    why_read:
      "Aprofundar a investigação sobre o problema do mal através do Grande Inquisidor.",
    notes: "Clássico supremo da literatura russa.",
  },
  {
    title: "Genealogia da Moral",
    author: "Friedrich Nietzsche",
    category: "Filosofia",
    subjects: ["moral", "ressentimento", "vontade de poder"],
    status: "to_read",
    why_read:
      "Examinar a crítica nietzschiana aos valores ocidentais e cristãos.",
    notes: "Recomendado para contrapor com Dostoiévski.",
  },
];

async function seed() {
  console.log("🌱 Conectando ao Supabase em:", supabaseUrl);
  
  // Check if books table already has data
  const { data: existing, error: countError } = await supabase
    .from("books")
    .select("id")
    .limit(1);

  if (countError) {
    console.error("❌ Erro ao consultar tabela 'books':", countError.message);
    console.log("💡 Certifique-se de que a tabela 'books' foi criada com o SQL fornecido e o RLS permite INSERT.");
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log("ℹ️ A tabela 'books' já contém registros. Inserindo livros iniciais mesmo assim...");
  }

  const { data, error } = await supabase.from("books").insert(INITIAL_BOOKS).select();

  if (error) {
    console.error("❌ Erro ao inserir livros:", error.message);
    process.exit(1);
  }

  console.log(`✅ Sucesso! ${data.length} livros iniciais inseridos no seu banco Supabase com sucesso!`);
}

seed();
