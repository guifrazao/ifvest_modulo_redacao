import React from "react";
import { ActionButton } from "./BotaoAcao";

export function AnnotationForm({ 
  competenciaSelecionada, 
  onCompetenciaChange, 
  competenciasDisponiveis = [],
  onDelete, 
  comentario, 
  onComentarioChange,
  isNovoComentario,
  onCriarComentario
}) {
  // Encontra o objeto da competência atual para saber a cor do Badge (Garante um fallback seguro)
  const competenciaAtual = competenciasDisponiveis.find(c => c.label === competenciaSelecionada) || competenciasDisponiveis[0];

  return (
    <div style={{
      border: "2px solid #2d6a4f",
      borderRadius: 12,
      background: "#ffffff",
      padding: 16,
      width: "100%",
      maxWidth: 360,
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      fontFamily: "'Roboto', sans-serif"
    }}>
      {/* Cabeçalho */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        gap: 8
      }}>
        {isNovoComentario ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#f0f0f0",
            padding: "0 10px",
            borderRadius: 20,
            border: "1px solid #ccc"
          }}>
            {/* Ícone competência atual */}
            <span style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: competenciaAtual ? competenciaAtual.cor : "#ccc",
              flexShrink: 0
            }} />
            
            {/* Dropdown competências */}
            <select
              value={competenciaSelecionada}
              onChange={(e) => onCompetenciaChange(e.target.value)}
              style={{
                padding: "6px 0",
                borderRadius: 20,
                border: "none",
                fontSize: 13,
                fontWeight: 500,
                outline: "none",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              {competenciasDisponiveis.map(c => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Ícone estático (para comentários já criados) */
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#e0e0e0",
            padding: "6px 14px",
            borderRadius: 20
          }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: competenciaAtual ? competenciaAtual.cor : "#ccc"
            }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
              {competenciaSelecionada}
            </span>
          </div>
        )}

        {/* Botão Cancelar/Excluir */}
        <ActionButton
          onClick={onDelete}
          text={isNovoComentario ? "Cancelar" : "Minimizar"}
          color={isNovoComentario ? "#e53935" : "#f0f0f0"}
          textColor={isNovoComentario ? "#ffffff" : "#757575"}
          borderRadius={20}
        />
      </div>

      {/* Campo de texto do comentário */}
      <textarea
        value={comentario}
        onChange={(e) => onComentarioChange(e.target.value)}
        placeholder="Digite o comentário sobre a competência..."
        style={{
          width: "100%",
          height: 180,
          border: "1px solid #7a7a7a",
          borderRadius: 12,
          padding: 12,
          fontSize: 13,
          fontFamily: "'Roboto', sans-serif",
          color: "#555",
          outline: "none",
          resize: "none",
          boxSizing: "border-box",
          marginBottom: isNovoComentario ? 12 : 0
        }}
      />

      {/* Botão criar comentário */}
      {isNovoComentario && (
        <ActionButton
            onClick={onCriarComentario}
            text="Criar comentário"
            color="#2d6a4f"
            textColor="#ffffff"
            borderRadius={20}
            width="100%"
        />
      )}
    </div>
  );
}