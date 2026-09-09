import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"

// Barra de ferramentas customizada
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="lexical-toolbar">
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} className="toolbar-btn" title="Negrito">
        <b>B</b>
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} className="toolbar-btn" title="Itálico">
        <i>I</i>
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} className="toolbar-btn" title="Sublinhado">
        <u>U</u>
      </button>

      <div className="toolbar-divider" />

      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")} className="toolbar-btn" title="Alinhar à Esquerda">
        Esquerda
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")} className="toolbar-btn" title="Centralizar">
        Centrado
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")} className="toolbar-btn" title="Alinhar à Direita">
        Direita
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} className="toolbar-btn" title="Justificar">
        Justificado
      </button>

      <div className="toolbar-divider" />
      
      <button type="button" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} className="toolbar-btn" title="Desfazer">
        ↶
      </button>
      <button type="button" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} className="toolbar-btn" title="Refazer">
        ↷
      </button>
    </div>
  );
}

// Configuração do Editor
export function RichTextEditor({ value, onChange }) {
  const initialConfig = {
    namespace: "EditorApoio",
    theme: {
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
        underline: "editor-text-underline",
      },
    },
    onError(error) {
      console.error(error);
    },
  };

  return (
    <div className="lexical-editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="lexical-editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="lexical-content-editable" />}
            placeholder={<div className="lexical-placeholder">Insira o texto de apoio aqui...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                // Converte os nós do Lexical para HTML para salvar no banco
                const htmlString = $generateHtmlFromNodes(editor, null);
                onChange(htmlString);
              });
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}