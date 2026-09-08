import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { idCorretor } from "../globals.js";
import { Header } from "../components/Header.js";
import { SubHeader } from "../components/SubHeader.js";
import { PaginationBar } from "../components/Paginacao.js";
import { Footer } from "../components/Footer.js";
import { LoadingScreen } from "../components/TelaCarregamento.js";
import { PropostaCard } from "../components/CardProposta.js"; 
import "../styles/App.css";

export default function InterfaceMinhasPropostas() {
  const [propostas, setPropostas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPropostas() {
      try {
        const response = await api.get(`/proposta/creator/${idCorretor}/`);
        setPropostas(response.data);
      } catch (error) {
        console.error("Erro ao carregar propostas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPropostas();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/proposta/edit/${id}`);
  };

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("pt-BR");
  }

  async function handleDeleteProposta(id) {
    if (!window.confirm("Tem certeza que deseja remover esta proposta?")) return;

    try {
      await api.delete(`/proposta/${id}/`);
      setPropostas(prev => prev.filter(p => p.id_proposta !== id));
    } catch (error) {
      console.error("Erro ao remover proposta:", error);
      alert("Não foi possível remover a proposta.");
    }
  }

  if (isLoading) return <LoadingScreen message="Carregando propostas..." />;

  return (
    <div className="minhas-propostas-wrapper">
      <Header onProfileClick={() => console.log("Perfil clicado")} />

      <SubHeader title="Minhas Propostas" onBack={() => navigate(-1)} />

      <main className="minhas-propostas-main">

        <section className="minhas-propostas-section">
          <h2 className="minhas-propostas-titulo">
            Propostas criadas por mim
          </h2>
          <hr className="minhas-propostas-linha" />

          <div className="minhas-propostas-grid">
            {propostas.length > 0 ? (
              propostas.map(proposta => (
                <PropostaCard
                  key={proposta.id_proposta}
                  title={proposta.title}
                  creationDate={formatDate(proposta.created_at)}
                  tags={proposta.tags} 
                  onClick={() => handleCardClick(proposta.id_proposta)}
                  onDelete={() => handleDeleteProposta(proposta.id_proposta)}
                />
              ))
            ) : (
              <p className="minhas-propostas-vazio">Você ainda não criou nenhuma proposta.</p>
            )}
          </div>
        </section>

        <PaginationBar/>

      </main>

      <Footer />
    </div>
  );
}