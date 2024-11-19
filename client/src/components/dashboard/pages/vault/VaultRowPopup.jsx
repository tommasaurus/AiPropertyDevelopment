// VaultRowPopup.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./VaultRowPopup.css";

export default function VaultRowPopup({ data, columns, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="vault-popup-overlay" onClick={onClose}>
      <div className="vault-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="vault-popup-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="vault-popup-header">
          <h3>Record Details</h3>
        </div>

        <div className="vault-popup-body">
          <div className="vault-popup-fields">
            {columns.map((column) => (
              <div key={column.key} className="vault-popup-field">
                <div className="vault-popup-label">{column.label}</div>
                <div className="vault-popup-value">
                  {column.formatter(data[column.key])}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vault-popup-footer">
          <button className="vault-popup-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
