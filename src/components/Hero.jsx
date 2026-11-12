import { FadeUp, StaggerGroup, StaggerItem } from "../motion/system";
import { useExperiencia } from "../experiencia/ExperienciaContext";
import { Badge, BrowserMock, Button, GradientText } from "./ui";
import Logo from "./Logo";

// Stagger de 130ms entre cada elemento do Hero.
const ATRASO = 0.13;

// Dados reais da PH, nada inventado pra parecer maior do que é. O primeiro
// número acompanha a quantidade de cases em Portfolio.jsx.
const DESTAQUES = [
  { n: "3", label: "Projetos no portfólio" },
  { n: "1:1", label: "Direto com quem desenvolve" },
  { n: "2026", label: "Início das atividades" },
];

const COLUNAS = [
  ["NOVO", ["", "short"]],
  ["EM ANDAMENTO", ["", ""]],
  ["FECHADO", ["accent"]],
];

function Kanban() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16, marginBottom: 22, borderBottom: "1px dashed var(--line)" }}>
        <Logo size="sm" />
        <div style={{ display: "flex", gap: 10, flex: 1 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 34, height: 6, borderRadius: 3, background: "var(--line)" }} />
          ))}
        </div>
        <div style={{ width: 60, height: 16, borderRadius: 4, background: "var(--accent)", opacity: 0.85 }} />
      </div>
      <div className="kit-kanban">
        {COLUNAS.map(([label, cards]) => (
          <div className="kit-kcol" key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p className="ph-tag" style={{ fontSize: ".6rem" }}>{label}</p>
              <span style={{ width: 16, height: 12, borderRadius: 6, background: "var(--surface-inset)", border: "1px solid var(--line)", flexShrink: 0 }} />
            </div>
            {cards.map((c, i) => (
              <div
                key={i}
                className="kit-kcard"
                style={{ height: c === "short" ? 22 : 34, borderLeftColor: c === "accent" ? "var(--accent)" : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { modo } = useExperiencia();

  return (
    <section id="topo" className="kit-hero">
      <div className="kit-wave" />
      <div className="kit-beams" />
      <div className="kit-logo3d" style={{ opacity: modo === "imersiva" ? 0.42 : 0 }} />

      <div className="kit-hero-inner">
        <FadeUp as="p" immediate delay={0 * ATRASO} className="ph-tag ph-tag--ink ph-tag--wide">
          PH — Construindo soluções digitais
        </FadeUp>

        <FadeUp as="h1" immediate delay={1 * ATRASO} duration={0.9}>
          Transformamos ideias em <GradientText>soluções digitais.</GradientText>
        </FadeUp>

        <FadeUp as="p" immediate delay={2 * ATRASO} className="kit-hero-sub">
          Sites, sistemas, automações e soluções sob medida — pra empresas que precisam de
          tecnologia de verdade, não de mais um template.
        </FadeUp>

        <FadeUp as="div" immediate delay={3 * ATRASO} className="kit-row" style={{ marginBottom: 32 }}>
          <Button href="#contato">Começar um projeto</Button>
          <Button variant="surface" arrow="out" href="#portfolio">
            Ver projetos
          </Button>
        </FadeUp>

        <FadeUp as="div" immediate delay={4 * ATRASO} className="kit-row" style={{ gap: 10 }}>
          <Badge dot>STATUS: NO AR</Badge>
          <Badge>DESENVOLVIMENTO WEB</Badge>
          <Badge>SISTEMAS / AUTOMAÇÃO / SOFTWARE</Badge>
        </FadeUp>

        <FadeUp as="div" immediate delay={5 * ATRASO} duration={1} distance={40} className="kit-mockwrap" aria-hidden="true">
          <BrowserMock url="phtechlux.vercel.app/painel.html">
            <Kanban />
          </BrowserMock>
        </FadeUp>

        <StaggerGroup as="div" className="kit-stats" stagger={0.08} immediate delayChildren={0.75} style={{ width: "100%" }}>
          {DESTAQUES.map((d, i) => (
            <StaggerItem as="div" index={i} key={d.label} className="ph-stat" hover={false} scale={false}>
              <span className="ph-stat-n">{d.n}</span>
              <span className="ph-stat-label">{d.label}</span>
            </StaggerItem>
          ))}
          <StaggerItem as="a" index={3} href="#contato" className="ph-stat ph-stat--cta" hover={false} scale={false}>
            Pedir orçamento{" "}
            <span className="ph-arrow ph-arrow--right" aria-hidden="true">
              →
            </span>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
