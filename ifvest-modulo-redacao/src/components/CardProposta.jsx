import React from "react";
import "../styles/App.css";

export function PropostaCard({ title, creationDate, tags, onClick, onDelete }) {
  return (
    <div
      className="card-proposta"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
    >
      {onDelete && (
        <button
          aria-label="Remover proposta"
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="btn-remover-proposta"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </button>
      )}

      <div className="card-proposta-info">
        <span className="card-proposta-titulo">
          {title}
        </span>

        <div className="card-proposta-detalhes">
          <span>
            Criada em: <span className="destaque">{creationDate}</span>
          </span>

          {tags && tags.length > 0 && (
            <div className="card-proposta-tags">
              {tags.map((tag, index) => (
                <span key={index} className="card-proposta-tag-item">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        aria-label="Abrir proposta"
        onClick={e => { e.stopPropagation(); onClick?.(); }}
        className="btn-card-proposta"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 5l7 7-7 7" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}