import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/App.css";
import api from "../api";
import "../globals";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { SupportTextsContainer, SupportTextWithId } from "../components/ContainerTextosApoio";
import { Footer } from "../components/Footer";
import { EssayWritingBox } from "../components/AreaRedacao";
import { ActionButton } from "../components/BotaoAcao";
import { LoadingScreen } from "../components/TelaCarregamento";
import { idCorretor, rotaArea, idIA } from "../globals";
import { resolveStaticUrl } from "../utils/media";

export type CorrectionType = "ai" | "human";

interface SupportTextDTO {
  type: "text" | "image";
  title?: string;
  content?: string;
  source?: string;
  image_url?: string;
}

interface PropostaDTO {
  id: number;
  title: string;
  support_texts: SupportTextDTO[];
}

interface EssayCreateResponse {
  id: number;
  [key: string]: unknown;
}

export default function InterfaceRedacao() {
  const [componentList, setComponentList] = useState<SupportTextWithId[]>([]);
  const [essayTitle, setEssayTitle] = useState<string>("");
  const [essayText, setEssayText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>("Carregando proposta de redação...");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  async function handleSubmitEssay(type: CorrectionType) {
    if (!essayText.trim()) {
      alert("Escreva ou envie sua redação antes de enviar para correção");
      return;
    }

    setLoadingMessage(type === "ai" ? "A IA está corrigindo sua redação..." : "Enviando redação...");
    setIsLoading(true);

    try {
      const response = await api.post<EssayCreateResponse>("/essay/create/", {
        submitted_text: essayText,
        image_url: null,
        submitted_at: new Date().toISOString(),
        user_id: idCorretor,
        proposta_id: Number(id),
      });

      console.log("Redação criada:", response.data);

      if (type === "ai") {
        const ai_response = await api.post("/correction/ai/create/", {
          essay_id: response.data.id,
          corrector_id: idIA,
          comment_ids: [],
        });

        if (ai_response.data) {
          alert("Sua redação foi corrigida pela IA");
        }
      } else {
        alert("Sua redação foi enviada para correção");
      }

      navigate(rotaArea);
    } catch (error) {
      console.error("Erro ao criar redação:", error);
      alert("Não foi possível enviar a redação");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getProposta() {
      if (!id) return;

      try {
        const response = await api.get<PropostaDTO>(`/proposta/${id}/`);
        const proposta = response.data;

        setEssayTitle(proposta.title);

        const textos: SupportTextDTO[] = proposta.support_texts.map((st, index) => {
          const baseText = {
            label: `TEXTO ${index + 1}`,
            title: st.title,
            source: st.source,
          };

          if (st.type === "image") {
            return {
              ...baseText,
              type: "image" as const,
              imageUrl: st.image_url ? resolveStaticUrl(st.image_url) : undefined,
            };
          }

          return {
            ...baseText,
            type: "text" as const,
            body: st.content,
          };
        });

        setComponentList(textos);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar redação: ", error);
        setIsLoading(false);
      }
    }

    getProposta();
  }, [id]);

  if (isLoading) return <LoadingScreen message={loadingMessage} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: "0 auto",
        background: "var(--fundo-pagina)",
        boxShadow: "0 0 18px rgba(0,0,0,.12)",
      }}
    >
      <Header onProfileClick={() => {}} />

      <SubHeader title={essayTitle} onBack={() => navigate(-1)} />

      {/* Corpo */}
      <main
        style={{
          flex: 1,
          padding: "14px 12px",
          display: "flex",
          flexDirection: "row",
          gap: 16,
          width: "100%",
          maxWidth: 1200,
          alignSelf: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <SupportTextsContainer items={componentList} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <EssayWritingBox essayText={essayText} setEssayText={setEssayText} />

          {/* Botões de correção */}
          <div style={{ display: "flex", gap: 8, marginTop: 10, width: "100%" }}>
            <div style={{ flex: 1 }}>
              <ActionButton
                onClick={() => handleSubmitEssay("ai")}
                text="Correção com IA"
                color="var(--btn-correcao-ia)"
                textColor="#ffffff"
                borderRadius={8}
                width={"100%"}
              />
            </div>
            <div style={{ flex: 1 }}>
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

      <Footer />
    </div>
  );
}