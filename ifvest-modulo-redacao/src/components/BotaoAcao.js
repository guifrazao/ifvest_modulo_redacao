import { useState } from "react";

export function ActionButton({ text, color, textColor, borderRadius = 0, width, onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn-acao"
      style={{
        "--fundo-btn": color,
        "--cor-texto-btn": textColor,
        "--raio-borda-btn": `${borderRadius}px`,
        "--largura-btn": width
      }}
    >
      {text}
    </button>
  );
}