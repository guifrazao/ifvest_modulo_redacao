import T from "../styles/tokens"
import { SupportTextItem } from "./TextoApoio";
import { useState } from "react";


export function SupportTextsContainer({ items = [], children }) {
 
  return (
    //Container textos de apoio
    <div className="container-textos-apoio" style={{display: "flex", flexDirection: "column",}}>

        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 12,
            flexShrink: 0,
        }}>
        <span className="titulo-container-txt-apoio">
            Textos de apoio
        </span>

        </div>

        <div style={{ width: "100%", textAlign: "left" }}>
            {items.map((item, idx) => (
                <SupportTextItem key={item.id ?? idx} {...item}/>
            ))}
        </div>

        {children}
    </div>
  );
}