import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import T from "../styles/tokens";
import api from "../api";
import { resolveStaticUrl } from "../utils/media";
import { idCorretor, rotaPrincipal } from "../globals";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { SupportTextsContainer, SupportTextWithId } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import { ActionButton } from "../components/BotaoAcao";
import { SuppTextCreationArea } from "../components/FormCriacaoTxtApoio";
import { TagsInput } from "../components/TagsInput";

export interface SupportTextFormData {
  title: string;
  bodyText?: string | null;
  type: "texto" | "figura";
  source: string;
  file?: File | null;
}

export default function InterfaceCriarRedacao() {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [componentList, setComponentList] = useState<SupportTextWithId[]>([]);
  const [supportTextIds, setSupportTextIds] = useState<(number | string)[]>([]);
  const [essayTitle, setEssayTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>(["Educação"]);

  const navigate = useNavigate();

  const addComponent = (data: SupportTextFormData, serverImageURL: string | null = null) => {
    const isImage = data.type === "figura";
    const label = `TEXTO ${componentList.length + 1}`;
    const id = Date.now();

    const newItem: SupportTextWithId = isImage
      ? {
          id,
          type: "image",
          label,
          title: data.title,
          source: data.source,
          imageUrl: serverImageURL ? resolveStaticUrl(serverImageURL) : undefined,
        }
      : {
          id,
          type: "text",
          label,
          title: data.title,
          source: data.source,
          body: data.bodyText ?? undefined,
        };

    setComponentList((prev) => [...prev, newItem]);
  };

  async function createSupportText(data: SupportTextFormData) {
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

      const response = await api.post("/support_text/create_text/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addComponent(data, response.data.image_url);
      setSupportTextIds((prev) => [...prev, response.data.id]);
    } catch (error) {
      alert("Erro ao criar texto de apoio: " + error);
    }
  }

  async function createEssay() {
    try {
      const payload = {
        title: essayTitle,
        created_at: new Date().toISOString(),
        support_text_ids: supportTextIds,
        tags: tags,
        creator_id: idCorretor,
      };

      await api.post("/proposta/create/", payload);
      navigate(rotaPrincipal);
    } catch (error) {
      alert("Erro ao criar proposta: " + error);
    }
  }

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
          <SupportTextsContainer items={componentList}>
            {isCreating ? (
              <SuppTextCreationArea
                onCancel={() => setIsCreating(false)}
                onInsert={async (data: SupportTextFormData) => {
                  await createSupportText(data);
                  setIsCreating(false);
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

      <Footer />
    </div>
  );
}