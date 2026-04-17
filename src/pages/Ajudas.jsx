import React, { useState } from "react";

function Ajuda() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Como criar uma rifa?",
      answer: "Clique no botão de criar rifa, preencha os dados e confirme.",
    },
    {
      question: "Como comprar um número?",
      answer: "Selecione a rifa desejada e escolha um número disponível.",
    },
    {
      question: "Como funciona o sorteio?",
      answer: "O sorteio é realizado automaticamente após todos os números serem vendidos.",
    },
    {
      question: "Posso cancelar minha participação?",
      answer: "Depende das regras da rifa. Entre em contato com o organizador.",
    },
  ];

  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div style={styles.container}>
      <h1>Dúvidas Frequentes</h1>

      <div style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            
            {/* PERGUNTA */}
            <div style={styles.question} onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span style={styles.arrow}>
                {openIndex === index ? "▲" : "▼"}
              </span>
            </div>

            {/* RESPOSTA */}
            {openIndex === index && (
              <div style={styles.answer}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTATO */}
      <div style={styles.contact}>
        <h2>Precisa de mais ajuda?</h2>
        <p>Entre em contato conosco:</p>
        <p style={styles.phone}>📞 (16) 99999-9999</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
    textAlign: "center",
  },

  faqContainer: {
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  faqItem: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
  },

  question: {
    padding: "15px",
    background: "#2563EB",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    fontWeight: "bold",
  },

  arrow: {
    fontSize: "14px",
  },

  answer: {
    padding: "15px",
    background: "#f1f5f9",
    textAlign: "left",
  },

  contact: {
    marginTop: "40px",
    padding: "20px",
    background: "#e2e8f0",
    borderRadius: "12px",
  },

  phone: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Ajuda;