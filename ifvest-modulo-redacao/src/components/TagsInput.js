import React, { useState } from "react";
import "../styles/App.css"

export function TagsInput({ tags = [], onChange, initialOptions = [] }) {
  const [availableOptions, setAvailableOptions] = useState(initialOptions);
  const [showDropdown, setShowDropdown]         = useState(false);
  const [inputValue, setInputValue]             = useState("");

  const handleAddTag = (option) => {
    if (!tags.includes(option)) onChange([...tags, option]);
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreateTag = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const newTag = inputValue.trim();
    if (!newTag) return;

    if (!availableOptions.includes(newTag))
      setAvailableOptions([...availableOptions, newTag]);

    if (!tags.includes(newTag)) onChange([...tags, newTag]);

    setInputValue("");
    setShowDropdown(false);
  };

  return (
    <div className="tags-wrapper">
      <span className="tags-label">Tags:</span>

      {/* Tags adicionadas */}
      {tags.map((tag, index) => (
        <div key={index} className="lista-tags">
          <span>{tag}</span>
          <span
            className="btn-remover-tag"
            onClick={() => handleRemoveTag(tag)}
          >
            X
          </span>
        </div>
      ))}

      {/* Input + dropdown */}
      <div className="tags-input-wrapper">
        <div className="textbox-tags">
          <input
            type="text"
            placeholder="..."
            value={inputValue}
            onClick={() => setShowDropdown(!showDropdown)}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleCreateTag}
            className="tags-input-field"
          />
          <span
            className="btn-remover-tag"
            onClick={() => {
              setInputValue("");
              setShowDropdown(!showDropdown);
            }}
          >
            X
          </span>
        </div>

        {showDropdown && (
          <div className="dropdown-tags">
            {availableOptions.map((option, idx) => (
              <div
                key={idx}
                onClick={() => handleAddTag(option)}
                className="tag"
                style={{
                  borderBottom:
                    idx !== availableOptions.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão + */}
      <div
        className="btn-adicionar-tag"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        +
      </div>
    </div>
  );
}