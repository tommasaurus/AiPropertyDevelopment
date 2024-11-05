// src/components/properties/Properties.js

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import AllDataTables from "../allDataTables/AllDataTables"; // Import the new component
import "./Properties.css";

const Properties = () => {
  // State variables for properties (Leases and Invoices are now handled by AllDataTables)
  const [properties, setProperties] = useState([]);

  // State variables for UI and form handling
  const [greeting, setGreeting] = useState("");
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customDocType, setCustomDocType] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);

  // State for form data when adding a new property
  const [formData, setFormData] = useState({
    address: "",
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

  const fileInputRef = useRef(null);
  const businessName = "Jason";
  const documentTypes = ["Lease", "Contract", "Invoice", "Legal", "Other"];

  // Helper functions for formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatJSON = (data) => {
    return data ? JSON.stringify(data, null, 2) : "N/A";
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setErrorMessage("Failed to fetch properties.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setGreeting(
        hour >= 5 && hour < 12
          ? "Good morning"
          : hour >= 12 && hour < 17
          ? "Good afternoon"
          : "Good evening"
      );
    };
    updateGreeting();

    const timer = setInterval(() => {
      updateGreeting();
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

      console.log(response.data)      
      const document_type = response.data;

      if (document_type) {
        setSelectedDocType(document_type);
        setUploadStep(2); // Move to Step 2
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

  // Handle Step 2: User confirms or changes document type and proceeds to Step 3
  const handleConfirmDocType = () => {
    if (!selectedDocType) {
      setErrorMessage("Please select a document type.");
      return;
    }
    setErrorMessage("");
    setUploadStep(3); // Move to Step 3
  };

  // Handle Step 3: Select property and process document
  const handleProcessDocument = async () => {
    if (!selectedProperty) {
      setErrorMessage("Please select a property.");
      return;
    }

    if (!selectedDocType) {
      setErrorMessage("Document type is not selected.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append("document_type", selectedDocType);
    formDataToSend.append("property_id", parseInt(selectedProperty, 10));

    try {
      setUploading(true);
      setErrorMessage("");

      const response = await api.post("/processor/process", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Document processed successfully:", response.data);
      setIsUploaded(true);
      resetUploadStates();
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

  // Handle modal form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle add property form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedData = {
      ...formData,
      num_bedrooms: formData.num_bedrooms
        ? parseInt(formData.num_bedrooms, 10)
        : null,
      num_bathrooms: formData.num_bathrooms
        ? parseInt(formData.num_bathrooms, 10)
        : null,
      num_floors: formData.num_floors
        ? parseInt(formData.num_floors, 10)
        : null,
      hoa_fee: formData.hoa_fee ? parseFloat(formData.hoa_fee) : null,
      purchase_price: formData.purchase_price
        ? parseFloat(formData.purchase_price)
        : null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null,
    };

    try {
      const response = await api.post("/properties", formattedData);
      console.log("Property added successfully:", response.data);
      setShowModal(false);
      setFormData({
        address: "",
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
      fetchProperties(); // Re-fetch properties after adding the new one
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

  // Reset upload states when closing the upload modal
  const resetUploadStates = () => {
    setFile(null);
    setSelectedDocType(null);
    setSelectedProperty("");
    setCustomDocType("");
    setUploadStep(1);
    setErrorMessage("");
    setIsUploaded(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1>Properties</h1>
            <div className="header-actions">
              <button
                className="primary-button"
                onClick={() => setShowModal(true)}
              >
                Add Property
              </button>
              <button
                className="primary-button"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="properties-table-container">
          <table className="properties-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Property Type</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Floors</th>
                <th>Commercial</th>
                <th>HOA</th>
                <th>HOA Fee</th>
                <th>Purchase Price</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>{property.address}</td>
                  <td>{property.property_type || "N/A"}</td>
                  <td>{property.num_bedrooms || "N/A"}</td>
                  <td>{property.num_bathrooms || "N/A"}</td>
                  <td>{property.num_floors || "N/A"}</td>
                  <td>{property.is_commercial ? "Yes" : "No"}</td>
                  <td>{property.is_hoa ? "Yes" : "No"}</td>
                  <td>
                    {property.hoa_fee ? formatCurrency(property.hoa_fee) : "N/A"}
                  </td>
                  <td>{formatCurrency(property.purchase_price)}</td>
                  <td>{formatDate(property.purchase_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Upload Document</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setShowUploadModal(false);
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
                        <button
                          className="delete-file"
                          onClick={() => setFile(null)}
                        >
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
                    <h3>Select Property</h3>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
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
                  </div>
                )}

                {/* Success and Error Messages */}
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                {isUploaded && (
                  <p className="success-message">
                    Document uploaded successfully!
                  </p>
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
        )}

        {/* Add Property Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add New Property</h2>
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
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
                    <label>Purchase Date</label>
                    <input
                      type="date"
                      name="purchase_date"
                      value={formData.purchase_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>HOA Fee</label>
                    <input
                      type="number"
                      name="hoa_fee"
                      value={formData.hoa_fee}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_commercial"
                        checked={formData.is_commercial}
                        onChange={handleInputChange}
                      />
                      Commercial Property
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="is_hoa"
                        checked={formData.is_hoa}
                        onChange={handleInputChange}
                      />
                      HOA Property
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* All Data Tables */}
        <AllDataTables />
      </main>
    </div>
  );
};

export default Properties;
