import React, { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import "../styles/App.css";

export type EssayStatus = "done" | "not_done";

interface EssayTopicCardProps {
  title: string;
  status?: EssayStatus;
  onClick?: () => void;
}

export function EssayTopicCard({
  title,
  status = "not_done",
  onClick,
}: EssayTopicCardProps) {
  const cardBg = status === "done" ? "var(--fundo-feito)" : "var(--fundo-nao-feito)";
  const arrowBg = status === "done" ? "var(--btn-feito)" : "var(--btn-nao-feito)";

  const cardStyles: CSSProperties & { [key: `--${string}`]: string } = {
    "--fundo-card": cardBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  };

  const buttonStyles: CSSProperties & { [key: `--${string}`]: string } = {
    "--fundo-btn-card": arrowBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => e.key === "Enter" && onClick?.()}
      className="card-redacao"
      style={cardStyles as CSSProperties}
    >
      <span className="titulo-card-redacao" style={{ flex: 1 }}>
        {title}
      </span>

      <button
        aria-label="Abrir tema de redação"
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="btn-card-redacao"
        style={buttonStyles as CSSProperties}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 4.5l6 5.5-6 5.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}