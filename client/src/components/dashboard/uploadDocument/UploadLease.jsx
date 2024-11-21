import React, { useState, useRef } from "react";
import api from "../../../services/api";
import { Upload, X, AlertCircle, FileText, Trash2 } from "lucide-react";
import "./UploadLease.css";

const UploadLease = ({ onClose, fetchAllData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleProcessLease = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("document_type", "Lease");

    try {
      setUploading(true);
      setErrorMessage("");

      await api.post("/leases/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchAllData();
      onClose();
    } catch (error) {
      console.error("Error processing lease:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to process lease. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const resetUploadStates = () => {
    setFile(null);
    setErrorMessage("");
  };

  return (
    <div className="uploadlease-modal">
      <div className="uploadlease-modal-content">
        <div className="uploadlease-modal-header">
          <div className="uploadlease-header-content">
            <div className="uploadlease-header-icon">
              <FileText size={24} />
            </div>
            <h2>Upload Lease</h2>
          </div>
          <button
            className="uploadlease-close-button"
            onClick={() => {
              onClose();
              resetUploadStates();
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="uploadlease-container">
          <div className="uploadlease-content">
            <div className="uploadlease-step">
              <div
                className={`uploadlease-file-drop-area ${file ? "active" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange({
                      target: { files: e.dataTransfer.files },
                    });
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Upload size={48} className="uploadlease-upload-icon" />
                <p className="uploadlease-upload-text">
                  Drag & drop lease document here, or click to upload
                </p>
                <p className="uploadlease-upload-subtext">
                  Supported formats: PDF, DOC, DOCX, Images
                </p>
              </div>

              {file && (
                <div className="uploadlease-file-preview">
                  <div className="uploadlease-file-info">
                    <FileText size={20} />
                    <span>{file.name}</span>
                  </div>
                  <button
                    className="uploadlease-remove-file"
                    onClick={() => setFile(null)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="uploadlease-error-message">
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="uploadlease-modal-footer">
            <button
              className="uploadlease-primary-button"
              onClick={handleProcessLease}
              disabled={!file || uploading}
            >
              {uploading ? "Uploading..." : "Upload Lease"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadLease;
