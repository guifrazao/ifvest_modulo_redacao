import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import T from "../styles/tokens";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { Footer } from "../components/Footer";
import { AnnotationForm } from "../components/FormComentario";
import { SupportTextsContainer } from "../components/ContainerTextosApoio";

const competenciasDisponiveis = [
  { id: "c1", label: "Competência 1", cor: "#fbc02d" },
  { id: "c2", label: "Competência 2", cor: "#f44336" },
  { id: "c3", label: "Competência 3", cor: "#e91e63" },
  { id: "c4", label: "Competência 4", cor: "#2196f3" },
  { id: "c5", label: "Competência 5", cor: "#9c27b0" },
];

const dadosCompetenciasEnem = [
  { id: "c1", nome: "Competência 1", desc: "Demonstrar domínio da modalidade escrita formal da língua portuguesa." },
  { id: "c2", nome: "Competência 2", desc: "Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema." },
  { id: "c3", nome: "Competência 3", desc: "Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista." },
  { id: "c4", nome: "Competência 4", desc: "Demonstrar conhecimento dos mechanisms linguísticos necessários para a construção da argumentação." },
  { id: "c5", nome: "Competência 5", desc: "Elaborar proposta de intervenção para o problema abordado, que respeite os direitos humanos." }
];

export default function InterfaceCorrecao() {
  const [notasCompetencias, setNotasCompetencias] = useState({
    c1: 0,
    c2: 0,
    c3: 0,
    c4: 0,
    c5: 0
  });

  const [comentarios, setComentarios] = useState([]);
  const [botaoFlutuante, setBotaoFlutuante] = useState({ visivel: false, x: 0, y: 0, texto: "", range: null });
  const [hoveredComment, setHoveredComment] = useState(null); 
  const [activePopoverComment, setActivePopoverComment] = useState(null); 

  const redacaoRef = useRef(null);
  const navigate = useNavigate();

  const notaTotal = Object.values(notasCompetencias).reduce((acc, curr) => acc + curr, 0);

  const handleNotaChange = (id, valor) => {
    let num = parseInt(valor, 10) || 0;
    if (num < 0) num = 0;
    if (num > 200) num = 200;
    
    setNotasCompetencias(prev => ({
      ...prev,
      [id]: num
    }));
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

  const handleSelection = () => {
    const selection = window.getSelection();
    const textoSelecionado = selection.toString().trim();

    if (textoSelecionado.length > 0 && redacaoRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = redacaoRef.current.getBoundingClientRect();

      setBotaoFlutuante({
        visivel: true,
        x: containerRect.right + 15, 
        y: rect.top + window.scrollY, 
        texto: textoSelecionado,
        range: range.cloneRange()
      });
    } else {
      setTimeout(() => {
        if (window.getSelection().toString().trim() === "") {
          setBotaoFlutuante(prev => ({ ...prev, visivel: false }));
        }
      }, 150);
    }
  };

  const iniciarCriacaoComentario = (dadosOrigem = null) => {
    const info = dadosOrigem || botaoFlutuante;
    if (!info.range) return;

    const idProvisorio = "temp-" + Date.now().toString();
    const compPadrao = competenciasDisponiveis[0];

    const mark = document.createElement("mark");
    mark.setAttribute("data-id", idProvisorio);
    mark.style.backgroundColor = compPadrao.cor;
    mark.style.color = "inherit";
    mark.style.cursor = "pointer";

    try {
      info.range.surroundContents(mark);
      
      const novoEsboco = {
        id: idProvisorio,
        competencia: compPadrao.label,
        cor: compPadrao.cor,
        textoTrecho: info.texto,
        comentario: "",
        isNovo: true
      };

      setComentarios(prev => [...prev, novoEsboco]);
      setBotaoFlutuante({ visivel: false, x: 0, y: 0, texto: "", range: null });

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
      }, 60);

    } catch (err) {
      alert("Evite selecionar trechos que quebrem blocos internos de parágrafos.");
    }
    window.getSelection().removeAllRanges();
  };

  const handleTextClick = (e) => {
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
  };

  const handleMouseOverText = (e) => {
    let node = e.target;
    while (node && node !== redacaoRef.current) {
      if (node.tagName === "MARK") {
        const id = node.getAttribute("data-id");
        if (activePopoverComment && activePopoverComment.id === id) return;

        const comentarioObj = comentarios.find(c => c.id === id);
        if (comentarioObj && comentarioObj.comentario) {
          const rect = node.getBoundingClientRect();
          setHoveredComment({
            id,
            top: rect.top + window.scrollY - 45, 
            left: rect.left + window.scrollX + rect.width / 2,
            texto: comentarioObj.comentario
          });
        }
        break;
      }
      node = node.parentNode;
    }
  };

  const ocultarTooltip = () => setHoveredComment(null);

  const consolidarComentarioDefinitivo = (id) => {
    const novoIdDefinitivo = Date.now().toString();
    const markNode = redacaoRef.current.querySelector(`mark[data-id="${id}"]`);
    if (markNode) {
      markNode.setAttribute("data-id", novoIdDefinitivo);
    }

    setComentarios(prev => prev.map(c => 
      c.id === id ? { ...c, id: novoIdDefinitivo, isNovo: false } : c
    ));
    setActivePopoverComment(null);
  };

  const removerApenasSelecao = (id) => {
    const mark = redacaoRef.current.querySelector(`mark[data-id="${id}"]`);
    if (mark) {
      const pai = mark.parentNode;
      while (mark.firstChild) {
        pai.insertBefore(mark.firstChild, mark);
      }
      pai.removeChild(mark);
    }
    setComentarios(prev => prev.filter(c => c.id !== id));
    setActivePopoverComment(null);
  };

  const alterarCompetenciaComentario = (id, labelCompetencia) => {
    const novaComp = competenciasDisponiveis.find(c => c.label === labelCompetencia);
    if (!novaComp) return;

    const markNode = redacaoRef.current.querySelector(`mark[data-id="${id}"]`);
    if (markNode) markNode.style.backgroundColor = novaComp.cor;

    setComentarios(prev => prev.map(c => 
      c.id === id ? { ...c, competencia: novaComp.label, cor: novaComp.cor } : c
    ));
  };

  const atualizarTextoComentario = (id, texto) => {
    setComentarios(prev => prev.map(c => c.id === id ? { ...c, comentario: texto } : c));
  };

  return (
    <div className="page-wrapper">
      <Header onProfileClick={() => {}} />
      <SubHeader title="Nome do Aluno - Tema da redação" onBack={() => navigate(-1)} />

      {/* 1. BALÃO SIMPLES DE LEITURA (HOVER) */}
      {hoveredComment && (
        <div className="comment-hover-tooltip" style={{ top: hoveredComment.top, left: hoveredComment.left }}>
          {hoveredComment.texto}
        </div>
      )}

      {/* 2. CARD INTERATIVO FLUTUANTE */}
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
            style={{ top: activePopoverComment.top, left: activePopoverComment.left }}
          />
        );
      })()}

      {/* 3. BOTÃO FLUTUANTE PARA NOVO COMENTÁRIO */}
      {botaoFlutuante.visivel && (
        <button
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
            
            {/* Coluna esquerda - Redação */}
            <div className="layout-col-esquerda">
              <SupportTextsContainer items={[]} />

              <div className="nota-total-container">
                <span className="nota-total-label">Nota Total Calculada:</span>
                <span className="nota-total-badge">{notaTotal} pts</span>
              </div>

              <div 
                ref={redacaoRef}
                onClick={handleTextClick}
                onMouseUp={handleSelection}
                onKeyUp={handleSelection}
                onMouseOver={handleMouseOverText}
                onMouseOut={ocultarTooltip}
                className="container-redacao-correcao"
              >
                <p style={{ marginTop: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sapien lectus, aliquam at dui sit amet, ornare lacinia nisi. Ut eros lacus, mollis ac auctor eget, suscipit quis lectus.
                </p>
                <p>
                  In placerat cursus nisi, faucibus vestibulum mi tristique et. Sed ut neque ut quam semper tempus. Nam sit amet nisl porttitor, sagittis lorem sed, sollicitudin massa.
                </p>
              </div>
            </div>

            {/* Coluna direita - Tabela de Notas por Competência ENEM */}
            <div className="layout-col-direita">
              <div className="grade-notas-card">
                <h3 className="grade-notas-titulo">
                  Grade de Notas (ENEM)
                </h3>
                
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
                      {/* Linha 2: Descrição das Competências (Ofuscadas via CSS) */}
                      <tr>
                        {dadosCompetenciasEnem.map((comp) => (
                          <td key={comp.id} className={`comp-desc-cell comp-desc-${comp.id}`}>
                            {comp.desc}
                          </td>
                        ))}
                      </tr>
                      {/* Linha 3: Inputs Customizados de Notas (0 a 200, step 40) */}
                      <tr>
                        {dadosCompetenciasEnem.map((comp) => (
                          <td key={comp.id} className="comp-input-cell">
                            <input 
                              type="number"
                              min="0"
                              max="200"
                              step="40"
                              value={notasCompetencias[comp.id]}
                              onChange={(e) => handleNotaChange(comp.id, e.target.value)}
                              className={`comp-input-field comp-input-${comp.id}`}
                            />
                            <div className="comp-pts-label">pts</div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Resumo inferior */}
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