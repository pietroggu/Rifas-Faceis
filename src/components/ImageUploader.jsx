import React, { useRef, useState } from "react";

/**
 * @param {string} value - A URL ou Base64 da imagem
 * @param {Function} onChange - Callback para atualizar a imagem no componente pai
 * @param {boolean} disabled - Define se o componente está bloqueado para edição
 */
function ImageUploader({ value, onChange, disabled }) {
  const fileInputRef = useRef(null);
  const [isLinkMode, setIsLinkMode] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert("A imagem é muito grande! Escolha no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={styles.container}>
      {/* Visualizador de Imagem */}
      <div 
        style={{ ...styles.imageWrapper, cursor: disabled ? "default" : "pointer" }} 
        onClick={() => !disabled && !isLinkMode && fileInputRef.current?.click()}
      >
        <img 
          src={value || "https://placehold.co/600x600/e2e8f0/64748b?text=Imagem"} 
          alt="Preview" 
          style={styles.imageDisplay} 
        />
      </div>

      {/* Alternador de modo - Oculto se desabilitado */}
      {!disabled && (
        <div style={styles.modeToggle}>
          <button type="button" onClick={() => setIsLinkMode(!isLinkMode)} style={styles.toggleBtn}>
            {isLinkMode ? "Usar upload local" : "Usar link da internet"}
          </button>
        </div>
      )}

      {/* Input de texto ou file */}
      {isLinkMode ? (
        <input
          type="text"
          placeholder="Cole a URL da imagem aqui..."
          value={value && !value.startsWith("data:") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
          disabled={disabled}
        />
      ) : (
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
          disabled={disabled}
        />
      )}
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" },
  imageWrapper: { width: "100px", height: "100px" },
  imageDisplay: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "3px solid #2563EB" },
  modeToggle: { fontSize: "0.8rem", color: "#64748b" },
  toggleBtn: { background: "none", border: "none", color: "#2563EB", cursor: "pointer", textDecoration: "underline" },
  input: { padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #cbd5e1" }
};

export default ImageUploader;