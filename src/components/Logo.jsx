// Monograma real, extraído do painel de construção vetorial (imagens/vetororigemphlogo.jpg
// na raiz do PhOS): P e H compartilhando o traço, recortado com fundo transparente.
export default function Logo({ withLabel = false, size = "md" }) {
  return (
    <span className={`ph-logo${size !== "md" ? ` ph-logo--${size}` : ""}`}>
      <span className="ph-logo-mark" role="img" aria-label="PH" />
      {withLabel && <span className="ph-logo-label">TECNOLOGIA</span>}
    </span>
  );
}
