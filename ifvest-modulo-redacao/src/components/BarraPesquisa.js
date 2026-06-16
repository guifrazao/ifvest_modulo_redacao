
export function TopicSearchBar({ query, setQuery, placeholder, onChange }) {
    return (
        <div 
            className="barra-pesquisa"
            style={{
                alignItems: "center",
                display: "flex",
            }}>
                <input
                    className="input-barra-pesquisa"
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={onChange}
                    style={{flex: 1}}
                />
            {/* Icone filtro */}
            <button
                aria-label="Filtrar"
                onClick={() => {}}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", display: "flex" }}
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="2"  y1="5"  x2="18" y2="5"  stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="4"  y1="5"  x2="4"  y2="2"  stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="2"  y1="10" x2="18" y2="10" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="15" y1="10" x2="15" y2="7"  stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="2"  y1="15" x2="18" y2="15" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="9"  y1="15" x2="9"  y2="12" stroke="#999" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    )
}