import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import T from "../styles/tokens.js";
import { Header } from '../components/Header.js';
import { SubHeader } from '../components/SubHeader.js';
import { EssayTopicCard } from '../components/CardRedacao.js';
import { PaginationBar } from '../components/Paginacao.js';
import { Footer } from '../components/Footer.js';
import { ActionButton } from '../components/BotaoAcao.js';

const TOPICS = [
  { id: 1, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 2, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
  { id: 3, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 4, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
  { id: 5, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 6, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
  { id: 7, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 8, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
];

export default function InterfaceProf() {
  const [page,  setPage]  = useState(1);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
 
  const filtered = TOPICS.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );
 
  return (
    <>
 
      {/* Container que engloba todos os elementos */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        //maxWidth: 660,
        margin: "0 auto",
        background: T.fundoPagina,
        boxShadow: "0 0 18px rgba(0,0,0,.12)",
      }}>
 
        <Header onProfileClick={() => {}} />
 
        <SubHeader title="Redação" onBack={() => navigate(-1)} />
 
        {/* Corpo */}
        <main style={{ flex: 1, width: "100%", maxWidth: 1500, padding: "12px 10px 16px", alignSelf: "center", background: T.fundoPagina }}>
 
          {/* Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 6px 8px",
          }}>
            <span style={{
              fontSize: 14,
              color: T.corLabelTemas,
              fontFamily: "'Roboto', sans-serif",
            }}>
              Temas de redação
            </span>
 
            <div style={{display: "flex", gap: "4px"}}>
              <ActionButton text="Minhas redações" textColor={T.textoBtnAluno} color={T.btnAreaAluno} borderRadius={20} onClick={() => navigate("/area_corretor")}/>
              <ActionButton text="Criar nova proposta" 
                textColor={T.textoBtnProf} 
                color={T.btnAreaProf} 
                borderRadius={20}
                onClick={() => navigate("/criar_redacao")}
              />
            </div>
          </div>
 
          {/* Barra de pesquisa */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "#f0f0f0",
            border: `1px solid ${T.bordaBarraPesq}`,
            borderRadius: 6,
            padding: "0 10px",
            height: 40,
            marginBottom: 12,
          }}>
            <input
              type="text"
              placeholder="Pesquisar temas de redação..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#555",
                background: "transparent",
                fontFamily: "'Roboto', sans-serif",
              }}
            />
            {/* Ícone filtro */}
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
 
 
          {/* Lista de temas */}
          <div className="row" style={{ margin: "0 -8px" }}>
                {filtered.map(topic => (
                    <div
                    key={topic.id}
                    className={topic.fullWitdh ? "col-12" : "col-s-6 col-6"}
                    style={{ padding: "8px" }}
                    >
                    <EssayTopicCard
                        title={topic.title}
                        done={topic.done}
                        onClick={() => navigate("/redacao")}
                    />
                    </div>
                ))}
            </div>
 
          {/* Paginação */}
        </main>

        <PaginationBar total={9} current={page} onPageChange={setPage} />
 
        <Footer></Footer>
      </div>
    </>
  );
}