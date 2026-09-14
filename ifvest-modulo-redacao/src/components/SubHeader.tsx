import React, { ChangeEvent } from "react";
import "../styles/App.css";

interface SubHeaderProps {
  title: string;
  onTitleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  readOnly?: boolean;
  navigate?: any; // Mantido para compatibilidade, embora não seja utilizado no render
}

export function SubHeader({ title, onTitleChange, onBack, readOnly = true, navigate }: SubHeaderProps) {
  return (
    <div 
      className="subheader"
      style={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
 
      {/* Botão retornar */}
      <button
        onClick={onBack}
        aria-label="Voltar"
        className="btn-retornar"
        style={{  
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Ícone retornar */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2.5L4.5 7 9 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
 
      {/* Título centrado */}
      {readOnly ? (
        <span className="titulo-subheader-readonly">
          {title}
        </span>
      ) : (
        <input
          type="text"
          value={title}
          className="titulo-subheader"
          onChange={onTitleChange}
          placeholder="Digite a frase tema da proposta aqui..."
          title={title}
        />
      )}
    </div>
  );
}