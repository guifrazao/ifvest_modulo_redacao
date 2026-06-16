import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import T from "../styles/tokens";
import { Header } from "../components/Header";
import { SubHeader } from "../components/SubHeader";
import { Footer } from "../components/Footer";
import { AnnotationForm } from "../components/FormComentario";
import { SupportTextsContainer } from "../components/ContainerTextosApoio";

const competenciasDisponiveis = [
  { id: "c1", label: "Competência 1", cor: "#ffeb3b" },
  { id: "c2", label: "Competência 2", cor: "#f44336" },
  { id: "c3", label: "Competência 3", cor: "#e91e63" },
  { id: "c4", label: "Competência 4", cor: "#2196f3" },
];

export default function InterfaceCorrecao() {
  const [nota, setNota] = useState("0,00");
  const [comentarios, setComentarios] = useState([]);
  const [menuContexto, setMenuContexto] = useState({ visivel: false, x: 0, y: 0, targetId: null, tipo: "" });

  const redacaoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fecharMenu = () => setMenuContexto(prev => ({ ...prev, visivel: false }));
    window.addEventListener("click", fecharMenu);
    return () => window.removeEventListener("click", fecharMenu);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const textoSelecionado = selection.toString().trim();

    let node = e.target;
    let idDestaqueExistente = null;
    while (node && node !== redacaoRef.current) {
      if (node.tagName === "MARK") {
        idDestaqueExistente = node.getAttribute("data-id");
        break;
      }
      node = node.parentNode;
    }

    if (idDestaqueExistente) {
      setMenuContexto({
        visivel: true,
        x: e.pageX,
        y: e.pageY,
        targetId: idDestaqueExistente,
        tipo: "remover"
      });
    } else if (textoSelecionado.length > 0) {
      setMenuContexto({
        visivel: true,
        x: e.pageX,
        y: e.pageY,
        targetId: null,
        tipo: "criar",
        texto: textoSelecionado,
        range: selection.getRangeAt(0).cloneRange()
      });
    }
  };

  // Cria o rascunho com a Competência 1 pré-selecionada e o adiciona aberto na tela
  const iniciarCriacaoComentario = () => {
    if (!menuContexto.range) return;

    const idProvisorio = "temp-" + Date.now().toString();
    const compPadrao = competenciasDisponiveis[0];

    const mark = document.createElement("mark");
    mark.setAttribute("data-id", idProvisorio);
    mark.style.backgroundColor = compPadrao.cor;
    mark.style.color = "inherit";
    mark.style.cursor = "pointer";

    try {
      menuContexto.range.surroundContents(mark);
      
      const novoEsboco = {
        id: idProvisorio,
        competencia: compPadrao.label,
        cor: compPadrao.cor,
        textoTrecho: menuContexto.texto,
        comentario: "",
        isNovo: true,
        aberto: true
      };

      setComentarios([...comentarios, novoEsboco]);
    } catch (err) {
      alert("Evite selecionar trechos que quebrem blocos internos de parágrafos.");
    }
    window.getSelection().removeAllRanges();
  };

  // Captura o clique na tela para verificar se um comentário já criado foi clicado
  const handleTextClick = (e) => {
    let node = e.target;
    while (node && node !== redacaoRef.current) {
      if (node.tagName === "MARK") {
        const idDestaque = node.getAttribute("data-id");
        setComentarios(prev => 
          prev.map(c => c.id === idDestaque ? { ...c, aberto: true } : c)
        );
        break;
      }
      node = node.parentNode;
    }
  };

  // Altera a competência e atualiza a cor do marcador HTML em tempo de execução
  const alterarCompetenciaComentario = (id, labelCompetencia) => {
    const novaComp = competenciasDisponiveis.find(c => c.label === labelCompetencia);
    if (!novaComp) return;

    const markNode = redacaoRef.current.querySelector(`mark[data-id="${id}"]`);
    if (markNode) {
      markNode.style.backgroundColor = novaComp.cor;
    }

    setComentarios(prev => prev.map(c => 
      c.id === id ? { ...c, competencia: novaComp.label, cor: novaComp.cor } : c
    ));
  };

  // Atualiza as strings de comentário de forma isolada por Id
  const atualizarTextoComentario = (id, texto) => {
    setComentarios(prev => prev.map(c => 
      c.id === id ? { ...c, comentario: texto } : c
    ));
  };

  // Criação do comentário
  const consolidarComentarioDefinitivo = (id) => {
    const novoIdDefinitivo = Date.now().toString();
    const markNode = redacaoRef.current.querySelector(`mark[data-id="${id}"]`);
    if (markNode) {
      markNode.setAttribute("data-id", novoIdDefinitivo);
    }

    setComentarios(prev => prev.map(c => 
      c.id === id ? { ...c, id: novoIdDefinitivo, isNovo: false, aberto: false } : c
    ));
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
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f4f4" }}>
      <Header onProfileClick={() => {}} />
      <SubHeader title="Nome do Aluno - Tema da redação" onBack={() => navigate(-1)} />

      <main style={{ flex: 1, className: "col-12", maxWidth: 1100, margin: "0 auto", padding: "16px 20px" }}>
        <div style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
          <div style={{ display: "table-row" }}>
            
            {/* Coluna esquerda com a redação do aluno */}
            <div style={{ display: "table-cell", className: "col-9 col-s-3", verticalAlign: "top", paddingRight: 24 }}>
              <SupportTextsContainer items={[]} />

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: "bold", color: "#333"}}>Nota:</span>
                <input 
                  type="text" 
                  value={nota} 
                  onChange={(e) => setNota(e.target.value)}
                  style={{ width: 70, padding: "6px 8px", borderRadius: 6, border: "1px solid #7a7a7a", textAlign: "center", fontSize: 14, fontWeight: "bold" }}
                />
              </div>

              <div 
                ref={redacaoRef}
                onContextMenu={handleContextMenu}
                onClick={handleTextClick}
                className="container-redacao-correcao"
                style={{boxSizing: "border-box",}}
              >
                <p style={{ marginTop: 0}}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sapien lectus, aliquam at dui sit amet, ornare lacinia nisi. Ut eros lacus, mollis ac auctor eget, suscipit quis lectus.
                </p>
                <p>
                  In placerat cursus nisi, faucibus vestibulum mi tristique et. Sed ut neque ut quam semper tempus. Nam sit amet nisl porttitor, sagittis lorem sed, sollicitudin massa.
                </p>
              </div>
            </div>

            {/* Coluna direita com os comentários */}
            <div style={{ display: "table-cell", className: "col-3 col-s-9", verticalAlign: "top" }}>
              

              {/* Lista vertical de anotações abertas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {comentarios.filter(c => c.aberto).length > 0 ? (
                  comentarios.filter(c => c.aberto).map((item) => (
                    <AnnotationForm 
                      key={item.id}
                      competenciaSelecionada={item.competencia}
                      onCompetenciaChange={(novaLabel) => alterarCompetenciaComentario(item.id, novaLabel)}
                      competenciasDisponiveis={competenciasDisponiveis}
                      comentario={item.comentario}
                      onComentarioChange={(novoTxt) => atualizarTextoComentario(item.id, novoTxt)}
                      onDelete={() => item.isNovo ? removerApenasSelecao(item.id) : item.aberto = false}
                      isNovoComentario={!!item.isNovo}
                      onCriarComentario={() => consolidarComentarioDefinitivo(item.id)}
                    />
                  ))
                ) : (
                  <div style={{ border: "2px dashed #b5b5b5", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#777", fontSize: 13, fontFamily: "'Roboto', sans-serif", background: "#fafafa" }}>
                    Selecione um trecho com o botão direito para comentar, ou clique com o botão esquerdo em cima de qualquer marcação no texto para reexibir seu respectivo formulário.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Menu de contexto (ao clicar com o botão direito em texto destacado) */}
      {menuContexto.visivel && (
        <div style={{
          position: "absolute", top: menuContexto.y, left: menuContexto.x,
          background: "#ffffff", border: "1px solid #ababab", borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", zIndex: 1000, overflow: "hidden",
          fontFamily: "'Roboto', sans-serif", fontSize: 13
        }}>
          {menuContexto.tipo === "criar" ? (
            <div
              onClick={iniciarCriacaoComentario}
              style={{ padding: "10px 18px", cursor: "pointer", background: "#fff", fontWeight: 500 }}
              onMouseEnter={(e) => e.target.style.background = "#eef5f1"}
              onMouseLeave={(e) => e.target.style.background = "#fff"}
            >
              Comentar
            </div>
          ) : (
            <div
              onClick={() => removerApenasSelecao(menuContexto.targetId)}
              style={{ padding: "10px 18px", cursor: "pointer", color: "#dc3545", fontWeight: "bold", background: "#fff" }}
              onMouseEnter={(e) => e.target.style.background = "#fbebeb"}
              onMouseLeave={(e) => e.target.style.background = "#fff"}
            >
              Remover marcação
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}