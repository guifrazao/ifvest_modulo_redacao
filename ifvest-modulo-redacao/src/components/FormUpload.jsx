import T from "../styles/tokens"
import { ActionButton } from "./BotaoAcao"

export function UploadForm({
    fileInputRef,
    uploadedFile,
    previewUrl,
    uploadedFileName,
    handleFileChange,
    handleRemoveFile,
    handleEssayUpload,
}){
    return (
        <div>
            {/* Container de upload */}
            <div 
            className="form-upload"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
            }}>

            {/* Sem arquivo selecionado → botão de upload */}
            {!uploadedFile && (
                <>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="btn-upload"
                >
                    Selecione um arquivo para<br />fazer upload...
                </button>
                </>
            )}

            {/* Arquivo selecionado — preview de imagem */}
            {uploadedFile && previewUrl && (
                <div style={{ width: "100%", textAlign: "center" }}>
                    <img
                        src={previewUrl}
                        alt="Preview do arquivo"
                        style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        borderRadius: 6,
                        objectFit: "contain",
                        marginBottom: 8,
                        border: `1px solid ${T.bordaUpload}`,
                        }}
                    />
                    <p style={{
                        fontSize: 12, color: "#555", marginBottom: 8,
                    }}>
                        {uploadedFileName}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, }}>
                        <ActionButton onClick={handleEssayUpload} text="Confirmar" color="var(--btn-upload)" textColor="#fff" borderRadius={8} />
                        <ActionButton onClick={handleRemoveFile} text="Remover" color="#fff" textColor="var(--btn-upload)" borderRadius={8} />
                    </div>
                    {/* <button onClick={handleRemoveFile} className="btn-remover-upload">
                        Remover
                    </button> */}
                </div>
            )}

            {/* Arquivo selecionado — sem preview (PDF, DOC, etc.) */}
            {uploadedFile && !previewUrl && (
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 8,
                        background: T.btnUpload,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 10px",
                    }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="5" y="3" width="14" height="22" rx="2" stroke="white" strokeWidth="1.8"/>
                        <path d="M5 3h10l8 8v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" fill="none" stroke="white" strokeWidth="1.8"/>
                        <path d="M15 3v8h8" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <p style={{
                        fontSize: 13, fontWeight: 500, color: "#333",
                        fontFamily: "Roboto, sans-serif", marginBottom: 4,
                    }}>
                        {uploadedFileName}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, }}>
                        <ActionButton onClick={handleEssayUpload} text="Confirmar" color="var(--btn-upload)" textColor="#fff" borderRadius={8} />
                        <ActionButton onClick={handleRemoveFile} text="Remover" color="#fff" textColor="var(--btn-upload)" borderRadius={8} />
                    </div>
                    {/* <button onClick={handleRemoveFile} className="btn-remover-upload">
                        Remover
                    </button> */}
                </div>
            )}
        </div>
    </div>
    )
}