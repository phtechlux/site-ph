import { useRef, useState } from "react";
import { StaggerGroup, StaggerItem } from "../motion/system";
import { Badge, Button, GradientText, SectionHead } from "./ui";

// Sem foto de fundador de propósito: o design-guide é explícito, a marca não
// pode ficar presa à imagem pessoal de quem criou. A credibilidade vem do texto.
const EMAIL = "phtechlux@gmail.com";
const STACK = ["HTML5", "CSS3", "JavaScript", "React", "Python", "MySQL", "REST", "Git", "WhatsApp API"];

function Tile({ index, className = "", span = 2, children, ...rest }) {
  return (
    <StaggerItem
      index={index}
      hover={false}
      scale={false}
      className={"ph-bento " + className}
      style={{ gridColumn: `span ${span}`, ...rest.style }}
    >
      {children}
    </StaggerItem>
  );
}

export default function Sobre() {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef(null);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Sem acesso à área de transferência: abre o e-mail em vez de fingir que copiou.
      window.location.href = `mailto:${EMAIL}`;
      return;
    }
    setCopiado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiado(false), 2200);
  }

  return (
    <section id="sobre" className="kit-section">
      <SectionHead
        tag="Sobre a PH"
        title={
          <>
            Um estúdio pequeno, <GradientText>construído pra durar.</GradientText>
          </>
        }
      />

      <StaggerGroup as="div" className="kit-bento" stagger={0.09} viewportAmount={0.05}>
        <Tile index={0} span={4} className="ph-bento--bottom" style={{ gridRow: "span 2", minHeight: 400 }}>
          <div className="ph-bento-bg kit-bento-img" aria-hidden="true" style={{ backgroundImage: "url(/frames/frame-133.webp)" }} />
          <h3>Tecnologia sem intermediário e sem jargão.</h3>
          <p style={{ maxWidth: "52ch" }}>
            Cada projeto passa pela mesma pessoa do primeiro contato até a solução no ar — sem camada de agência no meio.
          </p>
        </Tile>

        <Tile index={1}>
          <div className="ph-bento-bg ph-bento-bg--glow" aria-hidden="true" />
          <p className="ph-tag ph-tag--dim">01</p>
          <h3>Direto</h3>
          <p>Você fala com quem desenvolve, do primeiro contato até o site no ar.</p>
        </Tile>

        <Tile index={2}>
          <div className="ph-bento-bg ph-bento-bg--grid" aria-hidden="true" />
          <p className="ph-tag ph-tag--dim">02</p>
          <h3>Honesto</h3>
          <p>Sem inflar portfólio, sem prometer prazo ou resultado que não dá pra cumprir.</p>
        </Tile>

        <Tile index={3}>
          <p className="ph-tag ph-tag--dim">03</p>
          <h3>Em construção</h3>
          <p>A PH cresce a cada projeto — mas a essência de atendimento não muda.</p>
        </Tile>

        <Tile index={4} className="ph-bento--center">
          <div className="ph-bento-bg ph-bento-bg--glow" aria-hidden="true" />
          <h3 style={{ maxWidth: "16ch" }}>Quer começar um projeto junto?</h3>
          <Button variant="surface" size="sm" type="button" onClick={copiar}>
            {copiado ? "E-mail copiado ✓" : "Copiar meu e-mail"}
          </Button>
        </Tile>

        <Tile index={5} className="kit-bento-stack">
          <div className="kit-bento-stack-tit">
            <p className="ph-tag ph-tag--dim">Stack</p>
            <h3>Ferramentas do dia a dia</h3>
          </div>
          <div className="kit-bento-stack-cols">
            {STACK.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </Tile>
      </StaggerGroup>
    </section>
  );
}
