import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dispositivoPareceCapaz } from "./detectarCapacidade";

// ---------------------------------------------------------------------
// Dois modos de experiência visual, mesmo conteúdo/layout/identidade nos
// dois — só muda a "coreografia" das animações de fundo:
//
//   fluida   — padrão de toda primeira visita. Fundo troca por seção (não
//              acompanha cada pixel do scroll), sem partículas reagindo ao
//              mouse continuamente. Leve o bastante pra qualquer aparelho.
//   imersiva — a experiência "uau" original: fundo esculpido pelo scroll
//              contínuo, motion blur, partículas reagindo ao cursor.
//
// Ninguém entra direto no modo pesado. Se o aparelho parece aguentar, um
// aviso discreto (ver SugestaoExperiencia.jsx) oferece a troca — a pessoa
// decide, nunca é automático. Quem prefere reduzir movimento no sistema
// operacional nem vê esse convite: fica sempre no fluido, sem ser incomodada.
// ---------------------------------------------------------------------

const CHAVE_MODO = "ph-experiencia";
const CHAVE_SUGESTAO_VISTA = "ph-experiencia-sugestao-vista";
const ATRASO_SUGESTAO_MS = 2500; // dá tempo da pessoa assentar na página antes de oferecer algo

const ExperienciaContext = createContext(null);

function lerStorage(chave) {
  try {
    return window.localStorage.getItem(chave);
  } catch {
    return null; // modo privado / storage bloqueado — segue sem persistir
  }
}
function escreverStorage(chave, valor) {
  try {
    window.localStorage.setItem(chave, valor);
  } catch {
    // sem storage disponível, tudo bem — só não vai lembrar na próxima visita
  }
}

export function ExperienciaProvider({ children }) {
  const reduzMovimento =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // modoEscolhido = a preferência (guardada ou padrão), independente de
  // reduced-motion — é o que o toggle da navbar mostra/mexe. modo (efetivo,
  // exposto lá embaixo) é o que os componentes de fato usam pra renderizar:
  // reduced-motion sempre vence, mesmo que "imersiva" esteja escolhida.
  // Hierarquia pedida: Fluida (padrão) → Imersiva (opção) → reduced-motion
  // (sempre por cima das duas).
  const [modoEscolhido, setModoEscolhido] = useState(() => {
    const salvo = lerStorage(CHAVE_MODO);
    return salvo === "imersiva" || salvo === "fluida" ? salvo : "fluida";
  });
  const [sugestaoAtiva, setSugestaoAtiva] = useState(false);
  const modo = reduzMovimento ? "fluida" : modoEscolhido;

  const escolhaExplicita = useMemo(() => {
    const salvo = lerStorage(CHAVE_MODO);
    return salvo === "imersiva" || salvo === "fluida";
  }, []);

  const definirModo = useCallback((novoModo) => {
    setModoEscolhido(novoModo);
    escreverStorage(CHAVE_MODO, novoModo);
    setSugestaoAtiva(false);
    escreverStorage(CHAVE_SUGESTAO_VISTA, "1");
  }, []);

  const alternarModo = useCallback(() => {
    definirModo(modoEscolhido === "imersiva" ? "fluida" : "imersiva");
  }, [modoEscolhido, definirModo]);

  const dispensarSugestao = useCallback(() => {
    setSugestaoAtiva(false);
    escreverStorage(CHAVE_SUGESTAO_VISTA, "1");
  }, []);

  // Convite automático pro Modo Imersivo — só roda uma vez, só quando faz
  // sentido: sem preferência salva ainda, sem reduced-motion, sem já ter
  // aparecido antes (mesmo que a pessoa nunca tenha respondido).
  useEffect(() => {
    if (reduzMovimento || escolhaExplicita) return;
    if (lerStorage(CHAVE_SUGESTAO_VISTA)) return;

    let cancelado = false;
    let timeoutSugestao = null;
    const agendar = window.requestIdleCallback || ((fn) => setTimeout(fn, 300));
    const cancelarAgendamento = window.cancelIdleCallback || clearTimeout;

    const idHandle = agendar(() => {
      if (cancelado) return;
      // aparelho não parece aguentar — não pergunta, não marca como "vista"
      // (assim, se um dia ela trocar de aparelho, o convite ainda pode aparecer)
      if (!dispositivoPareceCapaz()) return;
      timeoutSugestao = setTimeout(() => {
        if (!cancelado) setSugestaoAtiva(true);
      }, ATRASO_SUGESTAO_MS);
    });

    return () => {
      cancelado = true;
      if (timeoutSugestao) clearTimeout(timeoutSugestao);
      try {
        cancelarAgendamento(idHandle);
      } catch {
        /* setTimeout/clearTimeout como fallback já cobrem o caso comum */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const valor = useMemo(
    () => ({ modo, reduzMovimento, definirModo, alternarModo, sugestaoAtiva, dispensarSugestao }),
    [modo, reduzMovimento, definirModo, alternarModo, sugestaoAtiva, dispensarSugestao]
  );

  return <ExperienciaContext.Provider value={valor}>{children}</ExperienciaContext.Provider>;
}

export function useExperiencia() {
  const ctx = useContext(ExperienciaContext);
  if (!ctx) {
    // fallback seguro caso algum componente seja usado fora do provider
    // (ex: em isolamento/teste) — assume o modo mais leve.
    return {
      modo: "fluida",
      reduzMovimento: false,
      definirModo: () => {},
      alternarModo: () => {},
      sugestaoAtiva: false,
      dispensarSugestao: () => {},
    };
  }
  return ctx;
}
