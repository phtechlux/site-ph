// Vercel Serverless Function — roda no servidor, não no navegador.
// Vercel detecta sozinho qualquer arquivo dentro de api/ e publica ele
// como uma URL: https://phtechlux.vercel.app/api/notify-lead
//
// Fluxo completo:
// 1. Alguém envia o formulário de contato no site
// 2. O navegador grava a linha na tabela `leads` do Supabase (a antiga `solicitacoes` foi substituída)
// 3. O Supabase (configurado como Database Webhook) dispara um POST
//    pra ESSA função, com os dados da linha que acabou de ser criada
// 4. Essa função pega esses dados e manda um e-mail pra você via Resend
//
// Repare que o navegador de quem preenche o formulário NUNCA fala com
// essa função — só o Supabase fala com ela, servidor com servidor. É por
// isso que dá pra guardar aqui a chave da Resend (RESEND_API_KEY) sem medo:
// esse código nunca chega no navegador de ninguém, diferente do que
// acontece com VITE_SUPABASE_ANON_KEY (essa sim vai pro navegador).

import { timingSafeEqual } from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  // Confere um segredo compartilhado antes de fazer qualquer coisa — sem
  // isso, qualquer pessoa na internet que descobrisse essa URL conseguiria
  // te spammar de e-mail chamando ela diretamente. O mesmo valor é
  // configurado como header no webhook do Supabase (ver instruções).
  const segredoRecebido = req.headers["x-webhook-secret"];
  if (!segredoConfere(segredoRecebido, process.env.WEBHOOK_SECRET)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  // Formato que o Supabase manda: { type: "INSERT", table: "...", record: {...} }
  const lead = req.body?.record;
  if (!lead) {
    res.status(400).json({ error: "payload sem 'record'" });
    return;
  }

  const linhas = [
    ["Nome", lead.nome],
    ["Empresa", lead.empresa],
    ["Tipo de projeto", lead.nao_sei_o_que_precisa ? "Não sabe exatamente — descreveu o problema" : lead.tipo_projeto],
    ["Objetivo", lead.objetivo],
    ["Orçamento", lead.orcamento],
    ["Descrição", lead.descricao],
    ["WhatsApp", lead.contato],
  ].filter(([, valor]) => valor);

  const htmlLinhas = linhas
    .map(([rotulo, valor]) => `<p><strong>${rotulo}:</strong> ${escapeHtml(String(valor))}</p>`)
    .join("\n");

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "PH — Site <onboarding@resend.dev>",
      to: [process.env.TO_EMAIL],
      subject: `Novo pedido: ${lead.nome || "sem nome"}`,
      html: `<h2>Novo pedido pelo site da PH</h2>${htmlLinhas}`,
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    console.error("Resend falhou:", resposta.status, detalhe);
    res.status(502).json({ error: "falha ao enviar e-mail" });
    return;
  }

  res.status(200).json({ ok: true });
}

// Compara em tempo constante e recusa se o segredo não estiver configurado.
function segredoConfere(recebido, esperado) {
  if (typeof recebido !== "string" || !esperado) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

function escapeHtml(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
