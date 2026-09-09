import React, { useEffect, useState } from "react";
import api from "../api";
import T from "../styles/tokens";
import "../styles/App.css";

export function CorrectionTopicCard({ 
  id,
  title, 
  status = "not_done", 
  onClick, 
  submissionDate, 
  correctionDate: initialCorrectionDate, 
  score: initialScore, 
  correctorName: initialCorrectorName 
}) {
  const isDone = status === "done";
  const cardBg  = isDone ? T.fundoFeito  : T.fundoNaoFeito;
  const arrowBg = isDone ? T.btnFeito : T.btnNaoFeito;

  const [correctionDate, setCorrectionDate] = useState(initialCorrectionDate);
  const [score, setScore] = useState(initialScore);
  const [correctorName, setCorrectorName] = useState(initialCorrectorName);

  useEffect(() => {
    if (isDone && id && score === undefined) {
      async function fetchCorrectionData() {
        try {
          const response = await api.get(`/essay/${id}`);
          const correction = response.data.correction;
          
          if (correction) {
            const total = correction.c1_score + correction.c2_score + correction.c3_score + correction.c4_score + correction.c5_score;
            setScore(total);
            setCorrectorName(correction.corrector_name);
            setCorrectionDate(new Date(correction.corrected_at).toLocaleDateString("pt-BR"));
          }
        } catch (error) {
          console.error("Erro ao buscar dados da correção:", error);
        }
      }
      fetchCorrectionData();
    }
  }, [isDone, id, score]);

  return (
    <div
      className="card-correcao"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
      style={{ "--fundo-card": cardBg }}
    >
      <div className="card-correcao-info">
        <span className="card-correcao-titulo">
          {title}
        </span>

        <div className="card-correcao-detalhes">
          <span>
            {isDone ? "Data de correção: " : "Data de envio: "}
            <span>{isDone ? correctionDate : submissionDate}</span>
          </span>
          
          <span>
            Nota: <span>{score ?? "--:--"}</span>
          </span>

          <span>
            Corrigido por: <span className="destaque">{correctorName ?? "--:--"}</span>
          </span>
        </div>
      </div>

      <button
        aria-label="Abrir tema de redação"
        onClick={e => { e.stopPropagation(); onClick?.(); }}
        className="btn-card-correcao"
        style={{ "--fundo-btn-card": arrowBg }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 5l7 7-7 7" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}