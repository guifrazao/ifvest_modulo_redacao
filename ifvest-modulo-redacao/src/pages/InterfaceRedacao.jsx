import "../styles/App.css"
import api from "../api.js"
import "../globals.js"
import { Header } from "../components/Header"
import { SubHeader } from "../components/SubHeader"
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EssayWritingBox } from "../components/AreaRedacao";
import { ActionButton } from "../components/BotaoAcao";
import { LoadingScreen } from "../components/TelaCarregamento.js";
import { idUsuario, rotaArea, idIA } from "../globals.js"

/* TODO: Mudar lineHeight da área de digitação, implementar orientações abaixo dos textos de apoio (redija uma redação com o tema...), dar mais destaque ao título*/

export default function InterfaceRedacao(){
  
    const [componentList, setComponentList] = useState([]);
    const [essayTitle, setEssayTitle] = useState("");
    const [essayText, setEssayText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();

    async function handleSubmitEssay(type) {
        if (!essayText.trim()) {
            alert("Escreva ou envie sua redação antes de enviar para correção");
            return;
        }

        try {
          const response = await api.post("/essay/create/", {
              submitted_text: essayText,
              image_url: null,
              submitted_at: new Date().toISOString(),
              user_id: idUsuario,
              proposta_id: Number(id),
          });

          console.log("Redação criada:", response.data);
          const essayId = response.data.id;

            if (type === "ai") {
              await api.post("/correction/ai/create/", {
                essay_id: response.data.id,
                corrector_id: idIA,
                comment_ids: [],
              })

              alert("Sua redação foi corrigida pela IA");
            } else {
              alert("Sua redação foi enviada para correção");
            }
            
            navigate(rotaArea)

        } catch (error) {
            console.error("Erro ao criar redação:", error);
            alert("Não foi possível enviar a redação");
        }
    }

    useEffect(() => {
      async function getProposta() {
        try{
          const response = await api.get(`/proposta/${id}/`);
          const proposta = response.data;

          setEssayTitle(proposta.title);
          console.log(proposta.support_texts)

          const textos = proposta.support_texts.map((st, index) => ({
                    type:  st.type,
                    label: `TEXTO ${index + 1}`,
                    title: st.title,
                    body:  st.content,
                    source: st.source,
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
                  <EssayWritingBox essayText={essayText} setEssayText={setEssayText}/>

                  {/* Botões de correção */}
                  <div style={{ display: "flex", gap: 8, marginTop: 10, width: "100%", }}>
                    <div style={{flex: 1}}>
                      <ActionButton 
                        onClick={() => handleSubmitEssay("ai")}
                        text="Correção com IA"
                        color="var(--btn-correcao-ia)"
                        textColor="#ffffff"
                        borderRadius={8}
                        width={"100%"}
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <ActionButton 
                        onClick={() => handleSubmitEssay("human")}
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