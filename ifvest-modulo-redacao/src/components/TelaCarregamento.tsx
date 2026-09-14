import React from "react";

export interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
}