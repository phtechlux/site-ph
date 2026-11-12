import { StaggerGroup, StaggerItem } from "../motion/system";
import { BrowserMock, GradientText, SectionHead, cx } from "./ui";

// O app vendido entra sem nome nem link: o cliente ainda não autorizou aparecer
// como case. As telas em public/cases/app-servicos/ são prints reais do
// protótipo com a marca trocada por "a plataforma" antes da captura.
const CASES = [
  {
    nome: "Protótipo de app sob medida",
    ano: "2026",
    segmento: "App · Cliente em sigilo",
    tecnologias: "React Native · Expo · TypeScript",
    status: "Entregue",
    problema: "Empresa precisava ver o app funcionando de verdade antes de investir no produto completo.",
    solucao:
      "Protótipo com três tipos de conta e login, agenda com confirmação automática, carteira com saldo e saque, avaliações e notificações.",
    resultado: "Entregue 3 dias depois do contrato e aprovado. Nome e conceito do cliente ficam em sigilo.",
    telas: [
      { src: "/cases/app-servicos/1-contas.webp", alt: "Tela de escolha do tipo de conta" },
      { src: "/cases/app-servicos/2-agenda.webp", alt: "Tela de agenda com dias disponíveis" },
      { src: "/cases/app-servicos/3-carteira.webp", alt: "Tela de carteira com saldo e saque" },
    ],
  },
  {
    nome: "Barbearia Miragem",
    ano: "2026",
    segmento: "Barbearia",
    tecnologias: "React · Vite · WhatsApp",
    status: "Em aprovação",
    problema: "O agendamento online antigo foi desligado por causa de horário marcado por quem nunca aparecia.",
    solucao: "Site com serviços, avaliações reais do Google e agendamento que já manda o pedido pronto no WhatsApp.",
    resultado: "Site no ar, aguardando aprovação do dono pra ligar a reserva com pagamento.",
    link: "https://barbearia-miragem.vercel.app",
    preview: "miragem",
  },
  {
    nome: "Centro Automotivo Cuiabá",
    ano: "2026",
    segmento: "Automotivo",
    tecnologias: "HTML · CSS · JS · WhatsApp",
    status: "No ar",
    problema: "Atendimento e agendamento dependiam só de ligação e boca a boca, sem nenhuma presença online.",
    solucao:
      "Site com os serviços organizados por categoria e um formulário que já monta a mensagem pronta pro WhatsApp da oficina.",
    resultado: "Site publicado, com os pedidos indo direto pro WhatsApp da oficina.",
    link: "https://centroautomotivocuiaba.vercel.app",
    preview: "centro",
  },
];

const ESTILO_MOCK = { borderRadius: "10px 10px 0 0", borderBottom: 0, boxShadow: "none" };

function PreviewMiragem() {
  return (
    <div style={{ width: "100%", alignSelf: "flex-end" }}>
      <BrowserMock url="barbearia-miragem.vercel.app" bodyPadding={false} style={ESTILO_MOCK}>
        <div className="kit-miragem">
          <img className="ph" src="/cases/barbearia-miragem/hero.jpg" alt="Prévia do site da Barbearia Miragem" loading="lazy" />
          <div className="ov" />
          <div className="nv">
            <img src="/cases/barbearia-miragem/logo.png" alt="Barbearia Miragem" loading="lazy" />
            <span>Agendar</span>
          </div>
          <div className="ct">
            <span className="em">MIRAGEM · DESDE 2010</span>
            <h4>
              Mais que um corte.
              <br />
              Uma tradição.
            </h4>
            <span className="sb">Estilo, confiança e experiência desde 2010.</span>
            <span className="bt">Agendar horário</span>
          </div>
        </div>
      </BrowserMock>
    </div>
  );
}

function PreviewCentro() {
  return (
    <div style={{ width: "100%", alignSelf: "flex-end" }}>
      <BrowserMock url="centroautomotivocuiaba.vercel.app" bodyPadding={false} style={ESTILO_MOCK}>
        <img
          src="/cases/centro-automotivo/hero.webp"
          alt="Página inicial do site do Centro Automotivo Cuiabá"
          loading="lazy"
          style={{ display: "block", width: "100%", height: 250, objectFit: "cover", objectPosition: "center top" }}
        />
      </BrowserMock>
    </div>
  );
}

function CaseCard({ c }) {
  const entregue = c.status === "No ar" || c.status === "Entregue";
  return (
    <article className="ph-case">
      <div className="ph-case-preview">
        {c.preview === "miragem" && <PreviewMiragem />}
        {c.preview === "centro" && <PreviewCentro />}
        {c.telas && c.telas.map((t) => <img key={t.src} src={t.src} alt={t.alt} loading="lazy" />)}
      </div>
      <div className="ph-case-body">
        <div className="ph-case-head">
          <h3>{c.nome}</h3>
          <span className={cx("ph-status", entregue ? "ph-status--ok" : "ph-status--pending")}>{c.status}</span>
        </div>
        <div className="ph-case-meta">
          <span>{c.ano}</span>
          <span>{c.segmento}</span>
          <span>{c.tecnologias}</span>
        </div>
        <dl className="ph-case-flow">
          <div>
            <dt>Problema</dt>
            <dd>{c.problema}</dd>
          </div>
          <div>
            <dt>Solução</dt>
            <dd>{c.solucao}</dd>
          </div>
          <div>
            <dt>Resultado</dt>
            <dd>{c.resultado}</dd>
          </div>
        </dl>
        {c.link && (
          <div className="ph-case-foot">
            <span />
            <a href={c.link} target="_blank" rel="noopener noreferrer" className="ph-case-link">
              Ver o site{" "}
              <span className="ph-arrow ph-arrow--out" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="kit-section">
      <SectionHead
        tag="Projetos"
        title={
          <>
            Cada projeto é um <GradientText>problema resolvido.</GradientText>
          </>
        }
        sub="A PH tá começando. Esses são os projetos reais até agora, com o status de cada um."
      />

      <StaggerGroup as="div" className="kit-cases" stagger={0.1} viewportAmount={0.05}>
        {CASES.map((c, i) => (
          // O hover do card é CSS; o transform do motion fica no invólucro pra não brigar com ele.
          <StaggerItem
            index={i}
            key={c.nome}
            hover={false}
            scale={false}
            className={cx("kit-case-item", c.telas && "kit-case-wide")}
          >
            <CaseCard c={c} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
