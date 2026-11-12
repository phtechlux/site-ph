// Heurística pra decidir, na primeira visita, se vale a pena sugerir o
// Modo Imersivo pro visitante. Nunca é 100% precisa (não existe API
// universal de "esse aparelho é fraco") — por isso ela só é usada pra
// OFERECER o modo pesado, nunca pra ativá-lo sozinha. O padrão de toda
// primeira visita é o Modo Fluido; essa função só decide se aparece o
// convite discreto pra trocar.

// navigator.deviceMemory: só existe no Chrome/Edge/Opera (Safari e Firefox
// nunca implementaram, de propósito, por privacidade) — quando existe, vem
// arredondado pra baixo em potência de 2 (um PC de 6GB reporta "4").
// navigator.hardwareConcurrency: suportado em praticamente todo navegador
// moderno (Chrome, Firefox, Safari incluso) — é o sinal mais confiável que
// temos pra cobrir iPhone também.
function sinaisDeHardwareFraco() {
  if (typeof navigator === "undefined") return false;
  const memoria = navigator.deviceMemory;
  if (typeof memoria === "number" && memoria <= 4) return true;
  const nucleos = navigator.hardwareConcurrency;
  if (typeof nucleos === "number" && nucleos <= 4) return true;
  return false;
}

// Benchmark síncrono minúsculo (leva no máximo uns 30-40ms mesmo em
// aparelho fraco, então não trava nada visível) — mede quanto tempo o
// dispositivo leva pra fazer uma conta simples repetida. Serve de sinal
// extra pra quando o navegador não expõe deviceMemory/hardwareConcurrency
// úteis (ex: iPhone mais antigo com poucos núcleos "úteis" mas relatados
// como muitos, ou vice-versa).
//
// O limiar é generoso de propósito: o custo de errar pra cima (convidar um
// aparelho mediano) é baixo — é só um convite opcional, a pessoa decide, e
// dá pra voltar pro Fluido a qualquer momento no toggle da navbar. Testado
// em ambiente headless/sandboxed (CPU mais devagar que um browser normal)
// e ficou perto de 30ms mesmo com hardware "forte" simulado.
const LIMIAR_BENCHMARK_MS = 45;

function medirDesempenho() {
  try {
    const inicio = performance.now();
    let soma = 0;
    for (let i = 0; i < 1_500_000; i++) soma += Math.sqrt(i);
    // referencia soma pra o motor não otimizar o loop inteiro fora
    if (soma < 0) console.log(soma);
    return performance.now() - inicio;
  } catch {
    return 0;
  }
}

// true = "parece aguentar o modo imersivo tranquilo". Roda só uma vez, de
// preferência já fora do caminho crítico de primeira renderização (ver
// ExperienciaContext, que chama isso dentro de um requestIdleCallback).
export function dispositivoPareceCapaz() {
  if (sinaisDeHardwareFraco()) return false;
  const duracaoBenchmark = medirDesempenho();
  return duracaoBenchmark < LIMIAR_BENCHMARK_MS;
}
