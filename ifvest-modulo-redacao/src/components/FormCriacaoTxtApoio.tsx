import React, { useState, useRef, ChangeEvent } from "react";
import T from "../styles/tokens";
import { ActionButton } from "./BotaoAcao";
import { UploadForm } from "./FormUpload";
import { RichTextEditor } from "./EditorTexto";

export type SuppTextType = "figura" | "texto";

export interface InitialSupportTextData {
  title?: string;
  type?: "image" | "figura" | "text" | "texto";
  body?: string;
  source?: string;
}

export interface SupportTextInsertData {
  title: string;
  type: SuppTextType;
  bodyText: string | null;
  source: string;
  file: File | null;
  previewUrl: string | null;
}

export interface SuppTextCreationAreaProps {
  onCancel?: () => void;
  onInsert?: (data: SupportTextInsertData) => void;
  initialData?: InitialSupportTextData;
}

export function SuppTextCreationArea({
  onCancel,
  onInsert,
  initialData,
}: SuppTextCreationAreaProps) {
  // Estados principais do formulário
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [type, setType] = useState<SuppTextType>(
    initialData?.type === "image" || initialData?.type === "figura" ? "figura" : "texto"
  );
  const [bodyText, setBodyText] = useState<string>(initialData?.body || "");
  const [source, setSource] = useState<string>(initialData?.source || "");

  // Estados do componente de upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers para o gerenciamento de arquivos enviados
  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
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
      }}
    >
      {/* Input título */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: "500", color: "#000" }}>Título:</span>
        <input
          className="input-titulo-criacao-txt-apoio"
          type="text"
          placeholder="Insira o título do texto de apoio..."
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Abas figura/texto */}
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
        <RichTextEditor
          value={bodyText}
          onChange={(newText: string) => setBodyText(newText)}
        />
      ) : (
        /* Form de upload da aba figura */
        <div className="aba-figura-criacao-txt-apoio" style={{ overflow: "hidden" }}>
          <UploadForm
            fileInputRef={fileInputRef}
            uploadedFile={uploadedFile}
            previewUrl={previewUrl}
            uploadedFileName={uploadedFileName ?? ""}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
            handleEssayUpload={() => {}}
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Botões criar e cancelar */}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <ActionButton
          text={initialData ? "Salvar alterações" : "Inserir texto de apoio"}
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
                previewUrl: type === "figura" ? previewUrl : null,
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