// Dados fictícios só pra ilustrar interface. Cada slide é rotulado como
// "CONCEITO — DEMONSTRAÇÃO", nunca como projeto entregue de verdade.
import { useEffect, useRef, useState } from "react";
import { SectionHead as CrSectionHead, BrowserMock as CrMock, CarouselDots as CrDots, GradientText as CrGradient } from "./ui";

function CrmOficina() {
  const stats = [["128", "Veículos cadastrados"], ["34", "Serviços neste mês"], ["R$ 380", "Ticket médio"], ["76%", "Clientes recorrentes"]];
  const meses = [["Mar", 18], ["Abr", 22], ["Mai", 19], ["Jun", 27], ["Jul", 24], ["Ago", 34]];
  const rows = [["Marcos A.", "Civic 2019", "Troca de óleo", "Concluído", "ok"], ["Fernanda R.", "HB20 2021", "Revisão geral", "Em andamento", "mid"], ["Diego S.", "Onix 2020", "Troca de pastilha", "Agendado", "out"]];
  const chip = { ok: { background: "rgba(99,102,241,.14)", color: "var(--accent-soft)" }, mid: { background: "rgba(244,244,245,.08)", color: "var(--text-dim)" }, out: { border: "1px solid var(--line)", color: "var(--text-dim)" } };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="crm-g4">
        {stats.map(([v, l]) => <div key={l} className="kit-dkpanel" style={{ padding: "12px 14px" }}><div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem" }}>{v}</div><div style={{ fontSize: ".7rem", color: "var(--text-dim)" }}>{l}</div></div>)}
      </div>
      <div className="crm-g11">
        <div className="kit-dkpanel">
          <div className="ph-tag ph-tag--dim" style={{ fontSize: ".64rem", marginBottom: 12 }}>Histórico do veículo</div>
          <strong style={{ fontSize: ".92rem" }}>Marcos A.</strong>
          <div style={{ fontSize: ".76rem", color: "var(--text-dim)", paddingBottom: 10, marginBottom: 10, borderBottom: "1px dashed var(--line)" }}>Honda Civic 2019 — OXR-4521</div>
          {[["12/07/2026", "Troca de óleo + filtro", "48.200 km"], ["03/05/2026", "Revisão de freios", "45.100 km"]].map(([d, s, k]) => (
            <div key={d} style={{ display: "grid", gridTemplateColumns: "74px 1fr auto", gap: 8, fontSize: ".8rem", marginBottom: 8 }}><span style={{ fontFamily: "var(--font-mono)", fontSize: ".66rem", color: "var(--text-dim)" }}>{d}</span><span>{s}</span><span style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", color: "var(--text-dim)" }}>{k}</span></div>
          ))}
        </div>
        <div className="kit-dkpanel">
          <div className="ph-tag ph-tag--dim" style={{ fontSize: ".64rem", marginBottom: 12 }}>Serviços por mês</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
            {meses.map(([m, v]) => <div key={m} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6 }}><div style={{ width: "100%", maxWidth: 24, height: (v / 34) * 80 + "%", borderRadius: "4px 4px 0 0", background: "var(--gradient-bar)" }} /><span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", color: "var(--text-dim)" }}>{m}</span></div>)}
          </div>
        </div>
      </div>
      <div className="kit-dkpanel">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Cliente", "Veículo", "Serviço", "Status"].map((h) => <th key={h} className="kit-th">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}>{r.slice(0, 3).map((c) => <td key={c} className="kit-td">{c}</td>)}<td className="kit-td"><span style={{ fontFamily: "var(--font-mono)", fontSize: ".64rem", padding: "3px 9px", borderRadius: 20, ...chip[r[4]] }}>{r[3]}</span></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function CrmSalao() {
  const agenda = [["09:30", "Renata M.", "Corte + escova", "Concluído", ["#dcfce7", "#16a34a"]], ["11:00", "Bianca F.", "Coloração", "Em atendimento", ["#ede9fe", "#7c3aed"]], ["13:30", "Juliana P.", "Tratamento capilar", "Agendado", ["#f1f1f6", "#6b6f80"]]];
  const bars = [["Corte", 38], ["Coloração", 27], ["Tratamento", 21], ["Unhas", 14]];
  return (
    <div className="kit-light">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div className="kit-ldim" style={{ fontSize: ".76rem" }}>Bem-vinda de volta</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem" }}>Camila Duarte</div></div>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#6366f1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700 }}>CD</div>
      </div>
      <div className="crm-g3" style={{ marginBottom: 14 }}>
        {[["Atendimentos hoje", "12", "↑ 8% vs. ontem"], ["Agenda ocupada", "87%", null], ["Novas clientes no mês", "24", "↑ 15% vs. mês anterior"]].map(([l, v, t]) => (
          <div key={l} className="kit-lcard" style={{ display: "flex", flexDirection: "column", gap: 6 }}><span className="kit-ldim" style={{ fontSize: ".72rem" }}>{l}</span><span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem" }}>{v}</span>{t ? <span style={{ fontSize: ".7rem", fontWeight: 600, color: "#16a34a" }}>{t}</span> : <div style={{ height: 6, borderRadius: 4, background: "var(--light-line)" }}><div style={{ width: "87%", height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#8b5cf6,#6366f1)" }} /></div>}</div>
        ))}
      </div>
      <div className="crm-g12">
        <div className="kit-lcard"><div className="kit-ldim" style={{ fontWeight: 600, fontSize: ".76rem", marginBottom: 10 }}>Próximos agendamentos</div>
          {agenda.map(([h, c, s, st, [bg, fg]]) => <div key={h} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--light-line)" }}><span className="kit-ldim" style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem" }}>{h}</span><span><b>{c}</b><br /><span className="kit-ldim" style={{ fontSize: ".74rem" }}>{s}</span></span><span style={{ fontSize: ".66rem", fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: bg, color: fg }}>{st}</span></div>)}
        </div>
        <div className="kit-lcard"><div className="kit-ldim" style={{ fontWeight: 600, fontSize: ".76rem", marginBottom: 12 }}>Serviços mais pedidos</div>
          {bars.map(([n, p]) => <div key={n} style={{ display: "grid", gridTemplateColumns: "72px 1fr 30px", gap: 8, alignItems: "center", marginBottom: 12 }}><span className="kit-ldim" style={{ fontSize: ".74rem" }}>{n}</span><div style={{ height: 8, borderRadius: 4, background: "var(--light-line)" }}><div style={{ width: p + "%", height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#8b5cf6,#6366f1)" }} /></div><span className="kit-ldim" style={{ fontFamily: "var(--font-mono)", fontSize: ".7rem", textAlign: "right" }}>{p}%</span></div>)}
        </div>
      </div>
    </div>
  );
}

function CrmLoja() {
  const vendas = [["Seg", 1200], ["Ter", 1850], ["Qua", 1400], ["Qui", 2100], ["Sex", 2600], ["Sáb", 3200], ["Dom", 1700]];
  const cats = [["Roupas", 42, "#6366f1"], ["Acessórios", 26, "#22c55e"], ["Calçados", 19, "#f59e0b"], ["Outros", 13, "#ec4899"]];
  let acc = 0; const donut = "conic-gradient(" + cats.map(([, p, c]) => { const s = acc; acc += p; return c + " " + s + "% " + acc + "%"; }).join(",") + ")";
  return (
    <div className="kit-light">
      <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: "#818cf8", filter: "blur(50px)", opacity: .35, top: -100, right: -60 }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", background: "#f0abfc", filter: "blur(50px)", opacity: .35, bottom: -80, left: -60 }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem" }}>Painel de vendas</div>
        <p className="kit-ldim" style={{ fontSize: ".84rem", marginBottom: 14 }}>Visão geral da loja nos últimos 7 dias.</p>
        <div className="crm-g4" style={{ marginBottom: 12 }}>
          {[["Faturamento", "R$ 14.050", "↑ 12,5%", "#16a34a"], ["Pedidos", "86", "↓ 3,2%", "#dc2626"], ["Novos clientes", "31", "↑ 9%", "#16a34a"], ["Ticket médio", "R$ 163", "↑ 4,1%", "#16a34a"]].map(([l, v, t, c]) => <div key={l} className="kit-lcard" style={{ padding: "12px 14px" }}><div className="kit-ldim" style={{ fontSize: ".7rem" }}>{l}</div><div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem" }}>{v}</div><div style={{ fontSize: ".68rem", fontWeight: 600, color: c }}>{t}</div></div>)}
        </div>
        <div className="crm-g11">
          <div className="kit-lcard"><div className="kit-ldim" style={{ fontWeight: 600, fontSize: ".76rem", marginBottom: 12 }}>Vendas por dia</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110 }}>{vendas.map(([d, v]) => <div key={d} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6 }}><div style={{ width: "100%", maxWidth: 22, height: (v / 3200) * 80 + "%", borderRadius: "5px 5px 0 0", background: "linear-gradient(180deg,#818cf8,#6366f1)" }} /><span className="kit-ldim" style={{ fontSize: ".66rem" }}>{d}</span></div>)}</div>
          </div>
          <div className="kit-lcard"><div className="kit-ldim" style={{ fontWeight: 600, fontSize: ".76rem", marginBottom: 12 }}>Categorias vendidas</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ width: 90, height: 90, borderRadius: "50%", background: donut, position: "relative", flexShrink: 0 }}><div style={{ position: "absolute", inset: 17, borderRadius: "50%", background: "#fff" }} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{cats.map(([n, p, c]) => <span key={n} className="kit-ldim" style={{ fontSize: ".76rem" }}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c, marginRight: 6 }} />{n} <b style={{ color: "var(--light-ink)" }}>{p}%</b></span>)}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PH_CRM_SLIDES = [
  { label: "Oficina", url: "painel-crm.exemplo", Comp: CrmOficina, pad: true },
  { label: "Salão / Clínica", url: "agenda-salao.exemplo", Comp: CrmSalao, pad: false },
  { label: "Loja / Comércio", url: "vendas-loja.exemplo", Comp: CrmLoja, pad: false },
];

export default function ConceitoCRM() {
  const [i, setI] = useState(0);
  // Cards ficam sempre montados; a altura do palco acompanha o slide ativo
  // pra não sobrar espaço vazio quando ele é mais curto que os outros.
  const cards = useRef([]);
  const [altura, setAltura] = useState(undefined);
  useEffect(() => {
    const el = cards.current[i];
    if (!el) return;
    const medir = () => setAltura(el.offsetHeight);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [i]);
  const n = PH_CRM_SLIDES.length;
  const pos = (k) => { let d = k - i; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };
  return (
    <section id="crm" className="kit-section">
      <CrSectionHead align="center" tag="CRM sob medida" title={<>Também construímos o <CrGradient bright>sistema por trás</CrGradient> do atendimento.</>}
        sub="Pra negócios que atendem o mesmo cliente várias vezes — oficina, clínica, salão, loja — um CRM organiza histórico, agenda e vendas num lugar só." />
      <div className="kit-crm" style={{ height: altura }}>
        <button className="kit-arrow" style={{ left: 0 }} aria-label="Slide anterior" onClick={() => setI((i - 1 + n) % n)}>‹</button>
        {PH_CRM_SLIDES.map((s, k) => {
          const p = pos(k); const C = s.Comp;
          return (
            <div key={s.label} aria-hidden={p !== 0} ref={(el) => { cards.current[k] = el; }} className={"kit-crm-card " + (p === 0 ? "is-center" : p < 0 ? "is-left" : "is-right")} onClick={() => p !== 0 && setI(k)}>
              <CrMock url={s.url} badge="CONCEITO — DEMONSTRAÇÃO" bodyPadding={s.pad}><C /></CrMock>
            </div>
          );
        })}
        <button className="kit-arrow" style={{ right: 0 }} aria-label="Próximo slide" onClick={() => setI((i + 1) % n)}>›</button>
      </div>
      <CrDots items={PH_CRM_SLIDES.map((s) => s.label)} active={i} onSelect={setI} />
      <p style={{ marginTop: 18, fontSize: ".82rem", color: "var(--text-dim)", maxWidth: "62ch", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>Três protótipos visuais pra mostrar como um CRM sob medida pode ficar em estilos diferentes — nenhum é de um cliente real (ainda), mas é exatamente esse tipo de sistema que a PH constrói.</p>
    </section>
  );
}
