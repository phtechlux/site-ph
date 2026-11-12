// Peças do design system PH v2 (classes .ph-* em App.css).
import { FadeUp } from "../motion/system";

export const cx = (...a) => a.filter(Boolean).join(" ");

export function Button({ variant = "primary", size = "md", arrow, href, className, children, ...rest }) {
  const Tag = href ? "a" : "button";
  const glyph = arrow === "out" ? "↗" : arrow === "right" ? "→" : null;
  return (
    <Tag href={href} className={cx("ph-btn", "ph-btn--" + variant, size === "sm" && "ph-btn--sm", className)} {...rest}>
      {children}
      {glyph && (
        <span className={cx("ph-arrow", "ph-arrow--" + arrow)} aria-hidden="true">
          {glyph}
        </span>
      )}
    </Tag>
  );
}

export function MonoTag({ tone = "accent", wide = false, as: Tag = "p", className, children, ...rest }) {
  return (
    <Tag className={cx("ph-tag", tone !== "accent" && "ph-tag--" + tone, wide && "ph-tag--wide", className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Badge({ dot = false, className, children, tone, ...rest }) {
  return (
    <span className={cx("ph-badge", tone === "accent" && "ph-badge--accent", className)} {...rest}>
      {dot && <span className="ph-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function GradientText({ children }) {
  return <span className="ph-gradient-text ph-gradient-text--bright">{children}</span>;
}

// Título de seção centralizado: eyebrow mono, título, subtítulo, entrando em sequência.
export function SectionHead({ tag, title, sub }) {
  return (
    <div className="ph-section-head ph-section-head--center">
      {tag && (
        <FadeUp as="p" className="ph-tag">
          {tag}
        </FadeUp>
      )}
      {title && (
        <FadeUp as="h2" delay={0.08}>
          {title}
        </FadeUp>
      )}
      {sub && (
        <FadeUp as="p" delay={0.16} className="ph-section-sub">
          {sub}
        </FadeUp>
      )}
    </div>
  );
}

export function BrowserMock({ url, badge, bodyPadding = true, className, children, ...rest }) {
  return (
    <div className={cx("ph-mock", className)} {...rest}>
      <div className="ph-mock-bar">
        <div className="ph-mock-dots">
          <span />
          <span />
          <span />
        </div>
        {url && <div className="ph-mock-url">{url}</div>}
        {badge && <Badge tone="accent">{badge}</Badge>}
      </div>
      <div className={bodyPadding ? "ph-mock-body" : undefined}>{children}</div>
    </div>
  );
}

export function CarouselDots({ items = [], active = 0, onSelect }) {
  return (
    <div className="ph-dots" role="tablist">
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={i === active}
          className={cx("ph-dot", i === active && "is-active")}
          onClick={() => onSelect(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
