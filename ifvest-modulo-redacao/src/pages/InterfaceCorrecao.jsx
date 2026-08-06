import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api.js";
import T from "../styles/tokens";
import { idCorretor } from "../globals.js";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { Footer } from "../components/Footer";
import { ActionButton } from "../components/BotaoAcao.js";
import { AnnotationForm } from "../components/FormComentario";
import { SupportTextsContainer } from "../components/ContainerTextosApoio";
import { LoadingScreen } from "../components/TelaCarregamento";

const competenciasDisponiveis = [
  { id: "c1", label: "Competência 1", cor: "#fbc02d" },
  { id: "c2", label: "Competência 2", cor: "#82f436" },
  { id: "c3", label: "Competência 3", cor: "#e91e63" },
  { id: "c4", label: "Competência 4", cor: "#2196f3" },
  { id: "c5", label: "Competência 5", cor: "#9c27b0" },
];

const dadosCompetenciasEnem = [
  { id: "c1", nome: "Competência 1", desc: "Demonstrar domínio da modalidade escrita formal da língua portuguesa." },
  { id: "c2", nome: "Competência 2", desc: "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema." },
  { id: "c3", nome: "Competência 3", desc: "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista." },
  { id: "c4", nome: "Competência 4", desc: "Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação." },
  { id: "c5", nome: "Competência 5", desc: "Elaborar proposta de intervenção para o problema abordado, que respeite os direitos humanos." }
];


/* Componente memoizado para impedir que a seleção do DOM seja limpa em re-renderizações do pai */
const TextoRedacao = React.memo(
  React.forwardRef(function TextoRedacao({ html, onClick, onMouseOver, onMouseOut, readOnly }, ref) {
    return (
      <div
        ref={ref}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        className={`container-redacao-correcao ${readOnly ? "container-redacao-readonly" : ""}`}
        style={readOnly ? { cursor: "default" } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  })
);

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function construirHtmlComMarcacoes(texto, comentarios) {
  if (!texto) return "";
  if (!comentarios || comentarios.length === 0) return escapeHtml(texto).replaceAll("\n", "<br/>");

  const ordenados = [...comentarios]
    .filter(c => typeof c.startOffset === "number" && typeof c.endOffset === "number")
    .sort((a, b) => a.startOffset - b.startOffset);

  let cursor = 0;
  let html = "";

  for (const c of ordenados) {
    if (c.startOffset < cursor) continue;

    html += escapeHtml(texto.slice(cursor, c.startOffset));
    const trecho = texto.slice(c.startOffset, c.endOffset);
    html += `<mark data-id="${c.id}" style="background-color:${c.cor};color:inherit;cursor:pointer;">${escapeHtml(trecho)}</mark>`;
    cursor = c.endOffset;
  }

  html += escapeHtml(texto.slice(cursor));
  return html.replaceAll("\n", "<br/>");
}

function getCharOffsetInContainer(container, targetNode, targetOffset) {
  let offset = 0;
  let found = false;

  function traverse(node) {
    if (found) return;

    if (node === targetNode) {
      if (node.nodeType === Node.TEXT_NODE) {
        offset += Math.min(targetOffset, node.nodeValue.length);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < targetOffset && i < node.childNodes.length; i++) {
          traverse(node.childNodes[i]);
        }
      }
      found = true;
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      offset += node.nodeValue.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        offset += 1;
      } else {
        for (let child of node.childNodes) {
          traverse(child);
          if (found) break;
        }
      }
    }
  }

  traverse(container);
  return offset;
}

function getContainerTextLength(container) {
  let length = 0;
  function traverse(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      length += node.nodeValue.length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        length += 1;
      } else {
        for (let child of node.childNodes) {
          traverse(child);
        }
      }
    }
  }
  traverse(container);
  return length;
}

function getSelectionOffsets(container) {
  if (!container) return null;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);

  const startInside = container.contains(range.startContainer);
  const endInside = container.contains(range.endContainer);

  const isStartBefore = !startInside &&
    Boolean(container.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_PRECEDING);
  const isEndBefore = !endInside &&
    Boolean(container.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_PRECEDING);

  if (isStartBefore && isEndBefore) return null;

  const isStartAfter = !startInside &&
    Boolean(container.compareDocumentPosition(range.startContainer) & Node.DOCUMENT_POSITION_FOLLOWING);
  const isEndAfter = !endInside &&
    Boolean(container.compareDocumentPosition(range.endContainer) & Node.DOCUMENT_POSITION_FOLLOWING);

  if (isStartAfter && isEndAfter) return null;

  let startOffset = 0;
  if (startInside) {
    startOffset = getCharOffsetInContainer(container, range.startContainer, range.startOffset);
  } else if (isStartBefore) {
    startOffset = 0;
  } else if (isStartAfter) {
    startOffset = getContainerTextLength(container);
  }

  let endOffset = 0;
  if (endInside) {
    endOffset = getCharOffsetInContainer(container, range.endContainer, range.endOffset);
  } else if (isEndBefore) {
    endOffset = 0;
  } else if (isEndAfter) {
    endOffset = getContainerTextLength(container);
  }

  if (startOffset >= endOffset) return null;

  return { startOffset, endOffset, rawRange: range };
}

function getClampedBoundingRect(container, rawRange) {
  const clampedRange = document.createRange();

  if (container.contains(rawRange.startContainer)) {
    clampedRange.setStart(rawRange.startContainer, rawRange.startOffset);
  } else {
    clampedRange.setStart(container, 0);
  }

  if (container.contains(rawRange.endContainer)) {
    clampedRange.setEnd(rawRange.endContainer, rawRange.endOffset);
  } else {
    clampedRange.setEnd(container, container.childNodes.length);
  }

  return clampedRange.getBoundingClientRect();
}

export default function InterfaceCorrecao({ readOnly = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [essayData, setEssayData] = useState(null);
  const [correctorName, setCorrectorName] = useState(null);

  const [notasCompetencias, setNotasCompetencias] = useState({ c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 });
  const [comentarios, setComentarios] = useState([]);

  const [botaoFlutuante, setBotaoFlutuante] = useState({ visivel: false, x: 0, y: 0, startOffset: null, endOffset: null });
  const [hoveredComment, setHoveredComment] = useState(null);
  const [activePopoverComment, setActivePopoverComment] = useState(null);

  const redacaoRef = useRef(null);

  const notaTotal = Object.values(notasCompetencias).reduce((acc, curr) => acc + curr, 0);

  const notasValidas = [0, 40, 80, 120, 160, 200];

  const incrementarNota = (compId) => {
    if (readOnly) return;
    setNotasCompetencias(prev => {
      const atual = prev[compId];
      const proxima = Math.min(atual + 40, 200);
      return { ...prev, [compId]: proxima };
    });
  };

const decrementarNota = (compId) => {
  if (readOnly) return;
  setNotasCompetencias(prev => {
    const atual = prev[compId];
    const anterior = Math.max(atual - 40, 0);
    return { ...prev, [compId]: anterior };
  });
};

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await api.get(`/essay/${id}`);
        const data = response.data;
        setEssayData(data);

        if (data.correction) {
          setNotasCompetencias({
            c1: data.correction.c1_score,
            c2: data.correction.c2_score,
            c3: data.correction.c3_score,
            c4: data.correction.c4_score,
            c5: data.correction.c5_score,
          });
          setCorrectorName(data.correction.corrector_name);

          const comentariosCarregados = data.correction.comments.map(c => {
            const compInfo = competenciasDisponiveis.find(cd => cd.id === c.competence);
            return {
              id: String(c.id),
              competencia: compInfo?.label ?? c.competence,
              cor: compInfo?.cor ?? "#999",
              comentario: c.content,
              startOffset: c.start_offset,
              endOffset: c.end_offset,
              isNovo: false,
            };
          });
          setComentarios(comentariosCarregados);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhe da redação:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  //Converte label da tabela de competências (Competência 1, etc) para o atributo no banco de dados (c1, etc)
  function converterLabelParaId(label) {
    const comp = competenciasDisponiveis.find(c => c.label === label);
    return comp ? comp.id : label;
  }

  async function handleCorrectionSubmit() {
    const possuiCorrecao = essayData?.correction != null; //Pra decidir se irá chamar requisição de criação ou edição

    //Caso algum comentário não exista no banco, ele é armazenado
    try{
      const comentariosNovos = comentarios.filter(c => c.isNovo);
      const comentariosSalvos = comentarios.filter(c => !c.isNovo);

      const criados = await Promise.all(
        comentariosNovos.map(c => 
          api.post("/comment/create/", {
            competence: converterLabelParaId(c.competencia),
            content: c.comentario,
            start_offset: c.startOffset,
            end_offset: c.endOffset,
          })
        )
      )

      const idsNovos = criados.map(r => r.data.id)
      const idsSalvos = comentariosSalvos.map(c => Number(c.id))
      const comment_ids = [...idsSalvos, ...idsNovos]

      const payload = {
        c1_score: notasCompetencias.c1,
        c2_score: notasCompetencias.c2,
        c3_score: notasCompetencias.c3,
        c4_score: notasCompetencias.c4,
        c5_score: notasCompetencias.c5,
        comment_ids,
      }

      if (possuiCorrecao){
        await api.put(`/correction/${id}/`, payload)
      }else{
        await api.post("/correction/create/", {
          ...payload,
          corrected_at: new Date().toISOString(),
          essay_id: Number(id),
          corrector_id: idCorretor,
        })
      }
      alert("Correção enviada com sucesso")
      navigate("/area/")
    }catch (error){
      console.error("Erro ao enviar correção: ", error)
      alert("Erro ao enviar correção")
    }
  }

  const htmlRedacao = useMemo(
    () => construirHtmlComMarcacoes(essayData?.submitted_text, comentarios),
    [essayData?.submitted_text, comentarios]
  );

  const supportTextItems = useMemo(() => {
    const textos = essayData?.support_texts ?? []
    return textos.map((st, index) => ({
      type: st.type,
      label: `TEXTO ${index + 1}`,
      title: st.title,
      body: st.content,
    }))
  }, [essayData?.support_texts])

  const handleNotaChange = (compId, valor) => {
    if (readOnly) return;
    let num = parseInt(valor, 10) || 0;
    if (num < 0) num = 0;
    if (num > 200) num = 200;
    setNotasCompetencias(prev => ({ ...prev, [compId]: num }));
  };

  useEffect(() => {
    const fecharMenusAoClicarFora = (e) => {
      if (
        e.target.closest("mark") ||
        e.target.closest(".comment-popover-card") ||
        e.target.closest(".btn-floating-comment")
      ) {
        return;
      }
      setActivePopoverComment(null);
    };
    window.addEventListener("click", fecharMenusAoClicarFora);
    return () => window.removeEventListener("click", fecharMenusAoClicarFora);
  }, []);

  useEffect(() => {
    const processarSelecaoGlobal = (e) => {
      if (readOnly || !redacaoRef.current) return;

      if (e && e.target && e.target.closest && e.target.closest(".btn-floating-comment")) {
        return;
      }

      setTimeout(() => {
        if (!redacaoRef.current) return;
        const offsetsInfo = getSelectionOffsets(redacaoRef.current);

        if (offsetsInfo && offsetsInfo.startOffset < offsetsInfo.endOffset) {
          const rect = getClampedBoundingRect(redacaoRef.current, offsetsInfo.rawRange);
          const containerRect = redacaoRef.current.getBoundingClientRect();

          setBotaoFlutuante({
            visivel: true,
            x: containerRect.right + 15,
            y: rect.top + window.scrollY,
            startOffset: offsetsInfo.startOffset,
            endOffset: offsetsInfo.endOffset
          });
        } else {
          const sel = window.getSelection();
          if (!sel || sel.isCollapsed || sel.toString().trim() === "") {
            setBotaoFlutuante(prev => ({ ...prev, visivel: false }));
          }
        }
      }, 10);
    };

    document.addEventListener("mouseup", processarSelecaoGlobal);
    document.addEventListener("keyup", processarSelecaoGlobal);

    return () => {
      document.removeEventListener("mouseup", processarSelecaoGlobal);
      document.removeEventListener("keyup", processarSelecaoGlobal);
    };
  }, [readOnly]);

  const iniciarCriacaoComentario = (dadosOrigem = null) => {
    if (readOnly || !redacaoRef.current) return;

    const info = dadosOrigem || botaoFlutuante;
    if (typeof info.startOffset !== "number" || typeof info.endOffset !== "number") return;
    if (info.startOffset >= info.endOffset) return;

    const idProvisorio = "temp-" + Date.now().toString();
    const compPadrao = competenciasDisponiveis[0];

    const novoEsboco = {
      id: idProvisorio,
      competencia: compPadrao.label,
      cor: compPadrao.cor,
      comentario: "",
      startOffset: info.startOffset,
      endOffset: info.endOffset,
      isNovo: true
    };

    setComentarios(prev => [...prev, novoEsboco]);
    setBotaoFlutuante({ visivel: false, x: 0, y: 0, startOffset: null, endOffset: null });

    setTimeout(() => {
      const markNode = redacaoRef.current?.querySelector(`mark[data-id="${idProvisorio}"]`);
      if (markNode) {
        const rect = markNode.getBoundingClientRect();
        setActivePopoverComment({
          id: idProvisorio,
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX + rect.width / 2,
          isEditing: true
        });
      }
    }, 80);

    window.getSelection().removeAllRanges();
  };

  const handleTextClick = useCallback((e) => {
    let node = e.target;
    while (node && node !== redacaoRef.current) {
      if (node.tagName === "MARK") {
        const idDestaque = node.getAttribute("data-id");
        const rect = node.getBoundingClientRect();

        setActivePopoverComment({
          id: idDestaque,
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX + rect.width / 2,
          isEditing: false
        });
        return;
      }
      node = node.parentNode;
    }
  }, []);

  const handleMouseOverText = useCallback((e) => {
    let node = e.target;
    while (node && node !== redacaoRef.current) {
      if (node.tagName === "MARK") {
        const idc = node.getAttribute("data-id");
        if (activePopoverComment && activePopoverComment.id === idc) return;

        const comentarioObj = comentarios.find(c => c.id === idc);
        if (comentarioObj && comentarioObj.comentario) {
          const rect = node.getBoundingClientRect();
          setHoveredComment({
            id: idc,
            top: rect.top + window.scrollY - 45,
            left: rect.left + window.scrollX + rect.width / 2,
            texto: comentarioObj.comentario
          });
        }
        break;
      }
      node = node.parentNode;
    }
  }, [activePopoverComment, comentarios]);

  const ocultarTooltip = useCallback(() => setHoveredComment(null), []);

  const consolidarComentarioDefinitivo = (idc) => {
    if (readOnly) return;
    setActivePopoverComment(null);
  };

  const removerApenasSelecao = (idc) => {
    if (readOnly) return;
    setComentarios(prev => prev.filter(c => c.id !== idc));
    setActivePopoverComment(null);
  };

  const alterarCompetenciaComentario = (idc, labelCompetencia) => {
    if (readOnly) return;
    const novaComp = competenciasDisponiveis.find(c => c.label === labelCompetencia);
    if (!novaComp) return;

    setComentarios(prev => prev.map(c =>
      c.id === idc ? { ...c, competencia: novaComp.label, cor: novaComp.cor } : c
    ));
  };

  const atualizarTextoComentario = (idc, texto) => {
    if (readOnly) return;
    setComentarios(prev => prev.map(c => c.id === idc ? { ...c, comentario: texto } : c));
  };

  if (isLoading) return <LoadingScreen message="Carregando correção..." />;

  return (
    <div className="page-wrapper">
      <Header onProfileClick={() => {}} />
      <SubHeader
        title={essayData ? `${essayData.title}${correctorName ? " — Corrigido por " + correctorName : ""}` : ""}
        onBack={() => navigate(-1)}
      />

      {hoveredComment && (
        <div className="comment-hover-tooltip" style={{ top: hoveredComment.top, left: hoveredComment.left }}>
          {hoveredComment.texto}
        </div>
      )}

      {activePopoverComment && (() => {
        const item = comentarios.find(c => c.id === activePopoverComment.id);
        if (!item) return null;
        return (
          <AnnotationForm
            competenciaSelecionada={item.competencia}
            onCompetenciaChange={(novaLabel) => alterarCompetenciaComentario(item.id, novaLabel)}
            competenciasDisponiveis={competenciasDisponiveis}
            comentario={item.comentario}
            onComentarioChange={(novoTxt) => atualizarTextoComentario(item.id, novoTxt)}
            isNovoComentario={!!item.isNovo}
            onCriarComentario={() => consolidarComentarioDefinitivo(item.id)}
            isEditing={activePopoverComment.isEditing}
            onStartEdit={() => setActivePopoverComment(prev => ({ ...prev, isEditing: true }))}
            onSaveEdit={() => setActivePopoverComment(null)}
            onDelete={() => removerApenasSelecao(item.id)}
            readOnly={readOnly}
            style={{ top: activePopoverComment.top, left: activePopoverComment.left }}
          />
        );
      })()}

      {!readOnly && botaoFlutuante.visivel && (
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => iniciarCriacaoComentario(botaoFlutuante)}
          className="btn-floating-comment"
          style={{ top: botaoFlutuante.y, left: botaoFlutuante.x }}
          title="Adicionar comentário"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="7" x2="12" y2="13"></line>
            <line x1="9" y1="10" x2="15" y2="10"></line>
          </svg>
        </button>
      )}

      <main className="main-correcao-container">
        <div className="layout-table">
          <div className="layout-row">
            <div className="layout-col-esquerda">
              <SupportTextsContainer items={supportTextItems} />

              <div className="nota-total-container">
                <span className="nota-total-label">Nota Total Calculada:</span>
                <span className="nota-total-badge">{notaTotal} pts</span>
              </div>

              <TextoRedacao
                ref={redacaoRef}
                html={htmlRedacao}
                onClick={handleTextClick}
                onMouseOver={handleMouseOverText}
                onMouseOut={ocultarTooltip}
                readOnly={readOnly}
              />

              <div style={{marginTop: "12px"}}>
                <ActionButton 
                  onClick={handleCorrectionSubmit}
                  text="Enviar correção"
                  color="var(--btn-correcao-ia)"
                  textColor="#ffffff"
                  borderRadius={8}
                  width={"100%"}
                />
              </div>
            </div>

            <div className="layout-col-direita">
              <div className="grade-notas-card">
                <h3 className="grade-notas-titulo">Grade de Notas (ENEM)</h3>

                <div className="tabela-competencias-wrapper">
                  <table className="tabela-competencias">
                    <thead>
                      <tr>
                        {dadosCompetenciasEnem.map((comp) => (
                          <th key={comp.id} className={`comp-header-cell comp-header-${comp.id}`}>
                            {comp.nome}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {dadosCompetenciasEnem.map((comp) => (
                          <td key={comp.id} className={`comp-desc-cell comp-desc-${comp.id}`}>
                            {comp.desc}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        {dadosCompetenciasEnem.map((comp) => (
                          <td key={comp.id} className="comp-input-cell">
                            <div className="comp-stepper-wrapper">
                              <button
                                type="button"
                                onClick={() => decrementarNota(comp.id)}
                                disabled={readOnly || notasCompetencias[comp.id] <= 0}
                                className="comp-stepper-btn comp-stepper-btn-minus"
                                aria-label={`Diminuir nota da ${comp.nome}`}
                              >
                                −
                              </button>

                              <input
                                type="text"
                                inputMode="none"     
                                value={notasCompetencias[comp.id]}
                                readOnly
                                onKeyDown={(e) => e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                                className={`comp-input-field comp-input-${comp.id}`}
                                aria-label={`Nota da ${comp.nome}`}
                              />

                              <button
                                type="button"
                                onClick={() => incrementarNota(comp.id)}
                                disabled={readOnly || notasCompetencias[comp.id] >= 200}
                                className="comp-stepper-btn comp-stepper-btn-plus"
                                aria-label={`Aumentar nota da ${comp.nome}`}
                              >
                                +
                              </button>
                            </div>
                            <div className="comp-pts-label">pts</div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="soma-final-container">
                  <span className="soma-final-label">Soma Final:</span>
                  <span className="soma-final-valor">{notaTotal} / 1000 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}