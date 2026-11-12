import { useEffect } from "react";
import { useExperiencia } from "../experiencia/ExperienciaContext";
import { Button } from "./ui";

// Convite discreto que só aparece quando o site detecta (por heurística,
// nunca com certeza absoluta) que o aparelho aguenta o Modo Imersivo, e só
// na primeira vez, pra quem ainda não escolheu um modo manualmente. Some
// sozinho se ignorado; nunca bloqueia nada, nunca aparece de novo depois
// de uma decisão (ativar ou dispensar).
const AUTO_ESCONDER_MS = 9000;

export default function SugestaoExperiencia() {
  const { sugestaoAtiva, dispensarSugestao, definirModo } = useExperiencia();

  useEffect(() => {
    if (!sugestaoAtiva) return;
    const id = setTimeout(dispensarSugestao, AUTO_ESCONDER_MS);
    return () => clearTimeout(id);
  }, [sugestaoAtiva, dispensarSugestao]);

  if (!sugestaoAtiva) return null;

  return (
    <div className="ph-prompt sugestao-experiencia" role="status">
      <p>Seu aparelho aguenta a experiência completa</p>
      <div className="ph-prompt-actions">
        <Button size="sm" onClick={() => definirModo("imersiva")}>
          Ativar
        </Button>
        <button type="button" className="ph-prompt-dismiss" onClick={dispensarSugestao}>
          Agora não
        </button>
      </div>
    </div>
  );
}
