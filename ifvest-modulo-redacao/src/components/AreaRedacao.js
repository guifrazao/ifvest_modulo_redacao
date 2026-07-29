import React, { useState, useRef } from "react";
import T from "../styles/tokens";
import api from "../api";
import BasicTxtBox from "./TxtBoxBasica";
import { UploadForm } from "./FormUpload";
import { ActionButton } from "./BotaoAcao";
import { LoadingScreen } from "./TelaCarregamento";

export function EssayWritingBox({ essayText, setEssayText }) {
  /* Aba principal: "arquivo" | "digitar" */
  const [mainTab, setMainTab] = useState("digitar");

  /* Estado de carregamento */
  const [isLoading, setIsLoading] = useState(false)
 
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

  async function handleEssayUpload() {
    if (mainTab === "arquivo") {

      if (!uploadedFile) {
        alert("Por favor, selecione uma imagem");
        return;
      }

      const formData = new FormData()
      formData.append("file", uploadedFile)

      setIsLoading(true)

      try{
        const response = await api.post("ocr/extrair_texto/", formData);

        if(response.status === 200 && response.data) {
          
          if (response.data.texto_extraido){
            setMainTab("digitar")
            setEssayText(response.data.texto_extraido);
          }
          
        }
      }catch (error){
        console.error("Erro: ", error)
      }finally{
        setIsLoading(false)
      }
      
    }
  }

  return (
    <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
    }}>

      {isLoading && <LoadingScreen message="Extraindo texto da imagem enviada..."/>}
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
            handleEssayUpload={handleEssayUpload}
          />
        )}
      </div>
    </div>
  );
}