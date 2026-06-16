import T from "../styles/tokens"
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
import { SuppTextCreationArea } from "../components/FormCriacaoTxtApoio";


export default function InterfaceCriarRedacao(){
    const [page,  setPage]  = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [componentList, setComponentList] = useState([])

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

            <SubHeader title="Redação" onBack={() => navigate(-1)} />

            {/* Corpo */}
            <main style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", width: "100%", maxWidth: 700, alignSelf: "center" }}>
                <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                    {/* Container recebe uma lista que contém os textos de apoio */}
                    <SupportTextsContainer items={componentList}>
                        {isCreating ? (
                            <SuppTextCreationArea
                                onCancel={() => setIsCreating(false)}
                                onInsert={(data) => {
                                    addComponent(data)
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
                    <ActionButton
                        text="Criar proposta"
                        color="#2d6a4f"
                        textColor="#ffffff"
                        borderRadius={20}
                    />
                </div>
                
            </main>

            <Footer></Footer>
        </div>
    )
}