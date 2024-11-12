// src/components/properties/UploadDocument.js

import React, { useState, useRef } from "react";
import api from "../../../../services/api";
import "./UploadDocument.css";

const UploadDocument = ({ properties, onClose, fetchAllData }) => {
  // State variables for uploading documents
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [customDocType, setCustomDocType] = useState("");
  const [uploadStep, setUploadStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [useExistingProperty, setUseExistingProperty] = useState(false);

  const fileInputRef = useRef(null);
  const documentTypes = ["Lease", "Contract", "Invoice", "Legal", "Other"];

  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setIsUploaded(false);
      setErrorMessage("");
      setSelectedDocType(null);
      setCustomDocType("");
    }
  };

  // Handle Step 1: Upload file to determine document type
  const handleDetermineDocType = async () => {
    if (!file) {
      setErrorMessage("Please upload a file.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      setUploading(true);
      setErrorMessage("");

      const response = await api.post("/processor/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const document_type = response.data;

      if (document_type) {
        setSelectedDocType(document_type);
        setUploadStep(2);
      } else {
        setErrorMessage("Failed to determine document type.");
      }
    } catch (error) {
      console.error("Error determining document type:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to determine document type. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle Step 2: User confirms or changes document type
  const handleConfirmDocType = () => {
    if (!selectedDocType) {
      setErrorMessage("Please select a document type.");
      return;
    }
    setErrorMessage("");
    // If document type is Lease, show property option step
    if (selectedDocType.toLowerCase() === "lease") {
      setUploadStep(3);
    } else {
      // For other document types, property selection is required
      setUseExistingProperty(true);
      setUploadStep(3);
    }
  };

  // Handle Step 3: Process document
  const handleProcessDocument = async () => {
    // For non-lease documents or when using existing property, property selection is required
    if (
      (selectedDocType.toLowerCase() !== "lease" || useExistingProperty) &&
      !selectedProperty
    ) {
      setErrorMessage("Please select a property.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append(
      "document_type",
      selectedDocType === "Other" ? customDocType : selectedDocType
    );

    try {
      setUploading(true);
      setErrorMessage("");

      if (selectedDocType.toLowerCase() === "lease" && !useExistingProperty) {
        // For leases without property selection, use the lease endpoint
        await api.post("/leases/upload", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // For all other cases, use the process endpoint which requires property_id
        formDataToSend.append("property_id", selectedProperty.id);
        await api.post("/processor/process", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsUploaded(true);
      resetUploadStates();
      fetchAllData();
      onClose();
    } catch (error) {
      console.error("Error processing document:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to process document. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Reset upload states
  const resetUploadStates = () => {
    setFile(null);
    setSelectedDocType(null);
    setCustomDocType("");
    setUploadStep(1);
    setErrorMessage("");
    setIsUploaded(false);
  };

  return (
    <div className="modal nouveau-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload Document</h2>
          <button
            className="close-button"
            onClick={() => {
              onClose();
              resetUploadStates();
            }}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Steps Indicator */}
          <div className="steps-indicator">
            <div className={`step ${uploadStep >= 1 ? "active" : ""}`}>
              1. Upload File
            </div>
            <div className={`step ${uploadStep >= 2 ? "active" : ""}`}>
              2. Document Type
            </div>
            <div className={`step ${uploadStep >= 3 ? "active" : ""}`}>
              3. Select Property
            </div>
          </div>

          {/* Step 1: Upload File */}
          {uploadStep === 1 && (
            <div className="upload-step">
              <div
                className={`file-drop-area ${file ? "active" : ""}`}
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
                <p>Drag & drop files here, or click to upload</p>
              </div>

              {file && (
                <div className="uploaded-file-preview">
                  <p>{file.name}</p>
                  <button className="delete-file" onClick={() => setFile(null)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Document Type */}
          {uploadStep === 2 && (
            <div className="upload-step">
              <h3>Determine Document Type</h3>
              <p>
                The document type has been determined as:{" "}
                <strong>{selectedDocType}</strong>. You can change it if
                necessary.
              </p>
              <div className="document-type-boxes">
                {documentTypes.map((type) => (
                  <div
                    key={type}
                    className={`document-type-box ${
                      selectedDocType === type ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedDocType(type);
                      if (type !== "Other") setCustomDocType("");
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
              {selectedDocType === "Other" && (
                <input
                  type="text"
                  className="custom-doc-input"
                  placeholder="Enter custom document type"
                  value={customDocType}
                  onChange={(e) => setCustomDocType(e.target.value)}
                />
              )}
            </div>
          )}

          {/* Step 3: Select Property */}
          {uploadStep === 3 && (
            <div className="upload-step">
              <h3>Property Options</h3>

              {selectedDocType.toLowerCase() === "lease" && (
                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={useExistingProperty}
                      onChange={(e) => {
                        setUseExistingProperty(e.target.checked);
                        if (!e.target.checked) {
                          setSelectedProperty(null);
                        }
                      }}
                    />
                    Link to Existing Property
                  </label>
                  <p className="help-text">
                    {useExistingProperty
                      ? "Select an existing property below"
                      : "Property information will be extracted from the lease"}
                  </p>
                </div>
              )}

              {(useExistingProperty ||
                selectedDocType.toLowerCase() !== "lease") && (
                <select
                  value={selectedProperty ? selectedProperty.id : ""}
                  onChange={(e) => {
                    const property = properties.find(
                      (p) => p.id === parseInt(e.target.value)
                    );
                    setSelectedProperty(property);
                  }}
                  className="property-dropdown"
                >
                  <option value="" disabled>
                    Select a property
                  </option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.address}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Success and Error Messages */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {isUploaded && (
            <p className="success-message">Document uploaded successfully!</p>
          )}
        </div>

        <div className="modal-footer">
          {/* Back Button */}
          {uploadStep > 1 && (
            <button
              className="secondary-button"
              onClick={() => {
                setUploadStep((prev) => prev - 1);
                setErrorMessage("");
              }}
            >
              Back
            </button>
          )}

          {/* Next Button */}
          {uploadStep < 3 && (
            <button
              className="primary-button"
              onClick={async () => {
                if (uploadStep === 1) {
                  if (!file) {
                    setErrorMessage("Please select a file first.");
                    return;
                  }
                  await handleDetermineDocType();
                } else if (uploadStep === 2) {
                  if (selectedDocType === "Other" && !customDocType) {
                    setErrorMessage("Please enter a custom document type.");
                    return;
                  }
                  handleConfirmDocType();
                }
              }}
              disabled={uploading}
            >
              {uploadStep === 1
                ? uploading
                  ? "Determining..."
                  : "Next"
                : "Next"}
            </button>
          )}

          {/* Upload Document Button */}
          {uploadStep === 3 && (
            <button
              className="primary-button"
              onClick={handleProcessDocument}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
