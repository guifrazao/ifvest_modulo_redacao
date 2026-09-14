import React, { ReactNode } from "react";
import T from "../styles/tokens";
import { SupportTextItem, SupportTextItemProps } from "./TextoApoio";

export type SupportTextWithId = SupportTextItemProps & {
  id?: number | string;
};

interface SupportTextsContainerProps {
  items?: SupportTextWithId[];
  editable?: boolean;
  onEdit?: (id?: number | string) => void;
  onDelete?: (id?: number | string) => void;
  children?: ReactNode;
}

export function SupportTextsContainer({
  items = [],
  editable = false,
  onEdit,
  onDelete,
  children,
}: SupportTextsContainerProps) {
  return (
    <div className="container-textos-apoio" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        <span className="titulo-container-txt-apoio">Textos de apoio</span>
      </div>

      <div style={{ width: "100%", textAlign: "left" }}>
        {items.map((item, idx) => (
          <SupportTextItem
            key={item.id ?? idx}
            {...item}
            editable={editable}
            onEdit={() => onEdit && onEdit(item.id)}
            onDelete={() => onDelete && onDelete(item.id)}
          />
        ))}
      </div>

      {children}
    </div>
  );
}