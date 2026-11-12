# PH Tecnologia - site

Site da PH, no ar em https://phtechlux.vercel.app

- React + Vite
- Formulario de contato grava no Supabase (Postgres com RLS)
- `api/notify-lead.js`: funcao serverless da Vercel que avisa por e-mail (Resend) quando chega pedido novo
- `public/painel.html`: area administrativa com login (Supabase Auth)

## Rodar local

Criar um `.env.local` (nao vai pro git) com:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=anon-public-key
```

```bash
npm install
npm run dev
```

As chaves da funcao de e-mail (`RESEND_API_KEY`, `TO_EMAIL`, `WEBHOOK_SECRET`) ficam so nas variaveis de ambiente da Vercel, nunca no codigo.
