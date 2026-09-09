import { useNavigate } from "react-router-dom";
import "../styles/App.css"
import { ActionButton } from "./BotaoAcao";
import { rotaPrincipal } from "../globals";
export function Header({ onProfileClick, currentModule="Redações" }) {
  const navigate = useNavigate()

  const navButtonLayout = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    height: "100%",
    boxSizing: "border-box"
  };

  return (
    <header className="header">

      {/* ícone IFVest */}

      <div className="wrapper-logo-header">
        <ActionButton
          text={
            <>
              <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 700, fontSize: 17, color: "var(--cor-if)" }}>IF</span>
              <span style={{ fontFamily: "'Roboto',sans-serif", fontWeight: 700, fontSize: 17, color: "var(--cor-vest)" }}>Vest</span>
            </>
          }
          onClick={() => navigate(rotaPrincipal)}
          color="var(--fundo-logo)"
          borderRadius={20}
        />
      </div>

      {/* Navbar módulos */}
      <nav className="wrapper-nav-header">
        <button 
          className={`btn-nav ${currentModule === "Início" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Início</span>
        </button>

        <button 
          className={`btn-nav ${currentModule === "Simulados" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span>Simulados</span>
        </button>

        <button 
          className={`btn-nav ${currentModule === "Revisão" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          <span>Revisão</span>
        </button>

        <button 
          className={`btn-nav ${currentModule === "IFQuiz" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>IFQuiz</span>
        </button>

        <button 
          className={`btn-nav ${currentModule === "Flashcards" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="13" height="13" rx="2" ry="2"/>
            <path d="M7 21h12a2 2 0 0 0 2-2V7"/>
          </svg>
          <span>Flashcards</span>
        </button>

        <button 
          className={`btn-nav ${currentModule === "Redações" ? "active" : ""}`}
          style={navButtonLayout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
          </svg>
          <span>Redações</span>
        </button>
      </nav>
 
      {/* Botão perfil */}
      <div className="wrapper-perfil-header">
        <button
          onClick={onProfileClick}
          aria-label="Perfil do usuário"
          className="btn-perfil"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--borda-cabecalho)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Usuário</span>
        </button>
      </div>
    </header>
  );
}