import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import T from "../styles/tokens";
import api from "../api";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { SupportTextsContainer, SupportTextWithId } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import { ActionButton } from "../components/BotaoAcao";
import { SuppTextCreationArea } from "../components/FormCriacaoTxtApoio";
import { TagsInput } from "../components/TagsInput";
import { LoadingScreen } from "../components/TelaCarregamento";
import { resolveStaticUrl } from "../utils/media";

export interface SupportTextApi {
  id: number | string;
  title: string;
  type: "text" | "image";
  content?: string;
  source: string;
  image_url?: string | null;
}

export interface PropostaApi {
  id_proposta?: number | string;
  title: string;
  tags?: string[];
  support_texts: SupportTextApi[];
}

export interface SupportTextFormData {
  title: string;
  bodyText?: string | null;
  type: "texto" | "figura";
  source: string;
  file?: File | null;
}

export default function InterfaceEditarProposta() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const [componentList, setComponentList] = useState<SupportTextWithId[]>([]);
  const [essayTitle, setEssayTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProposta() {
      try {
        const response = await api.get<PropostaApi>(`/proposta/${id}/`);
        const proposta = response.data;

        setEssayTitle(proposta.title);
        setTags(proposta.tags ?? []);
        setComponentList(
          proposta.support_texts.map((st, index): SupportTextWithId => {
            const label = `TEXTO ${index + 1}`;
            if (st.type === "image") {
              return {
                id: st.id,
                type: "image",
                label,
                title: st.title,
                source: st.source,
                imageUrl: st.image_url ? resolveStaticUrl(st.image_url) : undefined,
              };
            }
            return {
              id: st.id,
              type: "text",
              label,
              title: st.title,
              source: st.source,
              body: st.content,
            };
          })
        );
      } catch (error) {
        console.error("Erro ao carregar proposta:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProposta();
  }, [id]);

  async function handleUpdateSupportText(supportTextId: number | string, data: SupportTextFormData) {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("type", data.type === "figura" ? "image" : "text");
    formData.append("source", data.source);

    if (data.type === "texto") {
      formData.append("content", data.bodyText || "");
    } else if (data.file) {
      formData.append("file", data.file);
    }

    const response = await api.put<SupportTextApi>(`/support_text/${supportTextId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setComponentList((prev) =>
      prev.map((item): SupportTextWithId => {
        if (item.id !== supportTextId) return item;

        if (response.data.type === "image") {
          return {
            id: item.id,
            type: "image",
            label: item.label,
            title: response.data.title,
            source: response.data.source,
            imageUrl: resolveStaticUrl(response.data.image_url),
          };
        }
        return {
          id: item.id,
          type: "text",
          label: item.label,
          title: response.data.title,
          source: response.data.source,
          body: response.data.content,
        };
      })
    );
    setEditingId(null);
  } catch (error) {
    alert("Erro ao editar texto de apoio: " + error);
  }
}

  async function handleDeleteSupportText(supportTextId?: number | string) {
    if (!supportTextId) return;
    if (!window.confirm("Remover este texto de apoio?")) return;
    try {
      await api.delete(`/support_text/${supportTextId}/`);
      setComponentList((prev) => prev.filter((item) => item.id !== supportTextId));
    } catch (error) {
      alert("Erro ao remover texto de apoio: " + error);
    }
  }

  async function createSupportText(data: SupportTextFormData) {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", data.type === "figura" ? "image" : "text");
      formData.append("source", data.source);
      if (id) formData.append("id_proposta", id);
      if (data.type === "texto") formData.append("content", data.bodyText || "");
      else if (data.file) formData.append("file", data.file);

      const response = await api.post("/support_text/create_text/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComponentList((prev) => {
        const isImage = data.type === "figura";
        const label = `TEXTO ${prev.length + 1}`;
        const newItem: SupportTextWithId = isImage
          ? {
              id: response.data.id,
              type: "image",
              label,
              title: data.title,
              source: data.source,
              imageUrl: response.data.image_url ? resolveStaticUrl(response.data.image_url) : undefined,
            }
          : {
              id: response.data.id,
              type: "text",
              label,
              title: data.title,
              source: data.source,
              body: data.bodyText ?? undefined,
            };
        return [...prev, newItem];
      });
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: "0 auto",
        background: T.fundoPagina,
        boxShadow: "0 0 18px rgba(0,0,0,.12)",
      }}
    >
      <Header onProfileClick={() => {}} />
      <SubHeader
        title={essayTitle}
        readOnly={false}
        onTitleChange={(e: React.ChangeEvent<HTMLInputElement>) => setEssayTitle(e.target.value)}
        onBack={() => navigate(-1)}
      />

      <main
        style={{
          flex: 1,
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 700,
          alignSelf: "center",
        }}
      >
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <SupportTextsContainer
            items={componentList}
            editable={true}
            onEdit={(itemId) => {
              if (itemId !== undefined) {
                setEditingId(itemId);
                setIsCreating(false);
              }
            }}
            onDelete={handleDeleteSupportText}
          >
            {isCreating || editingId ? (
              <SuppTextCreationArea
                key={editingId || "creating"}
                initialData={editingId ? componentList.find((c) => c.id === editingId) : undefined}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                onInsert={async (data: SupportTextFormData) => {
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

      <Footer />
    </div>
  );
}