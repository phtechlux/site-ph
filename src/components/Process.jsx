import { useState } from "react";
import { StaggerGroup, StaggerItem } from "../motion/system";
import { GradientText, SectionHead, cx } from "./ui";

const PASSOS = [
  { n: "01", nome: "Entender", desc: "Entender o negócio, o problema ou a ideia — antes de pensar em solução." },
  { n: "02", nome: "Planejar", desc: "Definir a melhor solução digital pro problema real, sem exagero de escopo." },
  { n: "03", nome: "Construir", desc: "Design, desenvolvimento e testes — com você acompanhando o progresso." },
  { n: "04", nome: "Entregar", desc: "Publicação, ajustes finais e acompanhamento depois do ar." },
];

const CANTOS = ["tl", "tr", "bl", "br"];

export default function Process() {
  const [ativo, setAtivo] = useState(0);

  return (
    <section id="processo" className="kit-section">
      <SectionHead
        tag="Como funciona"
        title={
          <>
            Do problema ao <GradientText>produto digital.</GradientText>
          </>
        }
      />

      <StaggerGroup as="ol" className="kit-phases" stagger={0.08}>
        {PASSOS.map((p, i) => (
          <StaggerItem
            as="li"
            index={i}
            key={p.n}
            hover={false}
            className={cx("ph-phase", ativo === i && "is-active")}
            onMouseEnter={() => setAtivo(i)}
          >
            {CANTOS.map((c) => (
              <span key={c} className={"ph-cross ph-cross--" + c} aria-hidden="true" />
            ))}
            <p className="ph-tag ph-tag--dim">{p.n}</p>
            <h3>{p.nome}</h3>
            <p>{p.desc}</p>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
