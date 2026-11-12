// Motion system central do site — todo mundo usa esses componentes em vez
// de inventar animação nova em cada seção. Baseado em motion/react
// (Framer Motion). Ver identidade/design-guide.md pro resto do estilo.
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useExperiencia } from "../experiencia/ExperienciaContext";

// Easing padrão do site inteiro: começa rápido, desacelera suave no final.
// Mesma curva usada no CSS (App.css) pras microinterações de hover.
export const EASE = [0.22, 1, 0.36, 1];

// Distâncias de translateY assimétricas pros cards — cria a sensação de
// "skyline" subindo em vez de tudo se movendo igual (item 3 do briefing).
const OFFSETS = [90, 60, 110, 75, 95, 65, 100, 85];

// No mobile, tudo fica mais sutil e mais rápido: menos distância, menos
// atraso, sem parallax pesado. Um hook só cuida disso pro sistema inteiro.
function useResponsiveMotion() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const update = () => setScale(mq.matches ? 0.45 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return scale;
}

/**
 * Entrada de um elemento único: fade + translateY + blur leve, saindo de
 * "borrado e deslocado" pra "nítido no lugar". Usar `immediate` pros
 * elementos acima da dobra (navbar, hero) que animam ao montar; sem isso,
 * anima quando entra no viewport durante o scroll.
 */
export function FadeUp({
  as = "div",
  children,
  delay = 0,
  duration = 0.8,
  distance = 20,
  blur = 4,
  once = true,
  viewportAmount = 0.35,
  immediate = false,
  className,
  ...rest
}) {
  const reduzMovimento = useReducedMotion();
  const escala = useResponsiveMotion();
  const Comp = motion[as] ?? motion.div;

  if (reduzMovimento) {
    const propsReduzidas = immediate
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once, amount: viewportAmount },
        };
    return (
      <Comp className={className} transition={{ duration: 0.2, delay: 0 }} {...propsReduzidas} {...rest}>
        {children}
      </Comp>
    );
  }

  const hidden = {
    opacity: 0,
    y: distance * escala,
    filter: escala < 1 ? "blur(0px)" : `blur(${blur}px)`,
  };
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };

  const gatilho = immediate
    ? { animate: visible }
    : { whileInView: visible, viewport: { once, amount: viewportAmount } };

  return (
    <Comp
      className={className}
      initial={hidden}
      transition={{ duration, delay, ease: EASE }}
      {...gatilho}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Container de lista/grid — coordena o stagger entre os StaggerItem filhos.
 * Dispara quando entra no viewport (ou imediatamente com `immediate`).
 */
export function StaggerGroup({
  as = "div",
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  once = true,
  viewportAmount = 0.15,
  immediate = false,
  ...rest
}) {
  const reduzMovimento = useReducedMotion();
  const Comp = motion[as] ?? motion.div;

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduzMovimento ? 0 : stagger,
        delayChildren: reduzMovimento ? 0 : delayChildren,
      },
    },
  };

  const gatilho = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once, amount: viewportAmount } };

  return (
    <Comp className={className} initial="hidden" variants={variants} {...gatilho} {...rest}>
      {children}
    </Comp>
  );
}

/**
 * Item dentro de um StaggerGroup. `index` decide o quão "alto" ele parte —
 * valores diferentes por card criam o efeito de skyline (item 3 do briefing).
 *
 * `hover`, quando true (padrão), também cuida da microinteração de
 * hover/tap do card (item 7 do briefing) — feita aqui, via o mesmo motion
 * value que a entrada usa, pra nunca conflitar com transform via CSS.
 */
export function StaggerItem({
  as = "div",
  children,
  index = 0,
  className,
  scale = true,
  duration = 0.9,
  hover = true,
  distance,
  ...rest
}) {
  const reduzMovimento = useReducedMotion();
  const escala = useResponsiveMotion();
  const Comp = motion[as] ?? motion.div;
  const distancia = (distance ?? OFFSETS[index % OFFSETS.length]) * escala;

  const variants = reduzMovimento
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: distancia, scale: scale ? 0.97 : 1 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration, ease: EASE } },
      };

  const interacao =
    hover && !reduzMovimento
      ? {
          whileHover: { y: -4, scale: 1.01, transition: { duration: 0.28, ease: EASE } },
          whileTap: { scale: 0.99, transition: { duration: 0.15, ease: EASE } },
        }
      : {};

  return (
    <Comp className={className} variants={variants} {...interacao} {...rest}>
      {children}
    </Comp>
  );
}

/**
 * Parallax vertical bem sutil pra dar profundidade — pensado pra elementos
 * gráficos/decorativos, não pra conteúdo de texto. Some sozinho no mobile
 * e com prefers-reduced-motion.
 */
export function Parallax({ children, offset = 20, className, style, ...rest }) {
  const reduzMovimento = useReducedMotion();
  const { modo } = useExperiencia();
  const escala = useResponsiveMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Modo Fluido: elemento fica parado (mesma lógica do reduced-motion) —
  // menos uma camada de scroll-linked transform pra manter, sem perder o
  // elemento decorativo em si.
  const distancia = reduzMovimento || modo === "fluida" ? 0 : offset * escala;
  const y = useTransform(scrollYProgress, [0, 1], [-distancia, distancia]);

  return (
    <motion.div ref={ref} style={{ ...style, y }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
