import { useEffect, useRef } from "react";
import { useExperiencia } from "../experiencia/ExperienciaContext";

const TOTAL_FRAMES = 240;
const framePath = (n) => `/frames/frame-${String(n).padStart(3, "0")}.webp`;

// Escolhe entre as duas coreografias (ver experiencia/ExperienciaContext) —
// mesmo conteúdo visual (a mesma sequência de frames da logo 3D), só muda
// o quanto ela acompanha o scroll.
export default function ScrollFrames() {
  const { modo } = useExperiencia();
  return modo === "imersiva" ? <ScrollFramesImersivo /> : <ScrollFramesFluido />;
}

// ---------------------------------------------------------------------
// Modo Fluido — v2. A primeira versão trocava entre 8 frames-chave via
// crossfade de CSS conforme o scroll, mas ficou estranha: crossfade só
// fica suave entre imagens parecidas, e frames espaçados de uma rotação
// 3D inteira são bem diferentes entre si — lia como "foto trocada", não
// como "câmera girando" (feedback direto do Pedro, 2026-09-04).
//
// Solução: em vez de recortar a animação em fotos discretas, ela vira um
// vídeo de verdade — os mesmos 240 frames, gerados como loop "boomerang"
// (toca pra frente, depois de trás pra frente, sem corte no ponto de
// loop) via ffmpeg. Roda sozinha, sem ligação com o scroll — é a câmera
// "parada na cena, respirando" em vez de "cortando entre cenas". Decode
// de vídeo é acelerado por hardware em praticamente qualquer aparelho
// (ao contrário de decodificar N imagens em JS, que é trabalho de CPU
// pura), então continua bem mais barato que o Modo Imersivo mesmo sendo
// uma animação contínua de verdade.
const VIDEO_FLUIDO = "/video/logo-boomerang.mp4";
const FRAME_POSTER = 120; // frame único usado como poster do vídeo e como imagem fixa pra quem reduz movimento

function ScrollFramesFluido() {
  const { reduzMovimento } = useExperiencia();

  // Reduced-motion: nada de loop contínuo — só a imagem parada (mesmo
  // espírito do resto do site nesse modo: presença visual, zero movimento).
  if (reduzMovimento) {
    return (
      <div className="scroll-frames-wrap" aria-hidden="true">
        <img src={framePath(FRAME_POSTER)} alt="" className="scroll-frames-still" />
      </div>
    );
  }

  return (
    <div className="scroll-frames-wrap" aria-hidden="true">
      <video
        className="scroll-frames-video"
        src={VIDEO_FLUIDO}
        poster={framePath(FRAME_POSTER)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}

// Quantos frames em volta do alvo atual ficam garantidamente carregados
// (cobre scroll rápido pra frente/trás sem esperar rede) e a partir de
// que distância um frame carregado é descartado da memória. 1920×1080
// decodificado pesa uns 8MB de RAM cada — manter os 240 ao mesmo tempo
// passaria de 1,5GB e podia travar celular mais fraco, então em vez de
// carregar tudo de uma vez só, mantém uma janela deslizante em volta de
// onde o usuário está.
const JANELA_CARREGAR = 20;
const JANELA_DESCARTAR = 55;

// Motion blur: quanto mais rápido o scroll, mais desfocado o frame —
// disfarça qualquer imperfeição de compressão durante o movimento e dá
// uma sensação de câmera/vídeo de verdade. Some rápido assim que o scroll
// para, voltando nítido.
const BLUR_MAXIMO_PX = 9;
const BLUR_FATOR = 5; // px de blur por unidade de velocidade (px de scroll / ms)
const BLUR_DECAIMENTO = 0.82; // por frame de animação (~60fps)
const BLUR_SUAVIZACAO = 0.35; // o quanto o blur desenhado "persegue" o alvo a cada frame

// Fundo de tela cheia que troca de frame conforme o scroll — frame 1 no
// topo da página, frame 240 no final. É a animação 3D da logo (240 frames
// extraídos do vídeo de referência) "esculpida" pelo scroll. A logo já fica
// naturalmente puxada pro lado direito de cada frame, então o texto do
// site fica numa coluna à esquerda sobre a parte mais escura da imagem —
// sem brigar com ela. Roda em qualquer tamanho de tela, celular incluso.
//
// Esse é o Modo Imersivo (ver experiencia/ExperienciaContext) — pesado de
// propósito (decodifica/desenha frame novo a cada scroll, motion blur,
// janela de até ~40 imagens na memória). Só roda quando o visitante ativa
// ou aceita o convite; o padrão de toda primeira visita é o Fluido, acima.
function ScrollFramesImersivo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // O backing store do canvas PRECISA acompanhar o devicePixelRatio real
    // (padrão pra qualquer canvas nítido) — o Windows costuma rodar telas
    // 1920×1080 a 125%/150% de escala por padrão, então o navegador já
    // reporta um devicePixelRatio > 1 mesmo em monitor Full HD. Sem
    // acompanhar isso, o canvas desenha em baixa resolução e o próprio
    // navegador estica o resultado pra caber na tela física — borrando de
    // um jeito diferente do problema original, mas com o mesmo efeito.
    // O que realmente evita esticar além da imagem-fonte (1920×1080) é
    // calcular a escala em cima de pixels de DISPOSITIVO, não de CSS.
    const dpr = window.devicePixelRatio || 1;
    const FONTE_LARGURA = 1920;
    const FONTE_ALTURA = 1080;
    const ESCALA_MAXIMA = 1.5; // além disso, prefere sobrar borda a esticar demais

    const imagens = new Array(TOTAL_FRAMES + 1); // índice 1..240
    const carregada = new Array(TOTAL_FRAMES + 1).fill(false);
    const carregando = new Array(TOTAL_FRAMES + 1).fill(false);
    let frameAtualDesenhado = 0;
    let ultimoAlvo = 1;
    let larguraCss = 0;
    let alturaCss = 0;
    let rafPendente = false;

    // estado do motion blur
    let ultimoScrollY = window.scrollY;
    let ultimoTempo = performance.now();
    let blurAlvo = 0;
    let blurAtual = 0;
    let loopMotionAtivo = false;

    function ajustarTamanho() {
      larguraCss = canvas.clientWidth;
      alturaCss = canvas.clientHeight;
      canvas.width = larguraCss * dpr;
      canvas.height = alturaCss * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    // "cover": preenche a tela cortando o excesso, sem distorcer — com um
    // teto de ampliação (medido em pixels de tela de verdade) pra nunca
    // esticar bem além da resolução nativa da imagem-fonte. Em monitores
    // muito largos/ultrawide, prefere sobrar uma borda escura discreta.
    function desenhar(indice, blurPx = 0) {
      const img = imagens[indice];
      if (!img || !carregada[indice] || !larguraCss || !alturaCss) return;
      if (alturaCss >= larguraCss) {
        desenharEmPe(img, indice, blurPx);
        return;
      }
      const escalaDispNecessaria = Math.max(
        (larguraCss * dpr) / FONTE_LARGURA,
        (alturaCss * dpr) / FONTE_ALTURA
      );
      const escalaDisp = Math.min(escalaDispNecessaria, ESCALA_MAXIMA);
      const escala = escalaDisp / dpr; // volta pra "espaço CSS", que é o que o transform já multiplica
      const w = img.width * escala;
      const h = img.height * escala;
      const x = (larguraCss - w) / 2;
      const y = (alturaCss - h) / 2;
      ctx.fillStyle = "#0b0d10";
      ctx.fillRect(0, 0, larguraCss, alturaCss);
      ctx.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(1)}px)` : "none";
      ctx.drawImage(img, x, y, w, h);
      ctx.filter = "none";
      frameAtualDesenhado = indice;
    }

    // Tela em pé: mesmos números do CSS do Modo Fluido (App.css). A cena inteira
    // da logo na proporção real, centralizada, com as bordas sumindo no fundo.
    function desenharEmPe(img, indice, blurPx) {
      const w = larguraCss * 1.6;
      const h = (w * img.height) / img.width;
      const x = larguraCss / 2 - w * 0.645;
      const y = alturaCss * 0.44 - h / 2;
      ctx.fillStyle = "#0b0d10";
      ctx.fillRect(0, 0, larguraCss, alturaCss);
      ctx.filter = blurPx > 0.05 ? `blur(${blurPx.toFixed(1)}px)` : "none";
      ctx.drawImage(img, x, y, w, h);
      ctx.filter = "none";
      const faixa = h * 0.16;
      for (const [y0, y1] of [[y, y + faixa], [y + h, y + h - faixa]]) {
        const g = ctx.createLinearGradient(0, y0, 0, y1);
        g.addColorStop(0, "#0b0d10");
        g.addColorStop(1, "rgba(11,13,16,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, Math.min(y0, y1) - 1, larguraCss, faixa + 2);
      }
      frameAtualDesenhado = indice;
    }

    function indiceParaScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progresso = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      return 1 + Math.round(progresso * (TOTAL_FRAMES - 1));
    }

    // Se o frame exato ainda não carregou, usa o mais próximo já disponível
    // em vez de deixar o fundo "sumir" por um instante.
    function melhorFrameDisponivel(alvo) {
      if (carregada[alvo]) return alvo;
      for (let raio = 1; raio < TOTAL_FRAMES; raio++) {
        if (carregada[alvo - raio]) return alvo - raio;
        if (carregada[alvo + raio]) return alvo + raio;
      }
      return frameAtualDesenhado || null;
    }

    // Loop curto que só roda enquanto há blur em jogo — decai o alvo e
    // suaviza o valor desenhado até os dois chegarem perto de zero, aí
    // desliga sozinho (não fica consumindo bateria à toa).
    function passoMotion() {
      blurAlvo *= BLUR_DECAIMENTO;
      blurAtual += (blurAlvo - blurAtual) * BLUR_SUAVIZACAO;

      const frame = melhorFrameDisponivel(ultimoAlvo);
      if (frame) desenhar(frame, blurAtual);

      if (blurAtual > 0.05 || blurAlvo > 0.05) {
        requestAnimationFrame(passoMotion);
      } else {
        blurAtual = 0;
        blurAlvo = 0;
        loopMotionAtivo = false;
        if (frame) desenhar(frame, 0); // garante o frame final 100% nítido
      }
    }

    function iniciarLoopMotion() {
      if (loopMotionAtivo) return;
      loopMotionAtivo = true;
      requestAnimationFrame(passoMotion);
    }

    let cancelado = false;

    function carregarFrame(n) {
      if (n < 1 || n > TOTAL_FRAMES || carregada[n] || carregando[n]) return;
      carregando[n] = true;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelado) return;
        carregando[n] = false;
        carregada[n] = true;
        imagens[n] = img;
        if (indiceParaScroll() === n) desenhar(n, blurAtual);
        else if (frameAtualDesenhado === 0) desenhar(melhorFrameDisponivel(ultimoAlvo), blurAtual);
      };
      img.onerror = () => {
        carregando[n] = false;
      };
      img.src = framePath(n);
    }

    // Descarta frames longe do ponto atual pra manter a memória sob
    // controle — se o usuário rolar de volta pra lá depois, o navegador já
    // tem o arquivo no cache HTTP, só recarrega a decodificação.
    function descartarLonge(alvo) {
      for (let n = 1; n <= TOTAL_FRAMES; n++) {
        if (carregada[n] && Math.abs(n - alvo) > JANELA_DESCARTAR) {
          carregada[n] = false;
          imagens[n] = null;
        }
      }
    }

    function garantirJanela(alvo) {
      const inicio = Math.max(1, alvo - JANELA_CARREGAR);
      const fim = Math.min(TOTAL_FRAMES, alvo + JANELA_CARREGAR);
      // do centro pra fora, pra priorizar o frame exato e os mais próximos
      carregarFrame(alvo);
      for (let d = 1; d <= JANELA_CARREGAR; d++) {
        if (alvo - d >= inicio) carregarFrame(alvo - d);
        if (alvo + d <= fim) carregarFrame(alvo + d);
      }
      descartarLonge(alvo);
    }

    function aoScroll() {
      if (!reduzMovimento) {
        const agora = performance.now();
        const deltaT = agora - ultimoTempo;
        const deltaY = Math.abs(window.scrollY - ultimoScrollY);
        if (deltaT > 0) {
          const velocidade = deltaY / deltaT; // px por ms
          blurAlvo = Math.min(BLUR_MAXIMO_PX, velocidade * BLUR_FATOR);
          iniciarLoopMotion();
        }
        ultimoScrollY = window.scrollY;
        ultimoTempo = agora;
      }

      if (rafPendente) return;
      rafPendente = true;
      requestAnimationFrame(() => {
        rafPendente = false;
        const alvo = indiceParaScroll();
        ultimoAlvo = alvo;
        if (!loopMotionAtivo) {
          const disponivel = melhorFrameDisponivel(alvo);
          if (disponivel) desenhar(disponivel, blurAtual);
        }
        garantirJanela(alvo);
      });
    }

    function aoRedimensionar() {
      ajustarTamanho();
      desenhar(frameAtualDesenhado || 1, 0);
    }

    ajustarTamanho();
    garantirJanela(1);

    window.addEventListener("scroll", aoScroll, { passive: true });
    window.addEventListener("resize", aoRedimensionar);

    return () => {
      cancelado = true;
      window.removeEventListener("scroll", aoScroll);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, []);

  return (
    <div className="scroll-frames-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="scroll-frames" />
    </div>
  );
}
