// src/components/properties/UploadDocument.js
import React, { useState, useRef } from "react";
import api from "../../../../services/api";
import {
  Upload,
  X,
  ChevronRight,
  AlertCircle,
  FileText,
  Trash2,
} from "lucide-react";
import "./UploadDocument.css";

const UploadDocument = ({ properties, onClose, fetchAllData }) => {
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
        headers: { "Content-Type": "multipart/form-data" },
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

  const handleConfirmDocType = () => {
    if (!selectedDocType) {
      setErrorMessage("Please select a document type.");
      return;
    }
    setErrorMessage("");
    if (selectedDocType.toLowerCase() === "lease") {
      setUploadStep(3);
    } else {
      setUseExistingProperty(true);
      setUploadStep(3);
    }
  };

  const handleProcessDocument = async () => {
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
        await api.post("/leases/upload", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        formDataToSend.append("property_id", selectedProperty.id);
        await api.post("/processor/process", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
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

  const resetUploadStates = () => {
    setFile(null);
    setSelectedDocType(null);
    setCustomDocType("");
    setUploadStep(1);
    setErrorMessage("");
    setIsUploaded(false);
  };

  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div className='header-content'>
            <div className='header-icon'>
              <FileText size={24} />
            </div>
            <h2>Upload Document</h2>
          </div>
          <button
            className='close-button'
            onClick={() => {
              onClose();
              resetUploadStates();
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className='upload-container'>
          {/* Steps Indicator */}
          <div className='steps-indicator'>
            <div className={`step ${uploadStep >= 1 ? "active" : ""}`}>
              <div className='step-number'>1</div>
              <span>Upload File</span>
            </div>
            <div className={`step ${uploadStep >= 2 ? "active" : ""}`}>
              <div className='step-number'>2</div>
              <span>Document Type</span>
            </div>
            <div className={`step ${uploadStep >= 3 ? "active" : ""}`}>
              <div className='step-number'>3</div>
              <span>Property Details</span>
            </div>
          </div>

          <div className='upload-content'>
            {/* Step 1: Upload File */}
            {uploadStep === 1 && (
              <div className='upload-step'>
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
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept='image/*,.pdf,.doc,.docx'
                  />
                  <Upload size={48} className='upload-icon' />
                  <p className='upload-text'>
                    Drag & drop files here, or click to upload
                  </p>
                  <p className='upload-subtext'>
                    Supported formats: PDF, DOC, DOCX, Images
                  </p>
                </div>

                {file && (
                  <div className='file-preview'>
                    <div className='file-info'>
                      <FileText size={20} />
                      <span>{file.name}</span>
                    </div>
                    <button
                      className='remove-file'
                      onClick={() => setFile(null)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Document Type */}
            {uploadStep === 2 && (
              <div className='upload-step'>
                <div className='section-title'>
                  <h3>Document Type</h3>
                  <p className='section-description'>
                    The document type has been determined as:{" "}
                    <strong>{selectedDocType}</strong>
                  </p>
                </div>

                <div className='document-type-grid'>
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
                    type='text'
                    className='custom-type-input'
                    placeholder='Enter custom document type'
                    value={customDocType}
                    onChange={(e) => setCustomDocType(e.target.value)}
                  />
                )}
              </div>
            )}

            {/* Step 3: Property Selection */}
            {uploadStep === 3 && (
              <div className='upload-step'>
                <div className='section-title'>
                  <h3>Property Details</h3>
                </div>

                {selectedDocType.toLowerCase() === "lease" && (
                  <div className='property-option'>
                    <label className='checkbox-wrapper'>
                      <input
                        type='checkbox'
                        checked={useExistingProperty}
                        onChange={(e) => {
                          setUseExistingProperty(e.target.checked);
                          if (!e.target.checked) setSelectedProperty(null);
                        }}
                      />
                      <span className='checkbox-label'>
                        Link to Existing Property
                      </span>
                    </label>
                    <p className='help-text'>
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
                    className='property-select'
                  >
                    <option value='' disabled>
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

            {/* Error Message */}
            {errorMessage && (
              <div className='error-message'>
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className='modal-footer'>
            {uploadStep > 1 && (
              <button
                className='secondary-button'
                onClick={() => {
                  setUploadStep((prev) => prev - 1);
                  setErrorMessage("");
                }}
              >
                Back
              </button>
            )}

            {uploadStep < 3 && (
              <button
                className='primary-button'
                onClick={
                  uploadStep === 1
                    ? handleDetermineDocType
                    : handleConfirmDocType
                }
                disabled={uploading}
              >
                {uploading ? (
                  "Processing..."
                ) : (
                  <>
                    Next <ChevronRight size={20} />
                  </>
                )}
              </button>
            )}

            {uploadStep === 3 && (
              <button
                className='primary-button'
                onClick={handleProcessDocument}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
