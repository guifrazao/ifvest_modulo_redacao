import React, { useState, useRef } from "react";
import T from "../styles/tokens";
import BasicTxtBox from "./TxtBoxBasica";
import { UploadForm } from "./FormUpload";
import { ActionButton } from "./BotaoAcao";

export function EssayWritingBox({ onAICorrect, onHumanCorrect }) {
  /* Aba principal: "arquivo" | "digitar" */
  const [mainTab, setMainTab] = useState("digitar");
 
  /* Conteúdo da textarea */
  const [essayText, setEssayText] = useState("");
 
  /* Arquivo selecionado e URL de preview */
  const [uploadedFile, setUploadedFile]       = useState(null);
  const [previewUrl,   setPreviewUrl]          = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
 
  /* Ref para o input file oculto */
  const fileInputRef = useRef(null);
 
  /* ── Handlers ── */
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
 
    /* Limpa preview anterior */
    if (previewUrl) URL.revokeObjectURL(previewUrl);
 
    setUploadedFile(file);
    setUploadedFileName(file.name);
 
    /* Preview nativo via URL.createObjectURL — sem bibliotecas */
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
 
    /* Reseta o valor do input para permitir re-selecionar o mesmo arquivo */
    e.target.value = "";
  }
 
  function handleRemoveFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadedFileName(null);
  }
 
  return (
    <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
    }}>
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 10,
        flexShrink: 0,
      }}>
        {/* Aba digitar */}
        <div className="abas-area-redacao" style={{ 
            display: "flex",
            flex: 1,
            flexDirection: "column",            
            overflow: "hidden"
        }}>
            <ActionButton 
              text="Digitar" 
              onClick={() => setMainTab("digitar")}
              color={mainTab === "digitar" ? T.fundoTabAtiva : T.fundoTabInativa}
              textColor="#000000"
            />
        </div>

        {/* Aba enviar arquivo */}
        <div className="abas-area-redacao" style={{ 
            display: "flex",
            flex: 1,
            flexDirection: "column",
            border: `1px solid ${T.bordaTab}`, 
            overflow: "hidden"
        }}>
            <ActionButton 
              text="Enviar arquivo" 
              onClick={() => setMainTab("arquivo")}
              color={mainTab === "arquivo" ? T.fundoTabAtiva : T.fundoTabInativa}
              textColor="#000000"
            />
        </div>
      </div>
 
      <div style={{flex: 1, display: "flex", flexDirection: "column", minHeight: 0}}>
        {/* ── MODO DIGITAR ── */}
        {mainTab === "digitar" && (
          <BasicTxtBox 
            placeholder="Digite sua redação aqui..." 
            essayText={essayText}
            setEssayText={setEssayText}
          />
        )}
  
        {/* ── MODO ENVIAR ARQUIVO ── */}
        {mainTab === "arquivo" && (
          <UploadForm 
            fileInputRef={fileInputRef}
            uploadedFile={uploadedFile}
            previewUrl={previewUrl}
            uploadedFileName={uploadedFileName}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
          />
        )}
      </div>
    </div>
  );
}