import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Button, cx } from "./ui";
import { useExperiencia } from "../experiencia/ExperienciaContext";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#sistemas", label: "Sistemas" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#processo", label: "Processo" },
  { href: "#sobre", label: "Sobre" },
];

// Ordem das seções na página. O CRM fica debaixo do link "Sistemas".
const SECOES = ["servicos", "sistemas", "crm", "portfolio", "processo", "sobre", "contato"];

export default function Nav() {
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(null);
  const { modo, alternarModo, reduzMovimento } = useExperiencia();

  useEffect(() => {
    const aoRolar = () => {
      let atual = null;
      SECOES.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) atual = "#" + id;
      });
      setAtivo(atual === "#crm" ? "#sistemas" : atual);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const fechar = () => setAberto(false);

  return (
    <header className="ph-nav">
      <div className="ph-nav-inner">
        <a href="#topo" className="ph-nav-brand" onClick={fechar}>
          <Logo withLabel />
        </a>

        <nav className={cx("ph-nav-links", aberto && "is-open")}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={fechar}
              className={cx("ph-nav-link", ativo === link.href && "is-active")}
            >
              {link.label}
            </a>
          ))}
          <Button size="sm" href="#contato" onClick={fechar} className="ph-nav-cta-menu">
            Começar um projeto
          </Button>
        </nav>

        <div className="ph-nav-right">
          {/* Some por completo pra quem tem "reduzir movimento" ligado no
              sistema: essa preferência sempre vence (ver ExperienciaContext). */}
          {!reduzMovimento && (
            <button
              type="button"
              className={cx("ph-xp", modo === "imersiva" && "is-on")}
              onClick={alternarModo}
              aria-pressed={modo === "imersiva"}
              title="Alternar a experiência visual do site"
            >
              <span className="ph-xp-dot" aria-hidden="true" />
              <span>{modo === "imersiva" ? "Imersiva" : "Fluida"}</span>
            </button>
          )}

          <Button size="sm" href="#contato" onClick={fechar} className="ph-nav-cta">
            Começar um projeto
          </Button>

          <button
            type="button"
            className="ph-nav-toggle"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            onClick={() => setAberto((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
