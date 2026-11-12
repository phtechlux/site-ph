import { useEffect, useState } from "react";
import Logo from "./Logo";

const MONO = { fontFamily: "var(--font-mono)", color: "var(--text-dim)" };
const CHAVE_ANIMACAO = "ph-sem-animacao";

const LEGAIS = [
  ["/termos.html", "Termos de Serviço"],
  ["/privacidade.html", "Privacidade"],
  ["/cookies.html", "Cookies"],
  ["/reembolso.html", "Cancelamento e reembolso"],
];

function aplicarAnimacao(semAnimacao) {
  document.documentElement.classList.toggle("sem-animacao", semAnimacao);
  document.querySelectorAll("video").forEach((v) => {
    if (semAnimacao) v.pause();
    else v.play().catch(() => {});
  });
}

export default function Footer() {
  const [semAnimacao, setSemAnimacao] = useState(() => {
    try {
      return window.localStorage.getItem(CHAVE_ANIMACAO) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    aplicarAnimacao(semAnimacao);
  }, [semAnimacao]);

  function alternar() {
    const novo = !semAnimacao;
    try {
      window.localStorage.setItem(CHAVE_ANIMACAO, novo ? "1" : "0");
    } catch {
      // sem storage, vale só nesta visita
    }
    setSemAnimacao(novo);
  }

  return (
    <footer className="kit-footer">
      <div className="kit-footer-in">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Logo withLabel />
          <p style={{ ...MONO, fontSize: ".75rem" }}>Construindo soluções digitais.</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="kit-pill" href="https://wa.me/5561998433188" target="_blank" rel="noopener noreferrer">
            WhatsApp <span className="ph-arrow ph-arrow--out" aria-hidden="true">↗</span>
          </a>
          <a className="kit-pill" href="mailto:phtechlux@gmail.com">
            E-mail <span className="ph-arrow ph-arrow--out" aria-hidden="true">↗</span>
          </a>
          <a className="kit-pill" href="https://instagram.com/phtechlux" target="_blank" rel="noopener noreferrer">
            Instagram <span className="ph-arrow ph-arrow--out" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <nav className="kit-footer-in kit-footer-legal" aria-label="Documentos legais" style={{ marginTop: 24 }}>
        {LEGAIS.map(([href, rotulo]) => (
          <a key={href} href={href}>{rotulo}</a>
        ))}
        <a href="/acessibilidade.html"><span aria-hidden="true">♿︎ </span>Acessibilidade</a>
        <button type="button" onClick={alternar} aria-pressed={semAnimacao}>
          {semAnimacao ? "Ligar animações" : "Pausar animações"}
        </button>
      </nav>

      <div className="kit-footer-in" style={{ marginTop: 16 }}>
        <p style={{ ...MONO, fontSize: ".72rem", lineHeight: 1.6 }}>
          © {new Date().getFullYear()} PH é o nome comercial de Pedro Henrique Soares, profissional autônomo (pessoa física).
          {" "}Contato: phtechlux@gmail.com · (61) 99843-3188.
        </p>
      </div>
    </footer>
  );
}
