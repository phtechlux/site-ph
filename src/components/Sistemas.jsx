// Demos de OS, locação e terceirização com WhatsApp. Tudo local, sem backend,
// e sempre com dados fictícios (selo "PRÉVIA · DADOS DE EXEMPLO").
import { useState } from "react";
import { FadeUp } from "../motion/system";
import { SectionHead as OsSectionHead, BrowserMock as OsMock, GradientText as OsGradient, MonoTag as OsTag, Badge as OsBadge } from "./ui";

// Recriação das demos em prospeccao/produtos/demo-*.html — dados fictícios (selo "exemplo").
const osHoje = new Date();
const osDia = (n) => { const x = new Date(osHoje); x.setDate(x.getDate() + n); return x; };
const osBr = (x) => x.toLocaleDateString("pt-BR");
const OS_NOME = "Empresa";

function OsChip({ tone, children }) { return <span className={"kit-os-tag" + (tone ? " " + tone : "")}>{children}</span>; }
function OsKpis({ items }) { return <div className="kit-os-kpis">{items.map(([a, b]) => <div key={a} className="kit-os-kpi"><small>{a}</small><b>{b}</b></div>)}</div>; }
function OsHead({ t, sub }) { return <><h3>{t}</h3><p className="kit-os-sub">{sub}</p></>; }
function OsTable({ head, rows, num = [] }) {
  return (
    <div className="kit-os-card" style={{ overflowX: "auto" }}><table>
      <thead><tr>{head.map((h, i) => <th key={h} className={num.includes(i) ? "n" : undefined}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, k) => <tr key={k}>{r.map((c, i) => <td key={i} className={num.includes(i) ? "n" : undefined}>{c}</td>)}</tr>)}</tbody>
    </table></div>
  );
}
function OsItem({ title, tag, tone, falta, children }) {
  return <div className={"kit-os-item" + (falta ? " falta" : "")}><div className="h"><span>{title}</span>{tag && <OsChip tone={tone}>{tag}</OsChip>}</div>{children && <p>{children}</p>}</div>;
}

/* ---------- Terceirização ---------- */
const TER_C = ["Condomínio Exemplo I", "Condomínio Exemplo II", "Condomínio Exemplo III", "Edifício Comercial Exemplo", "Residencial Exemplo"];
const TER_S = ["Limpeza", "Conservação", "Portaria"];
const OS_TER = {
  telas: [["hoje", "Postos hoje"], ["falta", "Falta e cobertura"], ["check", "Checklist com foto"], ["ocorr", "Ocorrências"], ["rel", "Relatório do síndico"]],
  render: (tela, st, set) => {
    if (tela === "hoje") {
      const s4 = [["ok", "entrada 06:58"], ["ok", "entrada 07:02"], ["warn", "entrada 07:21 · atraso"], ["ok", "entrada 06:55"]];
      return <><OsHead t="Postos hoje" sub={osBr(osHoje) + " · 5 contratos · Brasília"} />
        <OsKpis items={[["Postos cobertos", "18 de 19"], ["Falta hoje", 1], ["Checklists enviados", 14], ["Ocorrências abertas", 3]]} />
        <div className="kit-os-cols">{TER_C.slice(0, 3).map((c, i) => <div key={c} className="kit-os-card"><b>{c}</b>{[0, 1, 2].map((j) => { const falta = i === 1 && j === 2; const s = s4[(i + j) % 4];
          return <OsItem key={j} falta={falta} title={"Colaborador(a) " + (i * 3 + j + 1)} tag={falta ? "falta avisada 05:40" : s[1]} tone={falta ? "bad" : s[0]}>{TER_S[(i + j) % 3]} · {["Bloco A", "Bloco B", "Área comum"][j]}</OsItem>; })}</div>)}</div></>;
    }
    if (tela === "falta") {
      return <><OsHead t="Falta e cobertura" sub="A colaboradora avisa a falta e o sistema já mostra quem da folga está mais perto." />
        <div className="kit-os-card">
          <OsItem falta title={TER_C[1] + " · Área comum"} tag="falta avisada 05:40" tone="bad">Colaborador(a) 6 avisou pelo WhatsApp: consulta médica. Turno 07:00 às 16:00.</OsItem>
          <p style={{ margin: "12px 0 0", fontWeight: 600 }}>Folguistas mais perto</p>
          <OsItem title="Folguista 2" tag="disponível · 4 km" tone="ok">Já cobriu esse posto 3 vezes · conhece o condomínio</OsItem>
          <OsItem title="Folguista 5" tag="disponível · 9 km">Última cobertura: {osBr(osDia(-12))}</OsItem>
        </div>
        {st.coberto ? <div className="kit-os-card"><OsItem title={TER_C[1] + " · Área comum"} tag="coberto · Folguista 2" tone="ok">Chega 07:15. Aviso enviado pro zelador.</OsItem></div>
          : <button className="kit-os-btn" onClick={() => set({ coberto: true })}>Escalar cobertura</button>}</>;
    }
    if (tela === "check") {
      const areas = [["Hall de entrada e portaria", "07:24"], ["Elevadores (2)", "07:51"], ["Escadas do 1º ao 8º andar", "08:40"], ["Lixeiras e coleta seletiva", "09:12"], ["Garagem · varrição", "10:05"], ["Salão de festas", ""]];
      return <><OsHead t="Checklist com foto" sub="A colaboradora marca cada área no celular e tira a foto. A supervisão vê tudo em tempo real, sem precisar passar no condomínio." />
        <div className="kit-os-card"><b>{TER_C[0]} · Bloco A · turno da manhã</b>
          {areas.map(([a, h]) => <div key={a} className={"kit-os-chk" + (h ? "" : " pend")}><i>{h && <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}</i><span>{a}</span>{h ? <><div className="kit-os-foto">foto</div><small>{h}</small></> : <small>pendente</small>}</div>)}
        </div>
        <button className="kit-os-btn" disabled={st.resumo} onClick={() => set({ resumo: true })}>Enviar resumo pro síndico</button></>;
    }
    if (tela === "ocorr") {
      const oc = [["Lâmpada queimada na garagem G2", "zelador", "Supervisão", ["warn", "em andamento"]], ["Limpeza extra depois da mudança · apto 304", "síndico", "Colaborador(a) 2", ["ok", "resolvida"]], ["Vidro da portaria com mancha", "morador", "Colaborador(a) 1", ["ok", "resolvida"]], ["Reposição de material de limpeza", "colaboradora", "Supervisão", ["", "aberta · prazo amanhã"]], ["Vazamento no banheiro do salão", "zelador", "Manutenção", ["bad", "atrasada 1 dia"]]];
      return <><OsHead t="Ocorrências" sub="Síndico ou zelador abre pelo WhatsApp, cai aqui com prazo e responsável. Nada se perde no grupo." />
        <OsTable head={["Condomínio", "Ocorrência", "Aberta", "Responsável", "Situação"]} rows={oc.map((o, i) => [TER_C[i], o[0], "pelo " + o[1] + " · " + osBr(osDia(-i)), o[2], <OsChip key="st" tone={o[3][0]}>{o[3][1]}</OsChip>])} /></>;
    }
    const cond = st.cond || TER_C[0];
    const mes = osHoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return <><OsHead t="Relatório do mês pro síndico" sub="Presença, checklists e ocorrências do condomínio num PDF só. É o que o síndico leva pra assembleia." />
      <div className="kit-os-card"><div className="kit-os-grid2" style={{ gridTemplateColumns: "1fr", marginBottom: 10 }}><label>Condomínio<select value={cond} onChange={(e) => set({ cond: e.target.value, rel: false })}>{TER_C.map((c) => <option key={c}>{c}</option>)}</select></label></div>
        <button className="kit-os-btn" onClick={() => set({ cond, rel: true })}>Gerar relatório do mês</button></div>
      {st.rel && <div className="kit-os-cert"><h5>Relatório mensal de serviços</h5><p className="kit-os-sub" style={{ margin: "2px 0 10px" }}>{OS_NOME} · {cond} · {mes}</p>
        {[["Dias de serviço", "26 de 26"], ["Presença dos postos", "98,7% (1 falta, coberta em 35 min)"], ["Checklists com foto", "412"], ["Ocorrências abertas pelo condomínio", "9"], ["Resolvidas no prazo", "8 de 9"], ["Visitas da supervisão", "6"], ["Material de limpeza reposto", "3 vezes"]].map(([a, b]) => <div key={a} className="lin"><span>{a}</span><b>{b}</b></div>)}</div>}</>;
  },
  msgs: (tela, st) => [
    st.coberto && { txt: "Bom dia! Aqui é da supervisão da " + OS_NOME + ".\nHoje o posto da área comum vai ser coberto pela Folguista 2, que chega 07:15. O checklist sai normal no fim do turno.", on: tela === "falta" },
    st.resumo && { txt: "Olá! Resumo da limpeza de hoje no " + TER_C[0] + ", Bloco A:\n5 de 6 áreas concluídas com foto (hall, elevadores, escadas, lixeiras, garagem).\nSalão de festas fica pra tarde, depois do evento.\nAs fotos de cada área vão no link abaixo.", on: tela === "check" },
    st.rel && { pdf: "relatorio-" + (st.cond || TER_C[0]).toLowerCase().replace(/\s+/g, "-") + ".pdf", txt: "Sai em PDF com as fotos e vai pro WhatsApp do síndico todo dia 1º.", on: tela === "rel" },
  ],
  hint: (tela, st) => tela === "falta" && !st.coberto ? "Escala a cobertura: o aviso pro zelador sai daqui." : tela === "check" && !st.resumo ? "Envia o resumo: o síndico recebe aqui, com as fotos." : tela === "rel" && !st.rel ? "Gera o relatório: o PDF vai pro WhatsApp do síndico." : ["hoje", "ocorr"].includes(tela) ? "Abre Falta, Checklist ou Relatório pra ver o que sai no WhatsApp." : null,
};

const OS_SISTEMAS = [
  { id: "dedet", label: "OS · Dedetizadora", head: "Sistema de OS · prévia", url: "sistema.suaempresa.com.br", real: "dedetizadora",
    pacotes: [["Lembrete pra cada cliente", "Orçamento automático no WhatsApp ou lembrete de reaplicação."], ["Serviço e garantia sob controle", "OS, agenda por técnico, certificado em PDF automático, garantia com retornos, lembrete de reaplicação."], ["Empresa rodando sem você no telefone", "Essencial + app do técnico (fotos, assinatura, check-in), aviso “técnico a caminho / atrasado”, portal do cliente com certificado, relatório mensal."]],
    mede: "reaplicações que voltaram pelo lembrete, orçamentos respondidos fora do horário, retornos de garantia sem retrabalho, horas de escritório economizadas" },
  { id: "ar", label: "OS · Ar-condicionado", head: "Sistema de OS · prévia", url: "sistema.suaempresa.com.br", real: "ar-condicionado",
    pacotes: [["Cliente antigo volta pra limpeza", "Lembrete de limpeza/manutenção no WhatsApp pro cliente antigo."], ["Agenda dos técnicos sem planilha", "OS, agenda dos técnicos, histórico por aparelho e endereço, lembrete automático."], ["Contrato de empresa com PMOC em dia", "Essencial + PMOC com registro das visitas e relatório pro cliente empresa, portal do cliente, app do técnico."]],
    mede: "limpezas que voltaram pelo lembrete, visitas por técnico por dia, contratos de empresa ativos" },
  { id: "loc", label: "Locação de festa e evento", head: "Sistema de locação · prévia", url: "locacao.suaempresa.com.br", real: "locacao",
    pacotes: [["Cliente reserva sem esperar resposta", "Catálogo com disponibilidade por data e pedido de orçamento pronto no WhatsApp."], ["Nenhuma peça reservada duas vezes", "Calendário por item, reserva com sinal, contrato em PDF, controle de retirada e devolução."], ["Toda avaria cobrada com prova", "Essencial + checklist com foto na saída e na volta, portal do cliente, financeiro de sinal e saldo, relatório dos itens que mais saem e dos que ficam parados."]],
    mede: "pedidos de orçamento fora do horário, reservas com sinal, avarias cobradas com foto" },
  { id: "ter", label: "Terceirização · limpeza e portaria", head: "Supervisão de postos · prévia", url: "supervisao.suaempresa.com.br", c: "#1D4ED8", cd: "#0F1E3D", impl: OS_TER,
    pacotes: [["Orçamento respondido na hora", "Orçamento automático no WhatsApp (tipo de serviço, metragem, frequência)."], ["Equipe no lugar certo todo dia", "Escala da equipe por cliente e dia, agenda recorrente, check-in no local, histórico por cliente."], ["Serviço comprovado com foto", "Essencial + app da equipe com checklist e foto, contratos recorrentes com reajuste, avaliação do cliente depois de cada serviço, relatório de horas por funcionário."]],
    mede: "orçamentos respondidos fora do horário, faltas e atrasos de equipe, nota dada pelo cliente" },
];
const OS_NIVEIS = ["Básico", "Essencial", "Completo"];
const OS_OUTROS = ["Segurança eletrônica", "Assistência técnica", "Clínica e consultório", "Marmoraria e vidraçaria"];

function OsWhatsApp({ msgs, hint }) {
  const list = msgs.filter(Boolean);
  return (
    <div className="kit-zap">
      <div className="kit-zap-head"><span className="ph-badge-dot" /><span>WhatsApp da empresa</span><span style={{ marginLeft: "auto" }}>automático</span></div>
      <div className="kit-zap-body">
        {list.map((m, i) => m.pdf
          ? <div key={i} className={"kit-zap-msg kit-zap-pdf" + (m.on ? " is-on" : "")}><b>{m.pdf}</b><span>{m.txt}</span></div>
          : <div key={i} className={"kit-zap-msg" + (m.on ? " is-on" : "")}>{m.txt}</div>)}
        {hint && <div className="kit-zap-hint">{hint}</div>}
      </div>
    </div>
  );
}

export default function Sistemas() {
  const [sid, setSid] = useState("dedet");
  const sys = OS_SISTEMAS.find((s) => s.id === sid);
  const [telaBy, setTelaBy] = useState({});
  const [stBy, setStBy] = useState({});
  const tela = sys.impl ? telaBy[sid] || sys.impl.telas[0][0] : null;
  const st = stBy[sid] || {};
  const set = (patch) => setStBy({ ...stBy, [sid]: { ...st, ...patch } });
  return (
    <section id="sistemas" className="kit-section">
      <OsSectionHead align="center" tag="Sistemas sob medida + WhatsApp" title={<>A empresa rodando <OsGradient bright>com menos telefone.</OsGradient></>}
        sub="Bases prontas de ordem de serviço, locação e supervisão de equipe, adaptadas pra marca e os serviços de cada negócio. Tudo avisando o cliente pelo WhatsApp da empresa." />
      <div className="kit-os-switch" role="tablist">
        {OS_SISTEMAS.map((s) => <button key={s.id} role="tab" aria-selected={s.id === sid} className={s.id === sid ? "on" : ""} onClick={() => setSid(s.id)}>{s.label}</button>)}
      </div>
      {sys.real ? (
        <FadeUp className="kit-os is-real" viewportAmount={0.05} distance={24} blur={0}>
          <OsMock url={sys.url} badge="SISTEMA DE VERDADE · DADOS DE EXEMPLO" bodyPadding={false}>
            {/* Base de OS (projetos/sistema-os-base) publicada em public/sistemas/<nicho>/ */}
            <iframe key={sys.real} className="kit-os-frame" src={`/sistemas/${sys.real}/`} title={`Sistema de demonstração: ${sys.label}`} loading="lazy" />
          </OsMock>
          <p className="kit-os-real-nota">
            Pode clicar à vontade: é o sistema funcionando, com dados de exemplo. Nada é salvo.{" "}
            <a href={`/sistemas/${sys.real}/`} target="_blank" rel="noopener">Abrir em tela cheia</a>
          </p>
        </FadeUp>
      ) : (
      <FadeUp className="kit-os" viewportAmount={0.05} distance={24} blur={0}>
        <OsMock url={sys.url} badge="PRÉVIA · DADOS DE EXEMPLO" bodyPadding={false}>
          <div className="kit-os-app" style={{ "--c": sys.c, "--cd": sys.cd }}>
            <div className="kit-os-header"><b>{OS_NOME}</b><span>{sys.head}</span></div>
            <div className="kit-os-nav">{sys.impl.telas.map(([id, t]) => <button key={id} className={tela === id ? "on" : ""} onClick={() => setTelaBy({ ...telaBy, [sid]: id })}>{t}</button>)}</div>
            <div className="kit-os-main">{sys.impl.render(tela, st, set)}</div>
          </div>
        </OsMock>
        <OsWhatsApp msgs={sys.impl.msgs(tela, st)} hint={sys.impl.hint(tela, st)} />
      </FadeUp>
      )}
      <FadeUp className="kit-os-pacotes" viewportAmount={0.1} distance={24} blur={0}>
        {sys.pacotes.map(([nome, itens], i) => (
          <div key={nome} className={"ph-card kit-os-pacote" + (i === 1 ? " is-destaque" : "")}>
            <OsTag tone={i === 1 ? "accent" : "dim"}>{OS_NIVEIS[i]}</OsTag>
            <h3>{nome}</h3>
            <p>{itens}</p>
          </div>
        ))}
      </FadeUp>
      <p className="kit-os-mede">Todo mês você recebe o número: {sys.mede}.</p>
      <div className="kit-row" style={{ gap: 8, marginTop: 28 }}>
        <OsTag tone="dim" style={{ alignSelf: "center", marginRight: 6 }}>Também adaptado pra</OsTag>
        {OS_OUTROS.map((n) => <OsBadge key={n}>{n}</OsBadge>)}
      </div>
    </section>
  );
}
