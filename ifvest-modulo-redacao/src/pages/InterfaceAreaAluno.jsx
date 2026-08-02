import React, { useEffect, useState } from "react";
import T from "../styles/tokens.js";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { idUsuario } from "../globals.js";
import { Header } from "../components/Header.js";
import { SubHeader } from "../components/SubHeader.js";
import { PaginationBar } from "../components/Paginacao.js";
import { Footer } from "../components/Footer.js";
import { CorrectionTopicCard } from "../components/CardRedacaoAluno.js";
import { LoadingScreen } from "../components/TelaCarregamento.js";

export default function InterfaceAreaAluno() {
  const [essays, setEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEssays() {
      try {
        const response = await api.get(`/essay/user/${idUsuario}/`);
        setEssays(response.data);
      } catch (error) {
        console.error("Erro ao carregar redações:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEssays();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/correcao/${id}`);
  };

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("pt-BR");
  }

  if (isLoading) return <LoadingScreen message="Carregando suas redações..." />;

  const pendentes = essays.filter(e => e.status !== "done");
  const corrigidas = essays.filter(e => e.status === "done");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#fff", boxSizing: "border-box" }}>
      <Header onProfileClick={() => console.log("Perfil clicado")} />
      <SubHeader title="Minhas Redações" onBack={() => navigate(-1)} />

      <main style={{ flex: 1, padding: "24px 30px", display: "flex", flexDirection: "column", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: "#757575", margin: "0 0 8px 0", fontFamily: "'Roboto', sans-serif" }}>
            Redações aguardando correção
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {pendentes.map(essay => (
              <CorrectionTopicCard
                key={essay.id}
                title={essay.title}
                done={false}
                submissionDate={formatDate(essay.submitted_at)}
                onClick={() => handleCardClick(essay.id)}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: 12, fontWeight: 600, color: "#757575", margin: "0 0 8px 0", fontFamily: "'Roboto', sans-serif" }}>
            Redações corrigidas
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {corrigidas.map(essay => (
              <CorrectionTopicCard
                key={essay.id}
                title={essay.title}
                done={true}
                correctionDate={null /* virá de Correction futuramente */}
                score={null /* idem */}
                correctorName={null /* idem */}
                onClick={() => handleCardClick(essay.id)}
              />
            ))}
          </div>
        </section>

        <PaginationBar/>
      </main>
      <Footer />
    </div>
  );
}