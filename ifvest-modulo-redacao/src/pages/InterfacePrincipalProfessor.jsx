import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import T from "../styles/tokens";
import api from "../api"
import { idCorretor } from '../globals'; //REMOVER ISSO E O RESTO DOS USUARIOS FALSOS DEPOIS QUANDO INTEGRAR COM LOGIN
import { Header } from '../components/Header';
import { SubHeader } from '../components/SubHeader';
import { EssayTopicCard } from '../components/CardRedacao';
import { PaginationBar } from '../components/Paginacao';
import { Footer } from '../components/Footer';
import { TopicSearchBar } from '../components/BarraPesquisa';
import { ActionButton } from '../components/BotaoAcao';
import { LoadingScreen } from '../components/TelaCarregamento';

/* TODO: Sinalização do status de progresso da redação/correção (não feita/aguardando correção/feita), implementar paginação */

export default function InterfaceProf() {
  const [page,  setPage]  = useState(1);
  const [query, setQuery] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);
  const [sortOrder, setSortOrder] = useState("recent");
  
  const [topics, setTopics] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    async function getEssays() {
      try{
        const response = await api.get(`/proposta/?user_id=${idCorretor}`);
      
        const propostas = response.data.map(proposta => ({
          id_proposta: proposta.id_proposta,
          title: proposta.title,
          created_at: proposta.created_at,
          tags: proposta.tags,
          status: proposta.status,
        }));
    
        setTopics(propostas)
        setIsLoading(false);
      }catch (error){
        console.error("Erro ao carregar propostas: ", error)
      }
    }

    getEssays();


  }, []);
  
  const availableTags = useMemo(() => {
    const todas = topics.flatMap(t => t.tags ?? []);
    return [...new Set(todas)].sort();
  }, [topics]);

  const filtered = useMemo(() => {
    return topics
      .filter(t => t.title ? t.title.toLowerCase().includes(query.toLowerCase()) : false)
      .filter(t => selectedTags.length === 0 || (t.tags ?? []).some(tag => selectedTags.includes(tag)))
      .sort((a, b) => {
        const dataA = new Date(a.created_at);
        const dataB = new Date(b.created_at);
        return sortOrder === "recent" ? dataB - dataA : dataA - dataB;
      });
  }, [topics, query, selectedTags, sortOrder]);
 
  if (isLoading) return <LoadingScreen message="Carregando propostas de redação..."/>

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
                <ActionButton text="Minhas Propostas" 
                  textColor={T.textoBtnProf} 
                  color={T.btnAreaProf} 
                  borderRadius={20}
                  onClick={() => navigate("/minhas_propostas")}
                />
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
          <TopicSearchBar
            placeholder={"Pesquisar temas de redação..."}
            query={query}
            onChange={e => setQuery(e.target.value)}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
 
 
          {/* Lista de temas */}
          <div className="row" style={{ margin: "0 -8px" }}>
                {filtered.map(topic => (
                    <div
                    key={topic.id_proposta}
                    className={"col-s-6 col-6"}
                    style={{ padding: "8px" }}
                    >
                    <EssayTopicCard
                        title={topic.title}
                        status={topic.status}
                        onClick={() => navigate(`/proposta/${topic.id_proposta}`)}
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