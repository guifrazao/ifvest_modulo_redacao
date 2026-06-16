import React from "react";
import T from "../styles/tokens.js";
import { useNavigate, useNavigation } from "react-router-dom";
import { Header } from "../components/Header.js";
import { SubHeader } from "../components/SubHeader.js";
import { PaginationBar } from "../components/Paginacao.js";
import { Footer } from "../components/Footer.js";
import { EssayTopicCard } from "../components/CardRedacaoAluno.js";

export default function InterfaceAreaAluno() {
  const handleCardClick = (id) => {
    console.log(`Abrir redação com ID: ${id}`);
  };

  const navigate = useNavigate();

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
        
        {/* Aguardando correção */}
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#757575",
            margin: "0 0 8px 0",
            fontFamily: "'Roboto', sans-serif",
          }}>
            Redações aguardando correção
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: "16px" }} />
          
          <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
          }}>
            <EssayTopicCard 
              title="Perspectiva acerca do envelhecimento na sociedade brasileira"
              done={false}
              submissionDate="13/05/2026"
              onClick={() => handleCardClick(1)}
            />
            <EssayTopicCard 
              title="Perspectiva acerca do envelhecimento na sociedade brasileira"
              done={false}
              submissionDate="13/05/2026"
              onClick={() => handleCardClick(2)}
            />
          </div>
        </section>

        {/* Redações corrigidas */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#757575",
            margin: "0 0 8px 0",
            fontFamily: "'Roboto', sans-serif"
          }}>
            Redações corrigidas
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid #e8e8e8", marginBottom: "16px" }} />
          
          <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap"
          }}>
            <EssayTopicCard 
              title="Perspectiva acerca do envelhecimento na sociedade brasileira"
              done={true}
              correctionDate="13/05/2026"
              score="800,0"
              correctorName="EXEMPLO DA SILVA"
              onClick={() => handleCardClick(3)}
            />
            <EssayTopicCard 
              title="Perspectiva acerca do envelhecimento na sociedade brasileira"
              done={true}
              correctionDate="13/05/2026"
              score="800,0"
              correctorName="EXEMPLO DA SILVA"
              onClick={() => handleCardClick(3)}
            />
          </div>
        </section>

        <PaginationBar/>

      </main>

      <Footer />
    </div>
  );
}