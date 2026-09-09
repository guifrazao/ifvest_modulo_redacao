import T from "../styles/tokens"
export default function BasicTxtBox({ placeholder, essayText, setEssayText, lineHeight = "auto" }){
    return (
        <textarea
          value={essayText}
          onChange={e => setEssayText(e.target.value)}
          placeholder={placeholder}
          style={{
            whiteSpace: "pre-line",
            flex: 1,
            width: "100%",
            height: "100%", 
            minHeight: 160,
            lineHeight: lineHeight,
            border: `1px solid ${T.bordaTab}`,
            padding: "10px 12px", fontSize: 13,
            fontFamily: "Roboto, sans-serif", color: "#000",
            resize: "vertical", outline: "none",
            background: "#fff", display: "block",
          }}
        />
    )
}