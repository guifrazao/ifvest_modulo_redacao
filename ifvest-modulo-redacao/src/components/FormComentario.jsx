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
  onCriarComentario,
  isEditing,
  onStartEdit,
  onSaveEdit,
  readOnly = false,
  style
}) {
  const competenciaAtual = competenciasDisponiveis.find(c => c.label === competenciaSelecionada) || competenciasDisponiveis[0];

  // No modo readOnly, força sempre a visualização (nunca criação/edição)
  const mostrarModoEdicao = !readOnly && (isNovoComentario || isEditing);

  return (
    <div className="comment-popover-card" style={style}>
      {/* Modo leitura */}
      {!mostrarModoEdicao ? (
        <div>
          <div className="popover-header">
            <div className="badge-competencia-view">
              <span className="badge-dot" style={{ background: competenciaAtual ? competenciaAtual.cor : "#ccc" }} />
              <span className="badge-text">{competenciaSelecionada}</span>
            </div>
          </div>
          
          <p className="comment-view-text">
            {comentario || <em>Nenhum comentário inserido.</em>}
          </p>

          {!readOnly && (
            <div className="popover-actions-wrapper">
              <ActionButton onClick={onStartEdit} text="Editar" color="#f0f0f0" textColor="#2d6a4f" borderRadius={20} />
              <ActionButton onClick={onDelete} text="Excluir" color="#fbebeb" textColor="#dc3545" borderRadius={20} />
            </div>
          )}
        </div>
      ) : (

        <div>
          <div className="popover-header">
            <div className="select-competencia-container">
              <span className="badge-dot" style={{ background: competenciaAtual ? competenciaAtual.cor : "#ccc" }} />
              <select
                value={competenciaSelecionada}
                onChange={(e) => onCompetenciaChange(e.target.value)}
                className="select-competencia-dropdown"
              >
                {competenciasDisponiveis.map(c => (
                  <option key={c.id} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <ActionButton
              onClick={onDelete}
              text={isNovoComentario ? "Cancelar" : "Descartar"}
              color="#e53935"
              textColor="#ffffff"
              borderRadius={20}
            />
          </div>

          <textarea
            value={comentario}
            onChange={(e) => onComentarioChange(e.target.value)}
            placeholder="Digite o comentário sobre a competência..."
            className="popover-textarea"
          />

          <ActionButton
            onClick={isNovoComentario ? onCriarComentario : onSaveEdit}
            text={isNovoComentario ? "Criar comentário" : "Salvar alterações"}
            color="#2d6a4f"
            textColor="#ffffff"
            borderRadius={20}
            width="100%"
          />
        </div>
      )}
    </div>
  );
}