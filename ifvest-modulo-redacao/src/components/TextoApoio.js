export function SupportTextItem({ type = "text", label, title, body, source, imageUrl, editable = false, onEdit, onDelete }) {
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

      {type === "text" && (
        <p className="corpo-txt-apoio">{body}</p>
      )}
      
      <p className="fonte-txt-apoio">Disponível em: {source}</p>
      
      {type === "image" && (
        imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Imagem do texto de apoio"}
            className="imagem-txt-apoio"
          />
        ) : (
          <p className="imagem-txt-apoio-indisponivel">Imagem não disponível</p>
        )
      )}
    </div>
  );
}