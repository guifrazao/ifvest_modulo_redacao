import React, { useEffect, useState } from "react";
import T from "../styles/tokens.js";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { Header } from "../components/Header.js";
import { SubHeader } from "../components/SubHeader.js";
import { PaginationBar } from "../components/Paginacao.js";
import { Footer } from "../components/Footer.js";
import { CorrectionTopicCard } from "../components/CardRedacaoAluno.js";
import { LoadingScreen } from "../components/TelaCarregamento.js";

export default function InterfaceAreaCorretor() {
  const [pendingEssays, setPendingEssays] = useState([]);
  const [correctedEssays, setCorrectedEssays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEssays() {
      try {
        // Busca redações pendentes e corrigidas paralelamente
        const [pendingRes, correctedRes] = await Promise.all([
          api.get("/essay/pending/"),
          api.get("/essay/corrected/") // Nova rota configurada abaixo
        ]);
        
        setPendingEssays(pendingRes.data);
        setCorrectedEssays(correctedRes.data);
      } catch (error) {
        console.error("Erro ao carregar redações:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEssays();
  }, []);

  const handleCardClick = (id) => {
    // Redireciona para a tela de correção passando o ID da redação
    navigate(`/correcao/${id}`);
  };

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString("pt-BR");
  }

  if (isLoading) return <LoadingScreen message="Carregando redações..." />;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#fff",
      boxSizing: "border-box"
    }}>
      <Header onProfileClick={() => console.log("Perfil clicado")} />

      <SubHeader title="Minhas Redações" onBack={() => navigate(-1)} />

      <main style={{
        flex: 1,
        padding: "24px 30px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box"
      }}>
        
        {/* Redações Aguardando Correção */}
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#888888",
            margin: "0 0 8px 0",
            fontFamily: "'Roboto', sans-serif"
          }}>
            Redações aguardando correção
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: "16px" }} />
          
          <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
          }}>
            {pendingEssays.length > 0 ? (
              pendingEssays.map(essay => (
                <CorrectionTopicCard 
                  key={essay.id}
                  id={essay.id}
                  title={essay.title}
                  done={false}
                  submissionDate={formatDate(essay.submitted_at)}
                  onClick={() => handleCardClick(essay.id)}
                />
              ))
            ) : (
              <p style={{ fontSize: 14, color: "#888" }}>Nenhuma redação aguardando correção no momento.</p>
            )}
          </div>
        </section>

        {/* Redações Corrigidas */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: "600", color: "#757575", margin: "0 0 8px 0", fontFamily: "'Roboto', sans-serif" }}>
            Redações corrigidas
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: "16px" }} />
          
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {correctedEssays.length > 0 ? (
              correctedEssays.map(essay => (
                <CorrectionTopicCard 
                  key={essay.id}
                  id={essay.id}
                  title={essay.title}
                  status="done"
                  submissionDate={formatDate(essay.submitted_at)}
                  onClick={() => handleCardClick(essay.id)}
                />
              ))
            ) : (
              <p style={{ fontSize: 14, color: "#888" }}>Nenhuma redação já corrigida por você.</p>
            )}
          </div>
        </section>

        <PaginationBar/>

      </main>

      <Footer />
    </div>
  );
}