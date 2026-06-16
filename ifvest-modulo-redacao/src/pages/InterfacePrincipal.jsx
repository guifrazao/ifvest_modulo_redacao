import React from 'react';
import { useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import "../styles/App.css"
import { Header } from '../components/Header.js';
import { SubHeader } from '../components/SubHeader.js';
import { TopicSearchBar } from '../components/BarraPesquisa.js';
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
  { id: 9, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 10, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
  { id: 11, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 12, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
  { id: 13, title: "O uso de câmeras policiais no Brasil: limites e possibilidades",  done: false },
  { id: 14, title: "Perspectiva acerca do envelhecimento na sociedade brasileira",     done: true  },
];

export default function InterfacePrincipal() {
  const [page,  setPage]  = useState(1);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
 
  const filtered = TOPICS.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );
 
  return (
    <>
 
      {/* Container que engloba todos os elementos da tela */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        //maxWidth: 660,
        margin: "0 auto",
        background: "var(--fundo-pagina)",
        boxShadow: "0 0 18px rgba(0,0,0,.12)",
      }}>

        <Header onProfileClick={() => {}} />
 
        <SubHeader title="Redação" onBack={() => navigate(-1)} />
 
        {/* Corpo */}
        <main style={{ flex: 1, width: "100%", maxWidth: 1500, padding: "12px 10px 16px", alignSelf: "center", background: "var(--fundo-pagina)" }}>
 
          {/* Toolbar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 6px 8px",
          }}>
            <span style={{
              fontSize: 14,
              color: "var(--cor-label-temas)",
              fontFamily: "'Roboto', sans-serif",
            }}>
              Temas de redação
            </span>
 
            <ActionButton text="Minhas redações" textColor="var(--texto-btn-aluno)" color="var(--btn-area-aluno)" borderRadius={20} onClick={() => navigate("/area_aluno")}/>
          </div>
 
          {/* Barra de pesquisa */}
          <TopicSearchBar placeholder={"Pesquisar temas de redação..."} onChange={e => setQuery(e.target.value)}/>
 
          {/* Tema de semana */}
          <div style={{ padding: "0 0 8px" }}>
            <EssayTopicCard
              title="TEMA DA SEMANA: Tratamento a imigrantes no Brasil e no Mundo"
              featured
              onClick={() => {}}
            />
          </div>
 
          {/* Lista temas */}
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