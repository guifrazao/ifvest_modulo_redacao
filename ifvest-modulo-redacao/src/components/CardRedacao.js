import "../styles/App.css"
export function EssayTopicCard({ title, done = false, onClick }) {
  const cardBg  = done ? "var(--fundo-feito)"  : "var(--fundo-nao-feito)";
  const arrowBg = done ? "var(--btn-feito)" : "var(--btn-nao-feito)";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
      className="card-redacao"
      style={{
        "--fundo-card": cardBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span className="titulo-card-redacao" style={{flex: 1,}}>
        {title}
      </span>

      <button
        aria-label="Abrir tema de redação"
        onClick={e => { e.stopPropagation(); onClick?.(); }}
        className="btn-card-redacao"
        style={{
          "--fundo-btn-card": arrowBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4.5l6 5.5-6 5.5" stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}