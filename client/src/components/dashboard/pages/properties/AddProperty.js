import React, { useState, useRef } from "react";
import api from "../../../../services/api";
import AddressAutocomplete from "../../addressAutocomplete/AddressAutocomplete";
import {
  Home,
  X,
  ChevronRight,
  Upload,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import "./AddProperty.css";

const AddProperty = ({ onClose, fetchAllData }) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    num_bedrooms: "",
    num_bathrooms: "",
    num_floors: "",
    is_commercial: false,
    is_hoa: false,
    hoa_fee: "",
    is_nnn: false,
    purchase_price: "",
    purchase_date: "",
    property_type: "",
  });

  const [addStep, setAddStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLeaseUpload, setShowLeaseUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectAddress = (addressData) => {
    setFormData((prev) => ({
      ...prev,
      address: addressData.formattedAddress || "",
      city: addressData.city || "",
      state: addressData.state || "",
      zipCode: addressData.zipCode || "",
    }));
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedFile(file);
      setErrorMessage("");
      // Clear address field when file is uploaded
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        zipCode: "",
      }));
    }
  };

  const handleNextStep = async () => {
    if (uploadedFile) {
      // Handle lease upload
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("document_type", "Lease");

      try {
        setIsSubmitting(true);
        await api.post("/leases/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fetchAllData();
        onClose();
      } catch (error) {
        console.error("Error uploading lease:", error);
        setErrorMessage(
          error.response?.data?.detail ||
            "Failed to upload lease. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else if (formData.address?.trim()) {
      // Proceed to next step if address is filled
      setErrorMessage("");
      setAddStep(2);
    } else {
      setErrorMessage(
        "Please either enter an address or upload a lease document."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      num_bedrooms: parseInt(formData.num_bedrooms, 10) || null,
      num_bathrooms: parseInt(formData.num_bathrooms, 10) || null,
      num_floors: parseInt(formData.num_floors, 10) || null,
      hoa_fee: parseFloat(formData.hoa_fee) || null,
      purchase_price: parseFloat(formData.purchase_price) || null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null,
    };

    try {
      await api.post("/properties", formattedData);
      fetchAllData();
      onClose();
    } catch (error) {
      console.error("Error adding property:", error);
      setErrorMessage(
        error.response?.data?.detail ||
          "Failed to add property. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-property-modal">
      <div className="add-property-modal-content">
        <div className="add-property-modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Home size={24} />
            </div>
            <h2>Add New Property</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="steps-indicator">
            <div className={`step ${addStep === 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <span>Property Information</span>
            </div>
            <div className={`step ${addStep === 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <span>Property Details</span>
            </div>
          </div>

          {addStep === 1 && (
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Address</label>
                <AddressAutocomplete
                  onSelectAddress={handleSelectAddress}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="divider">
                <span>OR</span>
              </div>

              <div
                className="uploadlease-file-drop-area"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange({
                      target: { files: e.dataTransfer.files },
                    });
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.doc,.docx"
                />
                {!uploadedFile ? (
                  <>
                    <Upload size={48} className="uploadlease-icon" />
                    <p className="uploadlease-text">
                      Drag & drop lease document here, or click to upload
                    </p>
                    <p className="uploadlease-subtext">
                      Supported formats: PDF, DOC, DOCX, Images
                    </p>
                  </>
                ) : (
                  <div className="file-preview">
                    <div className="file-info">
                      <FileText size={20} />
                      <span>{uploadedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="button-group">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : uploadedFile ? (
                    "Upload Lease"
                  ) : (
                    <>
                      Next <ChevronRight size={22} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {addStep === 2 && (
            <div className="form-grid">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="num_bedrooms"
                  value={formData.num_bedrooms}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="num_bathrooms"
                  value={formData.num_bathrooms}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Floors</label>
                <input
                  type="number"
                  name="num_floors"
                  value={formData.num_floors}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Purchase Price</label>
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Property Type</label>
                <input
                  type="text"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                />
              </div>

              <div className="checkbox-section">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="is_commercial"
                    checked={formData.is_commercial}
                    onChange={handleInputChange}
                  />
                  <label>Commercial Property</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="is_hoa"
                    checked={formData.is_hoa}
                    onChange={handleInputChange}
                  />
                  <label>HOA Property</label>
                </div>

                {formData.is_hoa && (
                  <div className="form-group">
                    <label>HOA Fee</label>
                    <input
                      type="number"
                      name="hoa_fee"
                      value={formData.hoa_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <div className="button-group">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setAddStep(1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Property"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
