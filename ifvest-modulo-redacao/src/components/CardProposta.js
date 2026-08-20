import React from "react";
import "../styles/App.css";

export function PropostaCard({ title, creationDate, tags, onClick }) {
  return (
    <div
      className="card-proposta"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
    >
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