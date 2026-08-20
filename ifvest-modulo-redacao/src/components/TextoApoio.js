export function SupportTextItem({ type = "text", label, title, body, source, editable = false, onEdit, onDelete }) {
  return (
    <div style={{ marginBottom: 18, position: "relative" }}>
      {editable && (
        <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 6 }}>
          <button
            onClick={onEdit}
            aria-label="Editar texto de apoio"
            style={{
              width: 28, height: 28, borderRadius: 6, border: "none",
              background: "#e0e0e0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            aria-label="Excluir texto de apoio"
            style={{
              width: 28, height: 28, borderRadius: 6, border: "none",
              background: "#fbebeb", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
          </button>
        </div>
      )}

      <p className="label-txt-apoio">{label}</p>
      <p className="titulo-txt-apoio">{title}</p>
      <p className="corpo-txt-apoio">{body}</p>
      <p className="fonte-txt-apoio">Disponível em: {source}</p>

      {type === "image" && (
        <div style={{ width: "100%", minHeight: 150, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "left", marginTop: 6 }}>
          <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
            <rect x="10"  y="75" width="24" height="40" rx="2" fill="#1a1a1a"/>
            <rect x="44"  y="55" width="24" height="60" rx="2" fill="#1a1a1a"/>
            <rect x="78"  y="38" width="24" height="77" rx="2" fill="#1a1a1a"/>
            <rect x="112" y="20" width="24" height="95" rx="2" fill="#1a1a1a"/>
            <polyline points="22,72 56,50 90,34 124,16" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="22"  cy="72" r="5" fill="#1a1a1a"/>
            <circle cx="56"  cy="50" r="5" fill="#1a1a1a"/>
            <circle cx="90"  cy="34" r="5" fill="#1a1a1a"/>
            <circle cx="124" cy="16" r="5" fill="#1a1a1a"/>
          </svg>
        </div>
      )}
    </div>
  );
}