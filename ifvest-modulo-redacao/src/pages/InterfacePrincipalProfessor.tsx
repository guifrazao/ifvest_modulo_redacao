import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import T from "../styles/tokens";
import api from "../api";
import { idCorretor } from "../globals";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { EssayTopicCard, EssayStatus } from "../components/CardRedacao";
import { PaginationBar } from "../components/Paginacao";
import { Footer } from "../components/Footer";
import { TopicSearchBar, SortOrder } from "../components/BarraPesquisa";
import { ActionButton } from "../components/BotaoAcao";
import { LoadingScreen } from "../components/TelaCarregamento";

export interface PropostaTopic {
  id_proposta: number;
  title: string;
  created_at: string;
  tags: string[];
  status: EssayStatus;
}

export default function InterfaceProf() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");

  const [topics, setTopics] = useState<PropostaTopic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function getEssays() {
      try {
        const response = await api.get(`/proposta/?user_id=${idCorretor}`);

        const propostas: PropostaTopic[] = response.data.map((proposta: any) => ({
          id_proposta: proposta.id_proposta,
          title: proposta.title,
          created_at: proposta.created_at,
          tags: proposta.tags ?? [],
          status: (proposta.status as EssayStatus) ?? "not_done",
        }));

        setTopics(propostas);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar propostas: ", error);
      }
    }

    getEssays();
  }, []);

  const availableTags = useMemo(() => {
    const todas = topics.flatMap((t) => t.tags ?? []);
    return [...new Set(todas)].sort();
  }, [topics]);

  const filtered = useMemo(() => {
    return topics
      .filter((t) => (t.title ? t.title.toLowerCase().includes(query.toLowerCase()) : false))
      .filter((t) => selectedTags.length === 0 || (t.tags ?? []).some((tag) => selectedTags.includes(tag)))
      .sort((a, b) => {
        const dataA = new Date(a.created_at).getTime();
        const dataB = new Date(b.created_at).getTime();
        return sortOrder === "recent" ? dataB - dataA : dataA - dataB;
      });
  }, [topics, query, selectedTags, sortOrder]);

  if (isLoading) return <LoadingScreen message="Carregando propostas de redação..." />;

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

      <SubHeader title="Redação" onBack={() => navigate(-1)} />

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1500,
          padding: "12px 10px 16px",
          alignSelf: "center",
          background: T.fundoPagina,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2px 6px 8px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: T.corLabelTemas,
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Temas de redação
          </span>

          <div style={{ display: "flex", gap: "4px" }}>
            <ActionButton
              text="Minhas Propostas"
              textColor={T.textoBtnProf}
              color={T.btnAreaProf}
              borderRadius={20}
              onClick={() => navigate("/minhas_propostas")}
            />
            <ActionButton
              text="Minhas redações"
              textColor={T.textoBtnAluno}
              color={T.btnAreaAluno}
              borderRadius={20}
              onClick={() => navigate("/area_corretor")}
            />
            <ActionButton
              text="Criar nova proposta"
              textColor={T.textoBtnProf}
              color={T.btnAreaProf}
              borderRadius={20}
              onClick={() => navigate("/criar_redacao")}
            />
          </div>
        </div>

        <TopicSearchBar
          placeholder="Pesquisar temas de redação..."
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        <div className="row" style={{ margin: "0 -8px" }}>
          {filtered.map((topic) => (
            <div key={topic.id_proposta} className="col-s-6 col-6" style={{ padding: "8px" }}>
              <EssayTopicCard
                title={topic.title}
                status={topic.status}
                onClick={() => navigate(`/proposta/${topic.id_proposta}`)}
              />
            </div>
          ))}
        </div>
      </main>

      <PaginationBar total={9} current={page} onPageChange={setPage} />

      <Footer />
    </div>
  );
}