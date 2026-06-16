import T from "../styles/tokens"
import { SupportTextItem } from "./TextoApoio";
import { useState } from "react";


export function SupportTextsContainer({ items = [], children }) {
  const [expanded, setExpanded] = useState(true);
 
  return (
    //Container textos de apoio
    <div className="container-textos-apoio" style={{display: "flex", flexDirection: "column",}}>

        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: expanded ? 12 : 0,
            flexShrink: 0,
        }}>
        <span className="titulo-container-txt-apoio">
            Textos de apoio
        </span>

        {/* Botão mostrar menos/mais */}
        <button
            onClick={() => setExpanded(prev => !prev)}
            className="btn-mostrar-menos"
        >
            {expanded ? "Mostrar menos" : "Mostrar mais"}
        </button>

        </div>
        {expanded && (
            <div style={{ width: "100%", textAlign: "left" }}>
                {items.map((item, idx) => (
                    <SupportTextItem key={item.id ?? idx} {...item}/>
                ))}
            </div>
        )}

        {children}
    </div>
  );
}