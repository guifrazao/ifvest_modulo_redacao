import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useNavigation } from 'react-router-dom';
import "../styles/App.css"
import api from "../api.js"
import { Header } from '../components/Header.js';
import { SubHeader } from '../components/SubHeader.js';
import { TopicSearchBar } from '../components/BarraPesquisa.js';
import { EssayTopicCard } from '../components/CardRedacao.js';
import { PaginationBar } from '../components/Paginacao.js';
import { Footer } from '../components/Footer.js';
import { ActionButton } from '../components/BotaoAcao.js';
import { LoadingScreen } from '../components/TelaCarregamento.js';

/* TODO: Sinalização do status de progresso da redação/correção (não feita/aguardando correção/feita) */

export default function InterfacePrincipal() {
  const [page,  setPage]  = useState(1);
  const [query, setQuery] = useState("");

  const [topics, setTopics] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
 
  useEffect(() => {
    async function getEssays() {
      try{
        const response = await api.get("/proposta/");
      
        const propostas = response.data.map(proposta => ({
          id_proposta: proposta.id_proposta,
          title: proposta.title,
          done: false
        }));
    
        console.log(propostas)
        setTopics(propostas)
        setIsLoading(false);
      }catch (error){
        console.error("Erro ao carregar propostas: ", error)
      }
    }

    getEssays();


  }, []);

  const filtered = topics.filter(t =>
    t.title ? t.title.toLowerCase().includes(query.toLowerCase()) : false
  );
 
  if (isLoading) return <LoadingScreen message="Carregando propostas de redação..."/>

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
 
          {/* Lista temas */}
          <div className="row" style={{ margin: "0 -8px" }}>
                {filtered.map(topic => (
                    <div
                    key={topic.id_proposta}
                    className={"col-s-6 col-6"}
                    style={{ padding: "8px" }}
                    >
                    <EssayTopicCard
                        title={topic.title}
                        done={topic.done}
                        onClick={() => navigate(`redacao/${topic.id_proposta}`)}
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