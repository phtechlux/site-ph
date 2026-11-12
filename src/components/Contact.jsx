import { useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { FadeUp } from "../motion/system";
import { Button, GradientText, SectionHead } from "./ui";

const CAMPOS_INICIAIS = {
  nome: "",
  empresa: "",
  tipo_projeto: "",
  objetivo: "",
  orcamento: "",
  descricao: "",
  contato: "",
  nao_sei_o_que_precisa: false,
};

// Tempo mínimo (ms) entre o formulário aparecer na tela e ser enviado.
// Bot preenche e manda em milissegundos; gente de verdade demora bem mais
// que isso pra digitar nome, WhatsApp e uma descrição.
const TEMPO_MINIMO_MS = 2500;

export default function Contact() {
  const [campos, setCampos] = useState(CAMPOS_INICIAIS);
  const [status, setStatus] = useState("idle"); // idle | enviando | sucesso | erro
  const [erro, setErro] = useState("");
  const [aceitou, setAceitou] = useState(false);
  // Campo-armadilha: fica escondido de gente de verdade (CSS + aria-hidden),
  // mas bots que preenchem tudo que encontram costumam cair nele.
  const [campoArmadilha, setCampoArmadilha] = useState("");
  const montadoEm = useRef(Date.now());

  function atualizar(campo) {
    return (evento) => {
      const valor = evento.target.type === "checkbox" ? evento.target.checked : evento.target.value;
      setCampos((atual) => ({ ...atual, [campo]: valor }));
    };
  }

  async function enviar(evento) {
    evento.preventDefault();
    setStatus("enviando");
    setErro("");

    const pareceBot = campoArmadilha.trim() !== "" || Date.now() - montadoEm.current < TEMPO_MINIMO_MS;
    if (pareceBot) {
      // Não avisa que foi bloqueado — só finge sucesso e não grava nada.
      // Isso evita ensinar o bot a se disfarçar melhor da próxima vez.
      setStatus("sucesso");
      setCampos(CAMPOS_INICIAIS);
      return;
    }

    if (!supabase) {
      console.error("Supabase não configurado — ver .env.local / .env.example.");
      setErro(
        "O envio ainda não tá disponível (backend não configurado). Me chama direto no WhatsApp por enquanto."
      );
      setStatus("erro");
      return;
    }

    const { error } = await supabase
      .from("leads")
      .insert([{ ...campos, nome: campos.nome.trim(), contato: campos.contato.trim(), origem: "site", contato_tipo: "whatsapp" }]);

    if (error) {
      console.error(error);
      setErro(
        error.message?.includes("limite de envios")
          ? "Recebemos muitos pedidos agora. Me chama direto no WhatsApp que eu te respondo por lá."
          : "Não consegui enviar agora. Confere sua internet e tenta de novo. Se continuar falhando, me chama direto no WhatsApp."
      );
      setStatus("erro");
      return;
    }

    setStatus("sucesso");
    setCampos(CAMPOS_INICIAIS);
    setAceitou(false);
  }

  return (
    <section id="contato" className="kit-cta">
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div className="ph-gridbg ph-gridbg--center" />
      </div>
      <div style={{ position: "relative", maxWidth: "var(--container)", margin: "0 auto" }}>
      <SectionHead
        tag="Contato"
        title={
          <>
            Tem uma ideia? <GradientText>Vamos construir.</GradientText>
          </>
        }
        sub="Sem burocracia de agência. Você fala direto com quem desenvolve."
      />

      {status === "sucesso" ? (
        <FadeUp as="div" immediate distance={16} className="ph-card kit-form">
          <p className="ph-tag">Recebido</p>
          <h3 style={{ fontSize: "1.4rem" }}>Chegou aqui do meu lado.</h3>
          <p style={{ color: "var(--text-dim)" }}>
            Vou dar uma olhada e te chamo no WhatsApp que você passou pra
            combinarmos os detalhes.
          </p>
          <div>
            <Button variant="ghost" type="button" onClick={() => setStatus("idle")}>
              Enviar outro pedido
            </Button>
          </div>
        </FadeUp>
      ) : (
        <FadeUp as="form" onSubmit={enviar} className="ph-card kit-form" viewportAmount={0.1}>
          {/* Honeypot: invisível e fora da navegação por teclado pra gente de
              verdade, mas visível pra bot que lê o HTML bruto. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="site_pessoal">Deixe este campo em branco</label>
            <input
              id="site_pessoal"
              name="site_pessoal"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={campoArmadilha}
              onChange={(e) => setCampoArmadilha(e.target.value)}
            />
          </div>

          <div className="kit-2col">
            <div className="ph-field">
              <label htmlFor="nome">Seu nome</label>
              <input className="ph-input" id="nome" type="text" required minLength={2} maxLength={120} autoComplete="name" value={campos.nome} onChange={atualizar("nome")} />
            </div>
            <div className="ph-field">
              <label htmlFor="empresa">Empresa (se tiver)</label>
              <input className="ph-input" id="empresa" type="text" maxLength={120} autoComplete="organization" value={campos.empresa} onChange={atualizar("empresa")} />
            </div>
          </div>

          <div className="kit-2col">
            <div className="ph-field">
              <label htmlFor="tipo_projeto">Tipo de projeto</label>
              <input className="ph-input"
                id="tipo_projeto"
                type="text"
                maxLength={120}
                placeholder="Site, sistema, automação…"
                value={campos.tipo_projeto}
                onChange={atualizar("tipo_projeto")}
                disabled={campos.nao_sei_o_que_precisa}
              />
            </div>
            <div className="ph-field">
              <label htmlFor="orcamento">Orçamento aproximado (opcional)</label>
              <input className="ph-input" id="orcamento" type="text" maxLength={60} value={campos.orcamento} onChange={atualizar("orcamento")} />
            </div>
          </div>

          <label className="ph-check">
            <input
              type="checkbox"
              checked={campos.nao_sei_o_que_precisa}
              onChange={atualizar("nao_sei_o_que_precisa")}
            />
            Não sei exatamente o que preciso
          </label>

          {!campos.nao_sei_o_que_precisa && (
            <div className="ph-field">
              <label htmlFor="objetivo">Objetivo do projeto</label>
              <input className="ph-input"
                id="objetivo"
                type="text"
                maxLength={300}
                placeholder="O que você quer resolver com isso?"
                value={campos.objetivo}
                onChange={atualizar("objetivo")}
              />
            </div>
          )}

          <div className="ph-field">
            <label htmlFor="descricao">
              {campos.nao_sei_o_que_precisa ? "Descreve o problema, do seu jeito" : "Descreve a ideia"}
            </label>
            <textarea className="ph-input"
              id="descricao"
              rows={4}
              maxLength={2000}
              aria-describedby="descricao-aviso"
              value={campos.descricao}
              onChange={atualizar("descricao")}
              placeholder={
                campos.nao_sei_o_que_precisa
                  ? "Conta o que tá te dando trabalho hoje — eu ajudo a traduzir isso em solução."
                  : "Prazo, referências, detalhes que ajudem a entender o projeto"
              }
            />
            <small id="descricao-aviso" className="ph-field-aviso">
              Não precisa colocar senha, dados bancários, de saúde ou de outras pessoas aqui.
            </small>
          </div>

          <div className="ph-field">
            <label htmlFor="contato_whatsapp">Seu WhatsApp</label>
            <input className="ph-input"
              id="contato_whatsapp"
              type="tel"
              required
              autoComplete="tel"
              maxLength={20}
              pattern="[0-9\(\)\+ \-]{10,20}"
              title="Digite o WhatsApp com DDD, só números. Ex.: (61) 99999-9999"
              placeholder="(61) 99999-9999"
              value={campos.contato}
              onChange={atualizar("contato")}
            />
          </div>

          <label className="ph-check">
            <input type="checkbox" required checked={aceitou} onChange={(e) => setAceitou(e.target.checked)} />
            <span>
              Li a <a href="/privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a> e quero
              receber o retorno sobre este pedido no WhatsApp que informei.
            </span>
          </label>

          {status === "erro" && (
            <p className="ph-alert" role="alert">
              {erro}{" "}
              <a href="https://wa.me/5561998433188" target="_blank" rel="noopener noreferrer">Abrir o WhatsApp</a>
            </p>
          )}

          <div>
            <Button type="submit" disabled={status === "enviando"}>
              {status === "enviando" ? "Enviando…" : "Enviar pedido"}
            </Button>
          </div>
        </FadeUp>
      )}
      </div>
    </section>
  );
}
