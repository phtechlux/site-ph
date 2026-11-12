import { createClient } from "@supabase/supabase-js";

// Essas duas variáveis vêm do painel do Supabase (Project Settings > API).
// A "anon key" é pública de propósito — ela só consegue fazer o que as
// policies de RLS permitirem (ver backend/schema.sql). Ainda assim, não
// commita o .env.local: são as credenciais do TEU projeto Supabase.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sem as duas variáveis, createClient() lança exceção e derruba o app
// inteiro (React nem chega a renderizar). Em vez disso, deixamos o resto
// do site funcionar normalmente e só desligamos o que depende do banco —
// quem usa supabase importado daqui precisa checar se veio null.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  // Erro claro em vez de a página simplesmente não funcionar — ajuda a
  // debugar quando esquece de criar o .env.local.
  console.error(
    "Faltam as variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Copia .env.example pra .env.local e preenche com os dados do teu projeto Supabase. " +
      "O site funciona normalmente, mas o formulário de contato não vai conseguir enviar."
  );
}
