import React, { ReactNode, MouseEvent, CSSProperties } from "react";

interface ActionButtonProps {
  text: ReactNode;
  color?: string;
  textColor?: string;
  borderRadius?: number;
  width?: string | number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function ActionButton({
  text,
  color,
  textColor,
  borderRadius = 0,
  width,
  onClick,
}: ActionButtonProps) {
  // Objeto de estilos com suporte a variáveis customizadas do CSS
  const customStyles: CSSProperties & { [key: `--${string}`]: string | number | undefined } = {
    "--fundo-btn": color,
    "--cor-texto-btn": textColor,
    "--raio-borda-btn": `${borderRadius}px`,
    "--largura-btn": typeof width === "number" ? `${width}px` : width,
  };

  return (
    <button
      onClick={onClick}
      className="btn-acao"
      style={customStyles as CSSProperties}
    >
      {text}
    </button>
  );
}