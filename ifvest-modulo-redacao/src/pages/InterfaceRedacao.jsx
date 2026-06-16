import "../styles/App.css"
import { Header } from "../components/Header"
import { SubHeader } from "../components/SubHeader"
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginationBar } from "../components/Paginacao";
import { EssayWritingBox } from "../components/AreaRedacao";
import BasicTxtBox from "../components/TxtBoxBasica";
import { ActionButton } from "../components/BotaoAcao";
import { SupportTextItem } from "../components/TextoApoio";

//Dados temporários
const textosApoio = [
  {type: "text", label: "TEXTO I", title: "O QUE É EDUCAÇÃO PROFISSIONAL", body: "Educação Profissional é o modelo de aprendizagem com foco no desenvolvimento de competências e habilidades técnicas para suprir a demanda do mercado de trabalho. São oferecidos cursos para trabalhadores jovens e adultos, independente de escolaridade, com o objetivo de qualificação e requalificação profissional. Para alunos jovens e adultos que estejam cursando ou tenham concluído o ensino são oferecidos cursos técnicos profissionalizantes"},
  {type: "text", label: "TEXTO II", title: "O QUE É EDUCAÇÃO PROFISSIONAL", body: "Educação Profissional é o modelo de aprendizagem com foco no desenvolvimento de competências e habilidades técnicas para suprir a demanda do mercado de trabalho. São oferecidos cursos para trabalhadores jovens e adultos, independente de escolaridade, com o objetivo de qualificação e requalificação profissional. Para alunos jovens e adultos que estejam cursando ou tenham concluído o ensino são oferecidos cursos técnicos profissionalizantes"},
  {type: "image", label: "TEXTO III", title: "O QUE É EDUCAÇÃO PROFISSIONAL",}
]

export default function InterfaceRedacao(){


    const [page,  setPage]  = useState(1);
    const [componentList, setComponentList] = useState(textosApoio);

    const navigate = useNavigate();

    return (

        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            margin: "0 auto",
            background: "var(--fundo-pagina)",
            boxShadow: "0 0 18px rgba(0,0,0,.12)",
        }}>
            <Header onProfileClick={() => {}} />

            <SubHeader title="Redação" onBack={() => navigate(-1)} />

            {/* Corpo */}
            <main style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", width: "100%", maxWidth: 700, alignSelf: "center" }}>
                <SupportTextsContainer items={componentList}>
                  
                </SupportTextsContainer>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", }}>
                  <EssayWritingBox
                    onAICorrect={() => {}}
                    onHumanCorrect={() => {}}
                  />
                  {/* Botões de correção */}
                  <div style={{ display: "flex", gap: 8, marginTop: 10, width: "100%", }}>
                    <div style={{flex: 1}}>
                      <ActionButton 
                        onClick={() => alert("Sua redação foi enviada para correção")}
                        text="Correção com IA"
                        color="var(--btn-correcao-ia)"
                        textColor="#ffffff"
                        borderRadius={8}
                        width={"100%"}
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <ActionButton 
                        onClick={() => alert("Sua redação foi enviada para correção")}
                        text="Correção com corretor"
                        color="var(--btn-correcao-prof)"
                        textColor="#ffffff"
                        borderRadius={8}
                        width={"100%"}
                      />
                    </div>
                  </div>               
                </div>
            </main>

            <Footer></Footer>
        </div>
    )
}