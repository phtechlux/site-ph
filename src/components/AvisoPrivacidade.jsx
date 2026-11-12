import { useState } from "react";

// O site não usa cookie de rastreamento, então não há o que aceitar ou recusar:
// isto só informa. Se um dia entrar analytics ou pixel, ele só pode carregar
// depois de um consentimento de verdade, com opção de recusar.
const CHAVE = "ph-aviso-privacidade";

function jaViu() {
  try {
    return window.localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

export default function AvisoPrivacidade() {
  const [aberto, setAberto] = useState(() => !jaViu());
  if (!aberto) return null;

  function fechar() {
    try {
      window.localStorage.setItem(CHAVE, "1");
    } catch {
      // sem storage, o aviso só volta na próxima visita
    }
    setAberto(false);
  }

  return (
    <aside className="ph-aviso" aria-label="Aviso de privacidade">
      <p>
        Este site não usa cookies de rastreamento nem anúncios. Só guarda no seu aparelho as preferências de
        exibição. <a href="/cookies.html">Saiba mais</a>
      </p>
      <button type="button" className="ph-btn ph-btn--surface ph-btn--sm" onClick={fechar}>
        Entendi
      </button>
    </aside>
  );
}
