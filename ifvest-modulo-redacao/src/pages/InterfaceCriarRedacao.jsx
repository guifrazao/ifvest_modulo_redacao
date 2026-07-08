import T from "../styles/tokens"
import api from "../api";
import { rotaPrincipal } from "../globals.js"
import { Header } from "../components/Header"
import { SubHeader } from "../components/SubHeader"
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../components/BotaoAcao";
import { SupportTextItem } from "../components/TextoApoio";
import { SuppTextCreationArea } from "../components/FormCriacaoTxtApoio";
import { TagsInput } from "../components/TagsInput";

/* TODO: ADICIONAR BOTÕES EDITAR/REMOVER E MOVER AS TAGS PRA FORA DA CRIAÇÃO DE TEXTO DE APOIO */
export default function InterfaceCriarRedacao(){
    const [isCreating, setIsCreating] = useState(false);
    const [componentList, setComponentList] = useState([])
    const [supportTextIds, setSupportTextIds] = useState([]);
    const [essayTitle, setEssayTitle] = useState("")
    const [tags, setTags] = useState(["Educação"])

    const navigate = useNavigate();

    const addComponent = (data) => {
        setComponentList([...componentList, {
        id:    Date.now(),
        label: `TEXTO ${componentList.length + 1}`,
        title: data.title,
        body:  data.bodyText,
        type:  data.type === "figura" ? "image" : "text",
        }]);
    }

    async function createSupportText(data) { /* Apenas texto por enquanto */
        try{
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("type", data.type === "figura" ? "image" : "text");
            formData.append("source", data.source)

            if (data.type === "texto"){
                formData.append("content", data.bodyText);
            }else{
                formData.append("file", data.file);
            }

            const response = await api.post("/support_text/create_text/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            addComponent(data);

            setSupportTextIds((prev) => [...prev, response.data.id])

        }catch (error){
            alert("Erro ao criar texto de apoio: ", error)
        }
    }

    async function createEssay() {
        try{
            const payload = {
                title: essayTitle,
                created_at: new Date().toISOString(),
                support_text_ids: supportTextIds,
                tags: tags,
            };

            const response = await api.post("/proposta/create/", payload)
            navigate(rotaPrincipal)

        }catch (error){
            alert("Erro ao criar proposta: ", error)
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            margin: "0 auto",
            background: T.fundoPagina,
            boxShadow: "0 0 18px rgba(0,0,0,.12)",
        }}>
            <Header onProfileClick={() => {}} />

            <SubHeader title={essayTitle} readOnly={false} onTitleChange={(e) => setEssayTitle(e.target.value)} onBack={() => navigate(-1)} />

            {/* Corpo */}
            <main style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", width: "100%", maxWidth: 700, alignSelf: "center" }}>
                <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                    {/* Container recebe uma lista que contém os textos de apoio */}
                    <SupportTextsContainer items={componentList}>
                        {isCreating ? (
                            <SuppTextCreationArea
                                onCancel={() => setIsCreating(false)}
                                onInsert={async (data) => {
                                    await createSupportText(data)
                                    // addComponent(data)
                                    setIsCreating(false)                                 
                                }}
                            />
                        ) : (
                            <ActionButton
                                text={"Criar texto de apoio"}
                                color={T.btnCriarRed}
                                textColor={"#ffffff"}
                                borderRadius={20}
                                onClick={() => setIsCreating(true)}
                            />
                        )}

                    </SupportTextsContainer>

                    <TagsInput
                        tags={tags}
                        onChange={setTags}
                        initialOptions={["Educação", "Economia", "Saúde"]}
                    />    

                    <ActionButton
                        text="Criar proposta"
                        color="#2d6a4f"
                        textColor="#ffffff"
                        borderRadius={20}
                        onClick={() => createEssay()}
                    />
                </div>
                
            </main>

            <Footer></Footer>
        </div>
    )
}