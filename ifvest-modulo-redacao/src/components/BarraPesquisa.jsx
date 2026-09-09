import React, { useState, useRef, useEffect } from "react";

export function TopicSearchBar({
  query,
  placeholder,
  onChange,
  availableTags = [],
  selectedTags = [],
  onTagsChange,
  sortOrder = "recent",
  onSortChange,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }

  function limparFiltros() {
    onTagsChange([]);
    onSortChange("recent");
  }

  const filtrosAtivos = selectedTags.length > 0 || sortOrder !== "recent";

  return (
    <div className="barra-pesquisa-wrapper" ref={wrapperRef}>
      <div className="barra-pesquisa" style={{ alignItems: "center", display: "flex" }}>
        <input
          className="input-barra-pesquisa"
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={onChange}
          style={{ flex: 1 }}
        />

        <button
          aria-label="Filtrar"
          onClick={() => setIsFilterOpen(prev => !prev)}
          className={`btn-filtro ${filtrosAtivos ? "btn-filtro-ativo" : ""}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="2"  y1="5"  x2="18" y2="5"  stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="4"  y1="5"  x2="4"  y2="2"  stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2"  y1="10" x2="18" y2="10" stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="15" y1="10" x2="15" y2="7"  stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2"  y1="15" x2="18" y2="15" stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="9"  y1="15" x2="9"  y2="12" stroke={filtrosAtivos ? "#2d6a4f" : "#999"} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {isFilterOpen && (
        <div className="painel-filtro">
          <div className="filtro-secao">
            <p className="filtro-secao-titulo">Ordenar por data</p>
            <label className="filtro-radio-item">
              <input
                type="radio"
                name="ordenacao"
                checked={sortOrder === "recent"}
                onChange={() => onSortChange("recent")}
              />
              Mais recente
            </label>
            <label className="filtro-radio-item">
              <input
                type="radio"
                name="ordenacao"
                checked={sortOrder === "oldest"}
                onChange={() => onSortChange("oldest")}
              />
              Mais antigo
            </label>
          </div>

          {availableTags.length > 0 && (
            <div className="filtro-secao">
              <p className="filtro-secao-titulo">Tags</p>
              <div className="filtro-tags-lista">
                {availableTags.map(tag => (
                  <label key={tag} className="filtro-checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button className="filtro-btn-limpar" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}