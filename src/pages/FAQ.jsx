import React, { useState } from "react";

/**
 * FAQ component renders an accordion-style frequently asked questions page
 * along with company support contact details.
 */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  // FAQ data array containing customer support queries and answers
  const faqItems = [
    {
      question: "Como posso criar rifas no site?",
      answer: "Entre em contato conosco via email para te darmos acesso a aba de criação das rifas!",
    },
    {
      question: "Como faço para validar minha rifa?",
      answer: "Envie um comprovante de pagamento via pix no whatsapp de telefone (35)9842-47532, após isso seu número será validado!",
    },
    {
      question: "Como comprar um número?",
      answer: "Selecione a rifa desejada e escolha um número disponível, após selecionar todos os números desejados vá para o carrinho e encerre sua compra, ao final, envie o comprovante de pagamento para o telefone (35)98424-7532.",
    },
    {
      question: "Esqueci de mandar o comprovante, e agora?",
      answer: "Caso você tenha esquecido de mandar o comprovante, entraremos em contato solicitando-o, se ele não for enviado em até 24 horas, sua compra será cancelada.",
    },
    {
      question: "Como funciona o sorteio?",
      answer: "O sorteio é realizado pelo dono da rifa na data prevista no site. Apresentamos em nosso site uma função de sorteio, que escolhe randomicamente um dos tickets comprados como vencedor!",
    },
    {
      question: "Posso cancelar minha participação?",
      answer: "Caso tenha desistido da compra de seu número, envie uma requisição em nosso whatsapp. Cancelamentos podem ser solicitados até 8 horas antes do sorteio da rifa.",
    },
    {
      question: "Como faço para editar meus dados?",
      answer: "Vá até a aba 'meus dados' e clique na opção editar para atualizar alguma informação de cadastro.",
    },
    {
      question: "É seguro o site?",
      answer: "Garantimos que nenhum usuário terá acesso as rifas criadas por uma instituição, apenas os administradores do site tem acesso para validação do pagamento.",
    },
  ];

  /**
   * Toggles the accordion collapse/expand state.
   * @param {number} index - The clicked FAQ item index
   */
  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Dúvidas Frequentes</h1>

      <div style={styles.faqContainer}>
        {faqItems.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} style={styles.faqItem}>
              {/* Question Trigger Wrapper */}
              <div style={styles.questionRow} onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                <span style={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Collapsible Answer Box */}
              {isOpen && <div style={styles.answerBox}>{faq.answer}</div>}
            </div>
          );
        })}
      </div>

      {/* Support Contact Section */}
      <div style={styles.contactContainer}>
        <h2 style={styles.contactTitle}>Precisa de mais ajuda?</h2>
        <p style={styles.contactText}>Entre em contato conosco:</p>
        <p style={styles.phoneText}>Rifa Facil 📞 (35) 98424-7532</p>
        <p style={styles.EmailText}>Email: rifafacil@gmail.com </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
  },
  mainTitle: {
    color: "#1e293b",
    fontSize: "2rem",
    marginBottom: "30px",
  },
  faqContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  
  faqItem: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  questionRow: {
    padding: "18px 20px",
    background: "#2563EB",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
  },
  arrow: {
    fontSize: "0.8rem",
  },
  answerBox: {
    padding: "20px",
    background: "#f8fafc",
    color: "#334155",
    textAlign: "left",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    borderTop: "1px solid #e2e8f0",
  },
  contactContainer: {
    marginTop: "50px",
    padding: "30px",
    background: "#f5f6fa",
    borderRadius: "16px",
  },
  contactTitle: {
    fontSize: "1.3rem",
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  contactText: {
    color: "#475569",
    margin: "0 0 12px 0",
  },
  phoneText: {
    fontSize: "1.2rem",
    color: "#2563EB",
    margin: 0,
  },
  EmailText: {
    fontSize: "1.2rem",
    color: "#2563EB",
    margin: 0,
  },
};

export default FAQ;