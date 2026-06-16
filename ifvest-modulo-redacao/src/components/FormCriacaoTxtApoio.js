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
  
  // Estados para o controle de tags e menu dropdown
  const [tags, setTags] = useState(["Educação"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableOptions, setAvailableOptions] = useState(["Educação", "Economia", "Saúde"]);
  const [inputValue, setInputValue] = useState("");

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

  // Handlers de Tags
  const handleAddTag = (option) => {
    if (!tags.includes(option)) {
      setTags([...tags, option]);
    }
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCreateTag = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = inputValue.trim();

      if (newTag === "") return

      if (!availableOptions.includes(newTag)) {
        setAvailableOptions([...availableOptions, newTag]);
      }

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setInputValue("");
      setShowDropdown(false);
    }
  };
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

      {/* Lista tags */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", flexWrap: "wrap" }}>
        <span style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>Tags:</span>
        
        {/* Renderização das tags adicionadas */}
        {tags.map((tag, index) => (
          <div key={index} className="lista-tags" style={{display: "flex", alignItems: "center", gap: 6,}}>
            <span>{tag}</span>
            <span 
              onClick={() => handleRemoveTag(tag)} 
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              X
            </span>
          </div>
        ))}

        {/* Textbox para adicionar nova tag (abre o dropdown quando clicada) */}
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div className="textbox-tags" style={{
            display: "flex",
            alignItems: "center",            
            boxSizing: "border-box"
          }}>
            <input 
              type="text" 
              placeholder="..."
              value={inputValue}
              onClick={() => setShowDropdown(!showDropdown)}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleCreateTag}
              style={{ width: 50, border: "none", outline: "none", fontSize: 13, cursor: "pointer" }} 
            />
            <span 
              onClick={() => {
                setInputValue("")
                setShowDropdown(!showDropdown)
              }} 
              style={{ cursor: "pointer", fontWeight: "bold", fontSize: 13 }}
            >
              X
            </span>
          </div>
          
          {/* Dropdown tags */}
          {showDropdown && (
            <div className="dropdown-tags">
              {availableOptions.map((option, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleAddTag(option)}
                  className="tag"
                  style={{ borderBottom: idx !== availableOptions.length - 1 ? "1px solid #eee" : "none",}}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão adicionar */}
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          className="btn-adicionar-tag"
          style={{display: "flex", alignItems: "center",}}
        >
          +
        </div>
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
                tags,
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