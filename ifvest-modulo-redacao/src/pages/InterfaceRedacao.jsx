import "../styles/App.css"
import api from "../api.js"
import { Header } from "../components/Header"
import { SubHeader } from "../components/SubHeader"
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaginationBar } from "../components/Paginacao";
import { EssayWritingBox } from "../components/AreaRedacao";
import BasicTxtBox from "../components/TxtBoxBasica";
import { ActionButton } from "../components/BotaoAcao";
import { SupportTextItem } from "../components/TextoApoio";
import { LoadingScreen } from "../components/TelaCarregamento.js";

export default function InterfaceRedacao(){


    const [page,  setPage]  = useState(1);
    const [componentList, setComponentList] = useState([]);
    const [essayTitle, setEssayTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
      async function getProposta() {
        try{
          const response = await api.get(`/proposta/${id}/`);
          const proposta = response.data;

          setEssayTitle(proposta.title);

          const textos = proposta.support_texts.map((st, index) => ({
                    type:  st.type,
                    label: `TEXTO ${index + 1}`,
                    title: st.title,
                    body:  st.content,
                }));
          setComponentList(textos);
          setIsLoading(false);
        }catch (error){
          console.error("Erro ao carregar redação: ", error)
        }
      }

      getProposta();
    }, [id])

    if (isLoading) return <LoadingScreen message="Carregando proposta de redação..."/>

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

            <SubHeader title={essayTitle} onBack={() => navigate(-1)} />

            {/* Corpo */}
            <main style={{ flex: 1, 
              padding: "14px 12px", 
              display: "flex", 
              flexDirection: 
              "row", 
              gap: 16,
              width: "100%", 
              maxWidth: 1200, 
              alignSelf: "center" }}>
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}>
                  <SupportTextsContainer items={componentList}/>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
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
                        textColor="#000"
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