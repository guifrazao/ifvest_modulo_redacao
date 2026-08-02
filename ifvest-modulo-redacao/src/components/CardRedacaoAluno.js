import T from "../styles/tokens.js";

export function CorrectionTopicCard({ 
  title, 
  status = "not_done", 
  onClick, 
  submissionDate, 
  correctionDate, 
  score, 
  correctorName 
}) {
  const cardBg  = status === "done" ? T.fundoFeito  : T.fundoNaoFeito;
  const arrowBg = status === "done" ? T.btnFeito : T.btnNaoFeito;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
      style={{
        background: cardBg,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 18px",
        cursor: "pointer",
        minHeight: 88,
        gap: 16,
        outline: "none",
        flex: "1 1 calc(50% - 12px)",
        minWidth: "290px",
        boxSizing: "border-box"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#757575",
          lineHeight: 1.4,
          fontFamily: "'Roboto', sans-serif",
        }}>
          {title}
        </span>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: 11,
          color: "#757575",
          fontFamily: "'Roboto', sans-serif"
        }}>
          <span>
            {status ? "Data de correção: " : "Data de envio: "}
            <span style={{ color: "#757575" }}>{status ? correctionDate : submissionDate}</span>
          </span>
          
          <span>
            Nota: <span style={{ color: "#757575" }}>{score ?? "--:--"}</span>
          </span>

          <span>
            Corrigido por: <span style={{ color: "#757575", fontWeight: 500 }}>{correctorName ?? "--:--"}</span>
          </span>
        </div>
      </div>

      <button
        aria-label="Abrir tema de redação"
        onClick={e => { e.stopPropagation(); onClick?.(); }}
        style={{
          width: 44, 
          height: 44,
          borderRadius: 12,
          background: arrowBg,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 5l7 7-7 7" stroke="white" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}