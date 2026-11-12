import { StaggerGroup, StaggerItem } from "../motion/system";
import { GradientText, SectionHead } from "./ui";

const SERVICOS = [
  {
    n: "01",
    nome: "Sites",
    desc: "Site ou landing page sob medida, preparado pro Google e com a cara do seu negócio.",
  },
  {
    n: "02",
    nome: "Cardápio com pedido no WhatsApp",
    desc: "Catálogo navegável com carrinho que monta a mensagem pronta no WhatsApp. Acabou o cardápio em PDF e o “quanto custa?” toda hora.",
  },
  {
    n: "03",
    nome: "Orçamento e agendamento online",
    desc: "Orçamento que se calcula sozinho, ou serviço → horário → confirmação no WhatsApp, conforme o negócio.",
  },
  {
    n: "04",
    nome: "Atendimento automático no WhatsApp",
    desc: "Responde preço, horário e as dúvidas de sempre 24h, e só passa pra você quando precisa de gente.",
  },
  {
    n: "05",
    nome: "Sistemas com login",
    desc: "Ordem de serviço, locação, escala de equipe e histórico de cliente saindo do papel e da planilha.",
    link: "#sistemas",
  },
  {
    n: "06",
    nome: "Protótipo de app",
    desc: "A ideia do seu aplicativo funcionando e navegável, pra validar antes de investir no produto completo.",
  },
];

export default function Services() {
  return (
    <section id="servicos" className="kit-section">
      <SectionHead
        tag="O que a PH constrói"
        title={
          <>
            Não fazemos <GradientText>só site.</GradientText>
          </>
        }
        sub="Se existe um problema que pode ser resolvido com tecnologia, encontramos uma forma de construir a solução."
      />

      <StaggerGroup as="div" className="ph-service-grid ph-service-grid--even" stagger={0.09}>
        {SERVICOS.map((s, i) => (
          <article className="ph-service" key={s.n}>
            <StaggerItem index={i} className="ph-service-in" hover={false} scale={false} distance={18}>
              <p className="ph-tag ph-tag--dim">{s.n}</p>
              <h3>{s.nome}</h3>
              <p>
                {s.desc}
                {s.link && (
                  <>
                    {" "}
                    <a href={s.link} style={{ color: "var(--accent-soft)", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Ver os sistemas <span className="ph-arrow ph-arrow--right">→</span>
                    </a>
                  </>
                )}
              </p>
            </StaggerItem>
          </article>
        ))}
      </StaggerGroup>
    </section>
  );
}
