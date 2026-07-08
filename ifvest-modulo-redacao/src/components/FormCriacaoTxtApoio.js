import React, { useState, useRef } from "react";
import T from "../styles/tokens";
import { ActionButton } from "./BotaoAcao";
import { UploadForm } from "./FormUpload";
import { SupportTextItem } from "./TextoApoio";

export function SuppTextCreationArea({ onCancel, onInsert }) {
  // Estados principais do formulário
  const [title, setTitle] = useState("");
  const [type, setType] = useState("texto");
  const [bodyText, setBodyText] = useState("");
  const [source, setSource] = useState("");
  
  // Estados do componente de upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const fileInputRef = useRef(null);

  // Handlers para o gerenciamento de arquivos enviados
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setUploadedFile(file);
    setUploadedFileName(file.name);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }

    e.target.value = "";
  }

  function handleRemoveFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadedFileName(null);
  }
  
  return (
    <div 
    className="form-criacao-txt-apoio"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      boxSizing: "border-box",
    }}>
      
      {/* Input título */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>Título:</span>
        <input 
          className="input-titulo-criacao-txt-apoio"
          type="text" 
          placeholder="Insira o título do texto de apoio..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{flex: 1,}}
        />
      </div>

      {/* Abas figura/texto (as mesmas da área de redação) */}
      <div style={{ display: "flex", gap: 12, width: "100%" }}>
        {/* Aba Figura */}
        <div className="abas-area-redacao" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ActionButton 
            text="Figura" 
            onClick={() => setType("figura")}
            color={type === "figura" ? T.fundoTabAtiva : T.fundoTabInativa}
            textColor="#000000"
            width="100%"
          />
        </div>

        {/* Aba Texto */}
        <div className="abas-area-redacao" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ActionButton 
            text="Texto" 
            onClick={() => setType("texto")}
            color={type === "texto" ? T.fundoTabAtiva : T.fundoTabInativa}
            textColor="#000000"
            width="100%"
          />
        </div>
      </div>

      {/* Form da aba texto */}
      {type === "texto" ? (
        <textarea 
          placeholder="Educação Profissional é o modelo de aprendizagem com foco no desenvolvimento de competências e habilidades técnicas..."
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          className="aba-texto-criacao-txt-apoio"
          style={{resize: "none", boxSizing: "border-box",}}
        />
      ) : (
        /* Form de uplaod da aba figura */
        <div 
        className="aba-figura-criacao-txt-apoio"
        style={{ overflow: "hidden",}}>
          <UploadForm 
            fileInputRef={fileInputRef}
            uploadedFile={uploadedFile}
            previewUrl={previewUrl}
            uploadedFileName={uploadedFileName}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
          />
        </div>
      )}

      {/* Input fonte */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>Fonte:</span>
        <input 
          className="input-fonte-criacao-txt-apoio"
          type="text" 
          placeholder="Insira a fonte do texto de apoio..." 
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{flex: 1,}}
        />
      </div>

      {/* Botões criar e cancelar */}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <ActionButton 
          text="Inserir texto de apoio"
          color="#2d6a4f"               
          textColor="#ffffff"
          borderRadius={20}
          onClick={() => {
            if (onInsert) {
              onInsert({ 
                title, 
                type, 
                bodyText: type === "texto" ? bodyText : null, 
                source, 
                file: type === "figura" ? uploadedFile : null,
                previewUrl: type === "figura" ? previewUrl : null
              });
            }
          }}
        />
        
        <ActionButton 
          text="Cancelar"
          color="#e53935"             
          textColor="#ffffff"
          borderRadius={20}
          onClick={onCancel}
        />
      </div>
    </div>
  );
}