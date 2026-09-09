import T from "../styles/tokens"
import api from "../api";
import { idCorretor, rotaPrincipal } from "../globals";
import { Header } from "../components/Header"
import { SubHeader } from "../components/SubHeader"
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActionButton } from "../components/BotaoAcao";
import { SuppTextCreationArea } from "../components/FormCriacaoTxtApoio";
import { TagsInput } from "../components/TagsInput";
import { LoadingScreen } from "../components/TelaCarregamento";
import { resolveStaticUrl } from "../utils/media";

export default function InterfaceEditarProposta(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null); // id do texto de apoio em edição, ou null

    const [componentList, setComponentList] = useState([]);
    const [essayTitle, setEssayTitle] = useState("");
    const [tags, setTags] = useState([]);

    useEffect(() => {
        async function fetchProposta() {
            try {
                const response = await api.get(`/proposta/${id}/`);
                const proposta = response.data;

                setEssayTitle(proposta.title);
                setTags(proposta.tags ?? []);             
                setComponentList(
                    proposta.support_texts.map((st, index) => ({
                        id: st.id,
                        label: `TEXTO ${index + 1}`,
                        title: st.title,
                        body: st.content,
                        type: st.type,
                        source: st.source,
                        imageUrl: st.type === "image" ? resolveStaticUrl(st.image_url) : null,
                    }))
                );

            } catch (error) {
                console.error("Erro ao carregar proposta:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProposta();
    }, [id]);

    async function handleUpdateSupportText(supportTextId, data) {
        try {
            await api.put(`/support_text/${supportTextId}/`, {
                title: data.title,
                type: data.type === "figura" ? "image" : "text",
                content: data.type === "texto" ? data.bodyText : undefined,
                source: data.source,
            });

            setComponentList(prev => prev.map(item =>
                item.id === supportTextId
                    ? { ...item, title: data.title, body: data.bodyText, source: data.source, type: data.type === "figura" ? "image" : "text" }
                    : item
            ));
            setEditingId(null);
        } catch (error) {
            alert("Erro ao editar texto de apoio: " + error);
        }
    }

    async function handleDeleteSupportText(supportTextId) {
        if (!window.confirm("Remover este texto de apoio?")) return;
        try {
            await api.delete(`/support_text/${supportTextId}/`);
            setComponentList(prev => prev.filter(item => item.id !== supportTextId));
        } catch (error) {
            alert("Erro ao remover texto de apoio: " + error);
        }
    }

    async function createSupportText(data) {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("type", data.type === "figura" ? "image" : "text");
            formData.append("source", data.source);
            formData.append("id_proposta", id);
            if (data.type === "texto") formData.append("content", data.bodyText);
            else formData.append("file", data.file);

            const response = await api.post("/support_text/create_text/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setComponentList(prev => [...prev, {
                id: response.data.id,
                label: `TEXTO ${prev.length + 1}`,
                title: data.title,
                body: data.bodyText,
                type: data.type === "figura" ? "image" : "text",
                source: data.source,
                imageUrl: data.type === "figura" ? resolveStaticUrl(response.data.image_url) : null,
            }]);

        } catch (error) {
            alert("Erro ao criar texto de apoio: " + error);
        }
    }

    async function handleUpdateProposta() {
        try {
            await api.put(`/proposta/${id}/`, {
                title: essayTitle,
                tags: tags,
            });
            navigate("/minhas_propostas/");
        } catch (error) {
            alert("Erro ao salvar proposta: " + error);
        }
    }

    if (isLoading) return <LoadingScreen message="Carregando proposta..." />;

    return (
        <div style={{
            display: "flex", flexDirection: "column", minHeight: "100vh",
            margin: "0 auto", background: T.fundoPagina, boxShadow: "0 0 18px rgba(0,0,0,.12)",
        }}>
            <Header onProfileClick={() => {}} />
            <SubHeader title={essayTitle} readOnly={false} onTitleChange={(e) => setEssayTitle(e.target.value)} onBack={() => navigate(-1)} />

            <main style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", width: "100%", maxWidth: 700, alignSelf: "center" }}>
                <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>

                    <SupportTextsContainer
                      items={componentList}
                      editable={true}
                      onEdit={(itemId) => {
                          setEditingId(itemId);
                          setIsCreating(false); // Garante que feche o modo de criação se estiver aberto
                      }}
                      onDelete={handleDeleteSupportText}
                    >
                        {isCreating || editingId ? (
                            <SuppTextCreationArea
                                key={editingId || "creating"} 
                                initialData={editingId ? componentList.find(c => c.id === editingId) : null}
                                onCancel={() => {
                                    setIsCreating(false);
                                    setEditingId(null);
                                }}
                                onInsert={async (data) => {
                                    if (editingId) {
                                        await handleUpdateSupportText(editingId, data);
                                    } else {
                                        await createSupportText(data);
                                    }
                                    setIsCreating(false);
                                    setEditingId(null);
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
                        text="Salvar alterações"
                        color="#2d6a4f"
                        textColor="#ffffff"
                        borderRadius={20}
                        onClick={handleUpdateProposta}
                    />
                </div>
            </main>

            <Footer></Footer>
        </div>
    )
}