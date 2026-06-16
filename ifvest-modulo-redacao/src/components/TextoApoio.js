
export function SupportTextItem({ type = "text", label, title, body}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p className="label-txt-apoio">
        {label}
      </p>

      <p className="titulo-txt-apoio">
        {title}
      </p>

      <p className="corpo-txt-apoio">
        {body}
      </p>
    
      {type === "image" && (   
        <div
          style={{
            width: "100%", minHeight: 150,
            borderRadius: 8, display: "flex", alignItems: "center",
            justifyContent: "left", marginTop: 6,
          }}
          >
            {/* Ícone feito para exemplificar imagem (temporário) */}
            <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
              <rect x="10"  y="75" width="24" height="40" rx="2" fill="#1a1a1a"/>
              <rect x="44"  y="55" width="24" height="60" rx="2" fill="#1a1a1a"/>
              <rect x="78"  y="38" width="24" height="77" rx="2" fill="#1a1a1a"/>
              <rect x="112" y="20" width="24" height="95" rx="2" fill="#1a1a1a"/>
              <polyline points="22,72 56,50 90,34 124,16"
                stroke="#1a1a1a" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round" fill="none"/>
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
