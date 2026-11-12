// Fundo animado "grade viva": grade de 56px com pulsos elétricos percorrendo
// as linhas e cruzes acendendo perto do mouse. Canvas fixo na página inteira.
// Pausa com a aba oculta; com prefers-reduced-motion desenha um quadro parado.
import { useEffect, useRef } from "react";

const LINHA = "167, 173, 202";
const ELETRICO = "91, 124, 255";
const CELULA = 56;

function criarCena(W, H) {
  const c = CELULA;
  const cols = Math.ceil(W / c);
  const rows = Math.ceil(H / c);
  const total = Math.max(5, Math.min(16, Math.round((W * H) / 80000)));
  const nova = () => {
    const h = Math.random() < 0.5;
    return {
      i: Math.floor(Math.random() * cols),
      j: Math.floor(Math.random() * rows),
      dx: h ? (Math.random() < 0.5 ? 1 : -1) : 0,
      dy: h ? 0 : Math.random() < 0.5 ? 1 : -1,
      u: Math.random(),
      v: 0.7 + Math.random() * 0.9,
      trail: [],
      L: 70 + Math.random() * 90,
    };
  };
  return { c, cols, rows, nova, pulsos: Array.from({ length: total }, nova), flashes: [] };
}

function desenhar(ctx, s, W, H, dt, m) {
  const { c } = s;
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${LINHA},0.045)`;
  ctx.beginPath();
  for (let x = 0.5; x < W; x += c) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
  }
  for (let y = 0.5; y < H; y += c) {
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();

  if (m.on) {
    const r = 150;
    const i0 = Math.max(0, Math.floor((m.x - r) / c));
    const i1 = Math.ceil((m.x + r) / c);
    const j0 = Math.max(0, Math.floor((m.y - r) / c));
    const j1 = Math.ceil((m.y + r) / c);
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const x = i * c + 0.5;
        const y = j * c + 0.5;
        const d = Math.hypot(x - m.x, y - m.y);
        if (d < r) {
          ctx.strokeStyle = `rgba(${ELETRICO},${(1 - d / r) ** 2 * 0.7})`;
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
      }
    }
  }

  for (let k = s.flashes.length - 1; k >= 0; k--) {
    const f = s.flashes[k];
    f.life -= dt / 1.4;
    if (f.life <= 0) {
      s.flashes.splice(k, 1);
      continue;
    }
    ctx.fillStyle = `rgba(${ELETRICO},${f.life * 0.55})`;
    ctx.fillRect(f.i * c + 0.5 - 1.5, f.j * c + 0.5 - 1.5, 3, 3);
  }

  for (let k = 0; k < s.pulsos.length; k++) {
    const p = s.pulsos[k];
    p.u += (p.v * dt * 60) / c;
    while (p.u >= 1) {
      p.u -= 1;
      p.trail.unshift([p.i, p.j]);
      if (p.trail.length > 5) p.trail.pop();
      p.i += p.dx;
      p.j += p.dy;
      s.flashes.push({ i: p.i, j: p.j, life: 1 });
      if (Math.random() < 0.28) {
        const h = p.dx !== 0;
        const sg = Math.random() < 0.5 ? 1 : -1;
        p.dx = h ? 0 : sg;
        p.dy = h ? sg : 0;
      }
    }
    if (p.i < -2 || p.j < -2 || p.i > s.cols + 2 || p.j > s.rows + 2) {
      s.pulsos[k] = s.nova();
      continue;
    }
    const hx = (p.i + p.dx * p.u) * c + 0.5;
    const hy = (p.j + p.dy * p.u) * c + 0.5;
    const pts = [[hx, hy], [p.i * c + 0.5, p.j * c + 0.5], ...p.trail.map(([i, j]) => [i * c + 0.5, j * c + 0.5])];
    let acc = 0;
    ctx.lineWidth = 1.2;
    for (let q = 0; q < pts.length - 1 && acc < p.L; q++) {
      const [ax, ay] = pts[q];
      const [bx, by] = pts[q + 1];
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 0.01) continue;
      const a0 = Math.max(0, 1 - acc / p.L);
      const a1 = Math.max(0, 1 - (acc + len) / p.L);
      const g = ctx.createLinearGradient(ax, ay, bx, by);
      g.addColorStop(0, `rgba(${ELETRICO},${a0 * 0.6})`);
      g.addColorStop(1, `rgba(${ELETRICO},${a1 * 0.6})`);
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      acc += len;
    }
    ctx.fillStyle = `rgba(${ELETRICO},0.12)`;
    ctx.beginPath();
    ctx.arc(hx, hy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(199,210,254,0.85)";
    ctx.beginPath();
    ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function GradeViva() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999, on: false };
    let W = 0;
    let H = 0;
    let cena = null;
    let raf = null;
    let ultimo = performance.now();

    const iniciar = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cena = criarCena(W, H);
    };
    const quadro = (dt) => {
      ctx.clearRect(0, 0, W, H);
      desenhar(ctx, cena, W, H, dt, mouse);
    };
    const loop = (agora) => {
      const dt = Math.min(0.05, (agora - ultimo) / 1000);
      ultimo = agora;
      quadro(dt);
      raf = requestAnimationFrame(loop);
    };
    const comecar = () => {
      if (raf === null && !reduz && document.visibilityState === "visible") {
        ultimo = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const parar = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const aoMover = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
    };
    const aoSair = () => {
      mouse.on = false;
    };
    const aoRedimensionar = () => {
      // No celular a barra de endereço some/volta no scroll e dispara resize:
      // recriar a cena aí faria o fundo piscar a cada rolagem.
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 150) return;
      iniciar();
      if (reduz) quadro(0);
    };
    const aoMudarAba = () => (document.visibilityState === "visible" ? comecar() : parar());

    iniciar();
    if (reduz) {
      quadro(0);
    } else {
      comecar();
      window.addEventListener("mousemove", aoMover, { passive: true });
      document.addEventListener("mouseleave", aoSair);
    }
    window.addEventListener("resize", aoRedimensionar);
    document.addEventListener("visibilitychange", aoMudarAba);

    return () => {
      parar();
      window.removeEventListener("mousemove", aoMover);
      document.removeEventListener("mouseleave", aoSair);
      window.removeEventListener("resize", aoRedimensionar);
      document.removeEventListener("visibilitychange", aoMudarAba);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="kit-bg-fixed" />;
}
