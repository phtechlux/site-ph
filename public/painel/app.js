const { createClient } = SupabaseLib;

// Chave pública (protegida por Row Level Security no banco — só quem faz
// login como admin consegue ler/editar; ver backend/schema.sql).
const SUPABASE_URL = "https://pjibmisaghwlrczwxdem.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Z6IL7eMWCyc7IwfvacjJjw_s7l8DTth";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STAGES = [
  { key: "novo", label: "Novo" },
  { key: "enviado", label: "Mensagem enviada" },
  { key: "respondeu", label: "Respondeu" },
  { key: "fechado", label: "Fechado" },
  { key: "arquivado", label: "Arquivado" }
];

const ICONS = {
  piscina: '<circle cx="7" cy="12" r="6"/><path d="M2 12h10M7 6v12"/>',
  veiculo: '<rect x="2" y="8" width="12" height="7" rx="1.5"/><circle cx="5" cy="15" r="1.5"/><circle cx="11" cy="15" r="1.5"/>',
  beleza: '<path d="M8 2c2 3 5 4 5 8a5 5 0 0 1-10 0c0-4 3-5 5-8Z"/>',
  terapia: '<circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/>',
  lavanderia: '<rect x="2" y="2" width="12" height="12" rx="1.5"/><circle cx="8" cy="9" r="3.4"/><circle cx="4.3" cy="4.3" r="0.6"/>',
  planta: '<path d="M8 14V6"/><path d="M8 6C8 3 5 2 3 2c0 3 2 5 5 4Z"/><path d="M8 8c0-3 3-4 5-4 0 3-2 5-5 4Z"/>',
  tech: '<rect x="3" y="3" width="10" height="10" rx="1.5"/><path d="M6 3V1M10 3V1M6 15v-2M10 15v-2M3 6H1M3 10H1M15 6h-2M15 10h-2"/>',
  juridico: '<path d="M8 2v12M4 14h8"/><path d="M8 4 3 6l2.4 5a3 3 0 0 0 5.2 0L13 6Z"/>',
  geral: '<circle cx="8" cy="8" r="6"/>'
};

function pickIcon(categoria) {
  const c = (categoria || "").toLowerCase();
  if (c.indexOf("pisc") > -1) return ICONS.piscina;
  if (c.indexOf("veic") > -1 || c.indexOf("placa") > -1) return ICONS.veiculo;
  if (c.indexOf("beleza") > -1 || c.indexOf("frete") > -1 || c.indexOf("móve") > -1 || c.indexOf("move") > -1) return ICONS.beleza;
  if (c.indexOf("terap") > -1) return ICONS.terapia;
  if (c.indexOf("lavand") > -1) return ICONS.lavanderia;
  if (c.indexOf("muda") > -1 || c.indexOf("plant") > -1) return ICONS.planta;
  if (c.indexOf("inform") > -1 || c.indexOf("tech") > -1) return ICONS.tech;
  if (c.indexOf("jurí") > -1 || c.indexOf("juri") > -1 || c.indexOf("direito") > -1) return ICONS.juridico;
  return ICONS.geral;
}

const els = {
  loadingScreen: document.getElementById("loading-screen"),
  loginScreen: document.getElementById("login-screen"),
  loginForm: document.getElementById("login-form"),
  loginErroBox: document.getElementById("login-erro-box"),
  loginBtn: document.getElementById("login-btn"),
  appWrap: document.getElementById("app-wrap"),
  btnLogout: document.getElementById("btn-logout"),
  board: document.getElementById("board"),
  stats: document.getElementById("stats"),
  search: document.getElementById("search"),
  btnNew: document.getElementById("btn-new"),
  btnExport: document.getElementById("btn-export"),
  detailBackdrop: document.getElementById("detail-backdrop"),
  detailModal: document.getElementById("detail-modal"),
  newBackdrop: document.getElementById("new-backdrop"),
  newForm: document.getElementById("new-form"),
  toast: document.getElementById("toast")
};

let leads = [];

function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function daysAgo(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "hoje";
  if (diff === 1) return "há 1 dia";
  return "há " + diff + " dias";
}

function contatoUrl(lead) {
  const contato = String(lead.contato || "");
  if (lead.contato_tipo === "instagram") {
    // Quem manda o formulário controla esse texto. Só passa o que um @ do
    // Instagram aceita: letras, números, ponto e underline.
    return "https://instagram.com/" + contato.replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, "");
  }
  return "https://wa.me/" + contato.replace(/\D/g, "");
}

function contatoLabel(lead) {
  return lead.contato_tipo === "instagram" ? "@" + lead.contato.replace(/^@/, "") : lead.contato;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function matchesFilter(lead, q) {
  if (!q) return true;
  q = q.toLowerCase();
  return (lead.nome + " " + (lead.categoria || "")).toLowerCase().indexOf(q) > -1;
}

function renderStats() {
  const total = leads.length;
  const fechado = leads.filter((l) => l.status === "fechado").length;
  const respondeu = leads.filter((l) => l.status === "respondeu").length;
  const taxa = total ? Math.round(((respondeu + fechado) / total) * 100) : 0;

  els.stats.innerHTML = stat(total, "leads") + stat(fechado, "fechados") + stat(taxa + "%", "resposta");
}

function stat(num, lbl) {
  return `<div class="stat"><span class="num">${num}</span><span class="lbl">${lbl}</span></div>`;
}

function renderBoard() {
  const q = els.search.value.trim();
  els.board.innerHTML = "";

  STAGES.forEach((stage) => {
    const col = document.createElement("div");
    col.className = "col";
    col.setAttribute("data-stage", stage.key);

    const inStage = leads.filter((l) => l.status === stage.key && matchesFilter(l, q));

    col.innerHTML =
      `<div class="col-head"><span class="name">${stage.label}</span><span class="count">${inStage.length}</span></div>` +
      `<div class="col-body" data-body></div>`;

    const body = col.querySelector("[data-body]");
    if (!inStage.length) {
      const hint = document.createElement("div");
      hint.className = "empty-hint";
      hint.textContent = "nenhum lead aqui";
      body.appendChild(hint);
    } else {
      inStage.forEach((lead) => body.appendChild(renderCard(lead)));
    }

    els.board.appendChild(col);
  });
}

function renderCard(lead) {
  const card = document.createElement("div");
  card.className = "card";
  card.tabIndex = 0;

  const select = STAGES.map(
    (s) => `<option value="${s.key}"${s.key === lead.status ? " selected" : ""}>${s.label}</option>`
  ).join("");

  const resumoTexto = lead.resumo || lead.descricao || lead.objetivo || "";
  const origemLabel = lead.origem === "site" ? "SITE" : "MANUAL";

  card.innerHTML =
    `<div class="card-top">` +
    `<div class="card-icon"><svg viewBox="0 0 16 16" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${pickIcon(lead.categoria || lead.tipo_projeto)}</svg></div>` +
    `<div><div class="card-name">${escapeHtml(lead.nome)}</div><div class="card-cat"><span>${escapeHtml(lead.categoria || lead.tipo_projeto || "")}</span><span class="origin-tag">${origemLabel}</span></div></div>` +
    `</div>` +
    `<div class="card-resumo">${escapeHtml(resumoTexto)}</div>` +
    `<div class="card-foot">` +
    `<span class="card-days">${daysAgo(lead.criado_em)}</span>` +
    `<select data-status-select>${select}</select>` +
    `</div>`;

  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-status-select]")) return;
    openDetail(lead.id);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openDetail(lead.id);
  });

  const sel = card.querySelector("[data-status-select]");
  sel.addEventListener("click", (e) => e.stopPropagation());
  sel.addEventListener("change", async (e) => {
    const novoStatus = e.target.value;
    await updateLead(lead.id, { status: novoStatus });
    toast(lead.nome + " → " + STAGES.find((s) => s.key === novoStatus).label);
  });

  return card;
}

async function updateLead(id, patch) {
  const { error } = await supabase.from("leads").update(patch).eq("id", id);
  if (error) {
    console.error(error);
    toast("Não consegui salvar — tenta de novo");
    return;
  }
  leads = leads.map((l) => (l.id === id ? Object.assign({}, l, patch) : l));
  renderAll();
}

async function removeLead(id) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) {
    console.error(error);
    toast("Não consegui excluir — tenta de novo");
    return;
  }
  leads = leads.filter((l) => l.id !== id);
  renderAll();
}

function openDetail(id) {
  const lead = leads.find((l) => l.id === id);
  if (!lead) return;

  const stageOptions = STAGES.map(
    (s) => `<option value="${s.key}"${s.key === lead.status ? " selected" : ""}>${s.label}</option>`
  ).join("");

  const campoSeExistir = (label, valor) =>
    valor ? `<label class="field-label">${label}</label><div class="msg-box">${escapeHtml(valor)}</div>` : "";

  els.detailModal.innerHTML =
    `<div class="modal-head">` +
    `<div><h2>${escapeHtml(lead.nome)}</h2><p class="cat">${escapeHtml(lead.categoria || lead.tipo_projeto || "")} · ${lead.origem === "site" ? "veio pelo site" : "cadastro manual"}</p></div>` +
    `<button class="x-close" data-close-detail aria-label="Fechar">&times;</button>` +
    `</div>` +
    `<span class="status-pill" data-s="${escapeHtml(lead.status)}">${STAGES.find((s) => s.key === lead.status).label}</span>` +
    `<label class="field-label">Contato</label>` +
    `<div><a href="${escapeHtml(contatoUrl(lead))}" target="_blank" rel="noopener noreferrer">${escapeHtml(contatoLabel(lead))} ↗</a></div>` +
    campoSeExistir("Empresa", lead.empresa) +
    campoSeExistir("Resumo", lead.resumo) +
    campoSeExistir("Objetivo", lead.objetivo) +
    campoSeExistir("Orçamento", lead.orcamento) +
    campoSeExistir("Descrição", lead.nao_sei_o_que_precisa ? "(não sabia exatamente o que precisava) " + (lead.descricao || "") : lead.descricao) +
    campoSeExistir("Mensagem enviada", lead.mensagem_enviada) +
    `<label class="field-label" for="d-notas">Notas</label>` +
    `<textarea id="d-notas" rows="3">${escapeHtml(lead.notas || "")}</textarea>` +
    `<div class="modal-actions">` +
    `<button class="btn danger small" data-delete>Excluir lead</button>` +
    `<div style="display:flex; gap:8px; align-items:center;">` +
    `<select data-stage-select>${stageOptions}</select>` +
    `</div>` +
    `</div>`;

  els.detailModal.querySelector("[data-close-detail]").addEventListener("click", closeDetail);
  els.detailModal.querySelector("#d-notas").addEventListener("blur", (e) => {
    if (e.target.value !== (lead.notas || "")) updateLead(lead.id, { notas: e.target.value });
  });
  els.detailModal.querySelector("[data-stage-select]").addEventListener("change", async (e) => {
    await updateLead(lead.id, { status: e.target.value });
    closeDetail();
  });
  els.detailModal.querySelector("[data-delete]").addEventListener("click", async () => {
    if (confirm("Excluir " + lead.nome + " do painel?")) {
      await removeLead(lead.id);
      closeDetail();
      toast("Lead excluído");
    }
  });

  els.detailBackdrop.hidden = false;
}

function closeDetail() { els.detailBackdrop.hidden = true; }

els.detailBackdrop.addEventListener("click", (e) => {
  if (e.target === els.detailBackdrop) closeDetail();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeDetail(); closeNew(); }
});

function openNew() { els.newBackdrop.hidden = false; document.getElementById("f-nome").focus(); }
function closeNew() { els.newBackdrop.hidden = true; els.newForm.reset(); }

els.btnNew.addEventListener("click", openNew);
els.newBackdrop.addEventListener("click", (e) => {
  if (e.target === els.newBackdrop) closeNew();
});
document.querySelectorAll("[data-close-new]").forEach((b) => b.addEventListener("click", closeNew));

els.newForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("f-nome").value.trim();
  if (!nome) return;

  const novo = {
    origem: "manual",
    nome,
    categoria: document.getElementById("f-cat").value.trim(),
    contato_tipo: document.getElementById("f-contato-tipo").value,
    contato: document.getElementById("f-contato-valor").value.trim(),
    resumo: document.getElementById("f-resumo").value.trim(),
    mensagem_enviada: document.getElementById("f-msg").value.trim(),
    status: "enviado"
  };

  const { data, error } = await supabase.from("leads").insert([novo]).select().single();
  if (error) {
    console.error(error);
    toast("Não consegui adicionar — tenta de novo");
    return;
  }

  leads.unshift(data);
  renderAll();
  closeNew();
  toast(nome + " adicionado");
});

els.search.addEventListener("input", renderBoard);

els.btnExport.addEventListener("click", async () => {
  const data = JSON.stringify(leads, null, 2);
  const filename = "pipeline-leads-" + new Date().toISOString().slice(0, 10) + ".json";
  try {
    const downloads = window.claude && typeof window.claude.use === "function" ? await window.claude.use("downloads") : null;
    if (downloads) {
      await downloads.save({ filename, data });
      toast("Backup exportado");
      return;
    }
  } catch (e) {}
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("Backup baixado");
});

async function carregarLeads() {
  const { data, error } = await supabase.from("leads").select("*").order("criado_em", { ascending: false });
  if (error) {
    console.error(error);
    toast("Não consegui carregar os leads");
    return;
  }
  leads = data || [];
  renderAll();
}

function renderAll() { renderStats(); renderBoard(); }

// ---------- autenticação ----------

function mostrarApp() {
  els.loadingScreen.hidden = true;
  els.loginScreen.hidden = true;
  els.appWrap.hidden = false;
}

function mostrarLogin() {
  els.loadingScreen.hidden = true;
  els.appWrap.hidden = true;
  els.loginScreen.hidden = false;
}

els.loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.loginErroBox.innerHTML = "";
  els.loginBtn.disabled = true;
  els.loginBtn.textContent = "Entrando…";

  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-senha").value;

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      console.error("Erro de login:", error);
      els.loginErroBox.innerHTML = `<div class="login-erro">${escapeHtml(error.message || "E-mail ou senha errados.")}</div>`;
    }
    // Sucesso: o listener onAuthStateChange cuida de trocar de tela.
  } catch (e) {
    console.error("Falha ao tentar logar (provável bloqueio de rede):", e);
    els.loginErroBox.innerHTML =
      `<div class="login-erro">Não consegui falar com o servidor de login. Se você usa bloqueador de anúncios/rastreadores, tenta desativar pra esse site (ou abrir numa janela anônima) e recarregar.</div>`;
  } finally {
    els.loginBtn.disabled = false;
    els.loginBtn.textContent = "Entrar";
  }
});

els.btnLogout.addEventListener("click", async () => {
  await supabase.auth.signOut();
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    mostrarApp();
    carregarLeads();
  } else {
    mostrarLogin();
  }
});

// Checagem inicial — onAuthStateChange já dispara sozinho ao carregar a
// biblioteca, mas isso garante que não fica preso na tela de "carregando".
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    mostrarApp();
    carregarLeads();
  } else {
    mostrarLogin();
  }
});
