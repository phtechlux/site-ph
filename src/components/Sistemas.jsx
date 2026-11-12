// Demos de OS, locação e terceirização com WhatsApp. Tudo local, sem backend,
// e sempre com dados fictícios (selo "PRÉVIA · DADOS DE EXEMPLO").
import { useState } from "react";
import { FadeUp } from "../motion/system";
import { SectionHead as OsSectionHead, BrowserMock as OsMock, GradientText as OsGradient, MonoTag as OsTag, Badge as OsBadge } from "./ui";

// Recriação das demos em prospeccao/produtos/demo-*.html — dados fictícios (selo "exemplo").
const osHoje = new Date();
const osDia = (n) => { const x = new Date(osHoje); x.setDate(x.getDate() + n); return x; };
const osBr = (x) => x.toLocaleDateString("pt-BR");
const osDiaSem = (x) => x.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
const osRs = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const osSab = osDia((6 - osHoje.getDay() + 7) % 7 || 7);
const OS_NOME = "Empresa";
const OS_TEC = ["Técnico 1", "Técnico 2", "Técnico 3"];
const OS_CLI = ["Restaurante Exemplo", "Condomínio Exemplo", "Padaria Exemplo", "Clínica Exemplo", "Residência · Sr. Exemplo", "Escola Exemplo", "Mercado Exemplo", "Residência · Sra. Exemplo", "Academia Exemplo"];

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

/* ---------- OS (dedetização / ar-condicionado) ---------- */
function makeOS(v) {
  const S = v.servicos;
  return {
    telas: [["hoje", "Hoje"], ["os", v.osTab], ["gar", "Garantias"], ["reap", v.reapTab], ["atraso", "Técnico a caminho"]],
    render: (tela, st, set) => {
      if (tela === "hoje") {
        const s4 = [["ok", "concluído"], ["", "a caminho"], ["warn", "atrasado 20 min"], ["", "agendado"]];
        return <><OsHead t="Hoje" sub={osBr(osHoje) + " · Brasília"} />
          <OsKpis items={[["Serviços hoje", 9], ["Garantias vencendo (7 dias)", 4], [v.kpiLembrete, 12], ["Retornos agendados", 2]]} />
          <div className="kit-os-cols">{OS_TEC.map((t, i) => <div key={t} className="kit-os-card"><b>{t}</b>{[0, 1, 2].map((j) => { const s = s4[(i + j) % 4]; return <OsItem key={j} title={(8 + j * 3) + ":00 · " + OS_CLI[(i * 3 + j) % 9]} tag={s[1]} tone={s[0]}>{S[(i + j) % 3]} · Brasília</OsItem>; })}</div>)}</div></>;
      }
      if (tela === "os") {
        const f = st.f || { cli: "Condomínio Residencial Exemplo", end: "Quadra 10, Bloco B", serv: S[0], tec: OS_TEC[0], gar: 90 };
        const up = (k) => (e) => set({ f: { ...f, [k]: e.target.value } });
        const gerar = () => set({ f, cert: { ...f, n: String(Math.floor(Math.random() * 9000) + 1000), data: osBr(osHoje), fim: osBr(osDia(Number(f.gar) || 0)) } });
        return <><OsHead t="Nova ordem de serviço" sub={v.osSub} />
          <div className="kit-os-card"><div className="kit-os-grid2">
            <label>Cliente<input value={f.cli} onChange={up("cli")} /></label>
            <label>Endereço<input value={f.end} onChange={up("end")} /></label>
            <label>Serviço<select value={f.serv} onChange={up("serv")}>{S.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Técnico<select value={f.tec} onChange={up("tec")}>{OS_TEC.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Data<input value={osBr(osHoje)} readOnly /></label>
            <label>Garantia (dias)<input type="number" value={f.gar} onChange={up("gar")} /></label>
          </div><button className="kit-os-btn" onClick={gerar}>{v.osBtn}</button></div>
          {st.cert && <div className="kit-os-cert"><h5>{v.certTit}</h5><p className="kit-os-sub" style={{ margin: "2px 0 10px" }}>{OS_NOME} · Nº {st.cert.n}</p>
            {[["Cliente", st.cert.cli], ["Endereço", st.cert.end], ["Serviço", st.cert.serv], ["Data", st.cert.data], ["Técnico responsável", st.cert.tec], ["Garantia até", st.cert.fim]].map(([a, b]) => <div key={a} className="lin"><span>{a}</span><b>{b}</b></div>)}</div>}</>;
      }
      if (tela === "gar") {
        const rows = OS_CLI.slice(0, 6).map((c, i) => { const feito = osDia(-(i * 17 + 5)); const fim = new Date(feito); fim.setDate(fim.getDate() + 90); const d = Math.round((fim - osHoje) / 864e5);
          const s = d < 0 ? ["bad", "vencida"] : d <= 7 ? ["warn", d === 0 ? "vence hoje" : d === 1 ? "vence amanhã" : "vence em " + d + " dias"] : ["ok", "ativa"];
          return [c, S[i % 3], osBr(feito), osBr(fim), i % 3, <OsChip tone={s[0]}>{s[1]}</OsChip>]; });
        return <><OsHead t="Garantias" sub="Cada serviço com data de fim e os retornos feitos. Pedido de retorno fora do prazo aparece na hora." /><OsTable head={["Cliente", "Serviço", "Feito em", "Garantia até", "Retornos", "Situação"]} rows={rows} /></>;
      }
      if (tela === "reap") {
        return <><OsHead t={v.reapTab} sub={v.reapSub} />
          <OsKpis items={[["Vencem este mês", 12], ["Lembretes enviados", 9], ["Já reagendaram", 3], ["Voltaram pelo lembrete (mês)", "R$ 660"]]} />
          <OsTable head={["Cliente", "Último serviço", "Vence em", "Lembrete"]} rows={OS_CLI.slice(2, 7).map((c, i) => [c, S[i % 3] + " · " + osBr(osDia(-170 - i * 3)), (i + 2) + " dias", <OsChip tone={i < 3 ? "ok" : ""}>{i < 3 ? "enviado" : "agendado"}</OsChip>])} /></>;
      }
      return <><OsHead t="Técnico a caminho" sub="O cliente fica sabendo sozinho quando o técnico sai e se vai atrasar." />
        <div className="kit-os-card"><OsItem title="11:30 · Residência · Sr. Exemplo" tag="previsão 11:55" tone="warn">Técnico 2 saiu do serviço anterior às 11:20 · {S[0]}</OsItem></div></>;
    },
    msgs: (tela, st) => [
      { txt: v.zapLembrete, on: ["reap", "hoje", "gar"].includes(tela) },
      { txt: "Oi! O técnico da " + OS_NOME + " já está a caminho 🚐\nO serviço anterior demorou um pouco, a nova previsão é 11:55.\nSe esse horário não der, é só responder aqui que a gente reagenda.", on: ["atraso", "hoje"].includes(tela) },
      st.cert && { pdf: v.pdf + "-" + st.cert.n + ".pdf", txt: v.certTit + " · " + st.cert.serv + " · garantia até " + st.cert.fim, on: tela === "os" },
    ],
    hint: (tela, st) => tela === "os" && !st.cert ? "Finaliza a OS ao lado: o " + v.pdf + " em PDF chega aqui sozinho." : null,
  };
}

const OS_DEDET = makeOS({
  servicos: ["Dedetização", "Desratização", "Descupinização"], osTab: "Nova OS + certificado", reapTab: "Reaplicação", kpiLembrete: "Lembretes de reaplicação",
  osSub: "Preenche aqui ou o técnico preenche no celular. Ao finalizar, o certificado sai sozinho.", osBtn: "Finalizar e gerar certificado", certTit: "Certificado de execução de serviço", pdf: "certificado",
  reapSub: "Quem está chegando na hora de reaplicar recebe lembrete no WhatsApp da empresa. Cliente que ia esquecer, volta.",
  zapLembrete: "Oi! Aqui é da " + OS_NOME + " 🙂\nJá faz 6 meses da dedetização aí no Restaurante Exemplo. Pra manter tudo protegido, essa é a época de reaplicar.\nQuer que eu já deixe um horário separado essa semana?",
});
const OS_AR = makeOS({
  servicos: ["Limpeza de ar condicionado", "Instalação", "Manutenção"], osTab: "Nova OS + relatório", reapTab: "Próxima limpeza", kpiLembrete: "Lembretes de limpeza",
  osSub: "Preenche aqui ou o técnico preenche no celular. Ao finalizar, o relatório (e o PMOC de quem é empresa) sai sozinho.", osBtn: "Finalizar e gerar relatório", certTit: "Relatório de execução de serviço", pdf: "relatorio",
  reapSub: "Quem está chegando na hora da limpeza recebe lembrete no WhatsApp da empresa. Cliente que ia esquecer, volta.",
  zapLembrete: "Oi! Aqui é da " + OS_NOME + " 🙂\nJá faz 6 meses da última limpeza do ar aí no Restaurante Exemplo. Com esse calor, é a hora de limpar pra ele gelar bem e não pesar na conta de luz.\nQuer que eu já deixe um horário separado essa semana?",
});

/* ---------- Locação ---------- */
const LOC_ITENS = [["Mesa redonda com 4 cadeiras", 120, 15], ["Cadeira avulsa", 400, 3.5], ["Toalha de mesa", 150, 6], ["Tenda 5x5", 6, 280], ["Jogo de louça (10 pessoas)", 40, 25], ["Freezer horizontal", 4, 90]];
const LOC_EV = ["Aniversário · Família Exemplo", "Casamento Exemplo", "Confraternização · Empresa Exemplo", "Chá de bebê Exemplo", "Formatura Exemplo", "Festa junina · Escola Exemplo"];
const OS_LOC = {
  telas: [["agenda", "Agenda da semana"], ["disp", "Disponibilidade"], ["orc", "Orçamento"], ["dev", "Devolução"], ["sinal", "Sinais"]],
  render: (tela, st, set) => {
    if (tela === "agenda") {
      const s4 = [["ok", "entregue"], ["", "carregando"], ["warn", "sinal pendente"], ["", "agendado"]];
      const dias = [osDia(1), osSab, osDia(((7 - osHoje.getDay()) % 7) || 8)];
      return <><OsHead t="Agenda da semana" sub={"Semana de " + osBr(osHoje) + " · entregas e retiradas · Brasília"} />
        <OsKpis items={[["Eventos na semana", 14], ["Entregas no sábado", 6], ["Sinais pendentes", 3], ["Itens com avaria (mês)", 5]]} />
        <div className="kit-os-cols">{dias.map((dt, i) => <div key={i} className="kit-os-card"><b>{osDiaSem(dt)}</b>{[0, 1, 2].map((j) => { const s = s4[(i + j) % 4]; return <OsItem key={j} title={(j === 2 ? "Retirada " : "Entrega ") + (7 + j * 3) + ":00"} tag={s[1]} tone={s[0]}>{LOC_EV[(i * 3 + j) % 6]} · Brasília<br />{LOC_ITENS[(i + j) % 6][0]} e mais {2 + j} itens</OsItem>; })}</div>)}</div></>;
    }
    if (tela === "disp") {
      const rows = LOC_ITENS.map(([n, q], i) => { const res = Math.min(q, Math.round(q * [0.92, 0.75, 0.6, 1, 0.45, 0.5][i])); const pc = Math.round(res / q * 100);
        return [n, q, res, q - res, <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className={"kit-os-bar" + (pc >= 90 ? " cheio" : "")}><i style={{ width: pc + "%" }} /></span><OsChip tone={pc >= 100 ? "bad" : pc >= 90 ? "warn" : "ok"}>{pc >= 100 ? "esgotado" : pc >= 90 ? "quase esgotado" : pc + "%"}</OsChip></span>]; });
      return <><OsHead t="Disponibilidade" sub="Antes de fechar, o sistema mostra quanto de cada item já está reservado naquela data. Acabou o “fechei e depois vi que não tinha cadeira”." />
        <p style={{ fontWeight: 600, margin: "0 0 6px" }}>Sábado, {osBr(osSab)} · 6 eventos</p>
        <OsTable head={["Item", "Estoque", "Reservado", "Livre", "Ocupação"]} rows={rows} num={[1, 2, 3]} /></>;
    }
    if (tela === "orc") {
      const qtd = st.qtd || [10, 0, 10, 1, 4, 1];
      const tot = LOC_ITENS.reduce((a, [, , p], i) => a + p * (Number(qtd[i]) || 0), 0);
      const setQ = (i) => (e) => { const q = [...qtd]; q[i] = e.target.value; set({ qtd: q, enviado: false }); };
      return <><OsHead t="Orçamento em 1 minuto" sub="Escolhe os itens e a quantidade, o total sai na hora e vai pronto pro WhatsApp do cliente, com a reserva segurada." />
        <div className="kit-os-card"><table><thead><tr><th>Item</th><th className="n">Diária</th><th className="n">Qtd</th><th className="n">Subtotal</th></tr></thead>
          <tbody>{LOC_ITENS.map(([n, , p], i) => <tr key={n}><td>{n}</td><td className="n">{osRs(p)}</td><td className="n"><input className="kit-os-qty" type="number" min="0" value={qtd[i]} onChange={setQ(i)} /></td><td className="n">{osRs(p * (Number(qtd[i]) || 0))}</td></tr>)}</tbody></table>
          <div className="kit-os-tot"><span>Total</span><span>{osRs(tot)}</span></div></div>
        <button className="kit-os-btn" disabled={st.enviado} onClick={() => set({ qtd, enviado: true })}>Enviar orçamento no WhatsApp</button></>;
    }
    if (tela === "dev") {
      const dev = [[LOC_ITENS[0][0], 10, 10], [LOC_ITENS[2][0], 10, 9], [LOC_ITENS[4][0], 4, 4], [LOC_ITENS[1][0], 20, 20]];
      return <><OsHead t="Conferência na devolução" sub="O motorista confere no celular o que voltou. Falta ou avaria já gera a cobrança, com foto." />
        <p style={{ fontWeight: 600, margin: "0 0 6px" }}>{LOC_EV[0]} · retirada {osBr(osDia(-1))}</p>
        <OsTable head={["Item", "Saiu", "Voltou", "Situação"]} num={[1, 2]} rows={dev.map(([n, s, v], i) => [n, s, v, s === v ? (i === 2 ? <OsChip tone="warn">1 peça com avaria · foto</OsChip> : <OsChip tone="ok">ok</OsChip>) : <OsChip tone="bad">falta {s - v}</OsChip>])} />
        <button className="kit-os-btn" disabled={st.cobrado} onClick={() => set({ cobrado: true })}>Gerar cobrança da avaria</button></>;
    }
    const sin = LOC_EV.slice(0, 5).map((e, i) => { const t = [1840, 3260, 980, 2150, 4700][i]; const pago = i % 3 !== 1; return [e, osBr(osDia(i * 2 + 3)), osRs(t), osRs(t * 0.3), <OsChip tone={pago ? "ok" : "warn"}>{pago ? "sinal pago" : "lembrete enviado hoje"}</OsChip>]; });
    return <><OsHead t="Sinais e pagamentos" sub="Reserva sem sinal fica marcada e recebe lembrete sozinha. Data boa não fica presa com quem não vai fechar." /><OsTable head={["Evento", "Data", "Total", "Sinal", "Situação"]} rows={sin} num={[2]} /></>;
  },
  msgs: (tela, st) => {
    const qtd = st.qtd || [10, 0, 10, 1, 4, 1];
    const lin = LOC_ITENS.map(([n], i) => [n, Number(qtd[i]) || 0]).filter(([, q]) => q > 0);
    const tot = LOC_ITENS.reduce((a, [, , p], i) => a + p * (Number(qtd[i]) || 0), 0);
    return [
      st.enviado && { txt: "Oi! Segue o orçamento da " + OS_NOME + " pro dia " + osBr(osSab) + " 🎉\n" + lin.map(([n, q]) => "• " + q + "x " + n).join("\n") + "\nTotal: " + osRs(tot) + " (entrega e retirada a confirmar)\nOs itens ficam reservados por 24h. Pra confirmar é só mandar o sinal de 30%.", on: tela === "orc" },
      st.cobrado && { txt: "Oi! Aqui é da " + OS_NOME + ". Obrigado por alugar com a gente 🙂\nNa conferência voltou 1 toalha de mesa a menos e 1 jogo de louça (10 pessoas) com avaria (foto abaixo).\nO valor de reposição ficou " + osRs(6 * 3 + 12) + ". Pode mandar no Pix quando puder.", on: tela === "dev" },
    ];
  },
  hint: (tela, st) => tela === "orc" && !st.enviado ? "Mexe nas quantidades e envia: o orçamento chega aqui pronto." : tela === "dev" && !st.cobrado ? "Gera a cobrança ao lado: a mensagem com a foto sai daqui." : ["agenda", "disp", "sinal"].includes(tela) ? "Abre Orçamento ou Devolução pra ver o que sai no WhatsApp." : null,
};

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
        <OsTable head={["Condomínio", "Ocorrência", "Aberta", "Responsável", "Situação"]} rows={oc.map((o, i) => [TER_C[i], o[0], "pelo " + o[1] + " · " + osBr(osDia(-i)), o[2], <OsChip tone={o[3][0]}>{o[3][1]}</OsChip>])} /></>;
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
  { id: "dedet", label: "OS · Dedetizadora", head: "Sistema de OS · prévia", url: "sistema.suaempresa.com.br", c: "#313485", cd: "#1F1A50", impl: OS_DEDET,
    pacotes: [["Lembrete pra cada cliente", "Orçamento automático no WhatsApp ou lembrete de reaplicação."], ["Serviço e garantia sob controle", "OS, agenda por técnico, certificado em PDF automático, garantia com retornos, lembrete de reaplicação."], ["Empresa rodando sem você no telefone", "Essencial + app do técnico (fotos, assinatura, check-in), aviso “técnico a caminho / atrasado”, portal do cliente com certificado, relatório mensal."]],
    mede: "reaplicações que voltaram pelo lembrete, orçamentos respondidos fora do horário, retornos de garantia sem retrabalho, horas de escritório economizadas" },
  { id: "ar", label: "OS · Ar-condicionado", head: "Sistema de OS · prévia", url: "sistema.suaempresa.com.br", c: "#313485", cd: "#1F1A50", impl: OS_AR,
    pacotes: [["Cliente antigo volta pra limpeza", "Lembrete de limpeza/manutenção no WhatsApp pro cliente antigo."], ["Agenda dos técnicos sem planilha", "OS, agenda dos técnicos, histórico por aparelho e endereço, lembrete automático."], ["Contrato de empresa com PMOC em dia", "Essencial + PMOC com registro das visitas e relatório pro cliente empresa, portal do cliente, app do técnico."]],
    mede: "limpezas que voltaram pelo lembrete, visitas por técnico por dia, contratos de empresa ativos" },
  { id: "loc", label: "Locação de festa e evento", head: "Sistema de locação · prévia", url: "locacao.suaempresa.com.br", c: "#7C3AED", cd: "#2E1065", impl: OS_LOC,
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
  const tela = telaBy[sid] || sys.impl.telas[0][0];
  const st = stBy[sid] || {};
  const set = (patch) => setStBy({ ...stBy, [sid]: { ...st, ...patch } });
  return (
    <section id="sistemas" className="kit-section">
      <OsSectionHead align="center" tag="Sistemas sob medida + WhatsApp" title={<>A empresa rodando <OsGradient bright>com menos telefone.</OsGradient></>}
        sub="Bases prontas de ordem de serviço, locação e supervisão de equipe, adaptadas pra marca e os serviços de cada negócio. Tudo avisando o cliente pelo WhatsApp da empresa." />
      <div className="kit-os-switch" role="tablist">
        {OS_SISTEMAS.map((s) => <button key={s.id} role="tab" aria-selected={s.id === sid} className={s.id === sid ? "on" : ""} onClick={() => setSid(s.id)}>{s.label}</button>)}
      </div>
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
