import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import "./Properties.css";

const Properties = () => {
  // State variables for properties and leases
  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);
  
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
    property_type: ""
  });
  
  const fileInputRef = useRef(null);
  const businessName = "Jason";
  const documentTypes = ["Lease", "Contract", "Invoice", "Receipt", "Legal", "Other"];

  // Helper functions for formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatJSON = (data) => {
    return data ? JSON.stringify(data) : "N/A";
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

  // Fetch leases from API
  const fetchLeases = async () => {
    try {
      const response = await api.get("/leases");
      setLeases(response.data);
    } catch (error) {
      console.error("Error fetching leases:", error);
      setErrorMessage("Failed to fetch leases.");
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchLeases();
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
    }
  };

  // Upload lease document to backend
  const handleUploadLease = async () => {
    if (!file || !selectedDocType || !selectedProperty) {
      setErrorMessage("Please upload a file, select a document type, and select a property.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    const documentType = selectedDocType === "Other" ? customDocType : selectedDocType;
    formData.append("document_type", documentType);
    formData.append("property_id", parseInt(selectedProperty, 10));
  
    try {
      setUploading(true);
      setErrorMessage("");
  
      // Remove the headers object to let Axios set the Content-Type automatically
      const response = await api.post("/leases/upload", formData);
  
      console.log("Lease document uploaded successfully:", response.data);
      setIsUploaded(true);
      setFile(null);

      // Refetch leases to include the newly uploaded lease
      await fetchLeases();
  
    } catch (error) {
      console.error("Error uploading lease document:", error);
      setErrorMessage(
        error.response?.data?.detail || "Failed to upload document. Please try again."
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
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle add property form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedData = {
      ...formData,
      num_bedrooms: formData.num_bedrooms ? parseInt(formData.num_bedrooms, 10) : null,
      num_bathrooms: formData.num_bathrooms ? parseInt(formData.num_bathrooms, 10) : null,
      num_floors: formData.num_floors ? parseInt(formData.num_floors, 10) : null,
      hoa_fee: formData.hoa_fee ? parseFloat(formData.hoa_fee) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null
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
        property_type: ""
      });
      fetchProperties(); // Re-fetch properties after adding the new one
    } catch (error) {
      console.error("Error adding property:", error);
      setErrorMessage(
        error.response?.data?.detail || "Failed to add property. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
        {/* Greeting Section */}
        <div className="greeting-section">
          <h1 className="greeting-title">
            {greeting} {businessName}
          </h1>
          <p className="greeting-date">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>

        {/* Document Type Selection */}
        <div className="document-type-section">
          <h2>Select Document Type</h2>
          <div className="document-type-boxes">
            {documentTypes.map((type) => (
              <div
                key={type}
                className={`document-type-box ${selectedDocType === type ? "selected" : ""}`}
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

        {/* Property Selection Dropdown */}
        <div className="property-selection">
          <h2>Select Property</h2>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="property-dropdown"
          >
            <option value="" disabled>Select a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.address}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Area */}
        <div
          className="file-drop-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileChange({ target: { files: e.dataTransfer.files } });
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

        {/* Selected File Preview */}
        {file && (
          <div className="uploaded-file-preview">
            <p>Selected file: {file.name}</p>
            <button className="delete-file" onClick={() => { setFile(null); }}>
              Remove
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button onClick={handleUploadLease} className="upload-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        {/* Success and Error Messages */}
        {isUploaded && <p className="success-message">Document uploaded successfully!</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Lease Details Section */}
        <div className="leases-list">
          <h2 className="leases-title">Leases</h2>
          {leases.length > 0 ? (
            <ul className="leases-items">
              {leases.map((lease) => (
                <li key={lease.id} className="lease-item">
                  <h3>Lease ID: {lease.id}</h3>
                  <p>
                    <strong>Property Address:</strong>{" "}
                    {
                      properties.find((prop) => prop.id === lease.property_id)?.address ||
                      "Unknown Property"
                    }
                  </p>
                  <p><strong>Lease Type:</strong> {lease.lease_type}</p>
                  <p>
                    <strong>Rent Amount Total:</strong> {formatCurrency(lease.rent_amount_total)}
                  </p>
                  <p>
                    <strong>Rent Amount Monthly:</strong> {formatCurrency(lease.rent_amount_monthly)}
                  </p>
                  <p><strong>Security Deposit Amount:</strong> {lease.security_deposit_amount || "N/A"}</p>
                  <p><strong>Security Deposit Held By:</strong> {lease.security_deposit_held_by || "N/A"}</p>
                  <p>
                    <strong>Start Date:</strong> {formatDate(lease.start_date)}
                  </p>
                  <p>
                    <strong>End Date:</strong> {formatDate(lease.end_date)}
                  </p>
                  <p><strong>Payment Frequency:</strong> {lease.payment_frequency || "N/A"}</p>
                  <p><strong>Tenant Info:</strong> {formatJSON(lease.tenant_info)}</p>
                  <p><strong>Special Lease Terms:</strong> {formatJSON(lease.special_lease_terms)}</p>
                  <p><strong>Is Active:</strong> {lease.is_active ? 'Yes' : 'No'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No leases available.</p>
          )}
        </div>

        {/* Properties List Section */}
        <div className="properties-list">
          <h2 className="properties-title">Properties</h2>
          {properties.length > 0 ? (
            <ul className="properties-items">
              {properties.map((property) => (
                <li key={property.id} className="property-item">
                  <h3>{property.address}</h3>
                  {/* Add any additional property details here */}
                  <p><strong>Bedrooms:</strong> {property.num_bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {property.num_bathrooms}</p>
                  <p><strong>Floors:</strong> {property.num_floors}</p>
                  <p><strong>Commercial:</strong> {property.is_commercial ? 'Yes' : 'No'}</p>
                  <p><strong>HOA:</strong> {property.is_hoa ? 'Yes' : 'No'}</p>
                  {property.is_hoa && <p><strong>HOA Fee:</strong> ${property.hoa_fee}</p>}
                  <p><strong>Purchase Price:</strong> {formatCurrency(property.purchase_price)}</p>
                  <p><strong>Purchase Date:</strong> {formatDate(property.purchase_date)}</p>
                  <p><strong>Property Type:</strong> {property.property_type}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No properties available.</p>
          )}
          <button onClick={() => setShowModal(true)} className="add-property-button">
            Add Property
          </button>
        </div>

        {/* Add Property Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Property</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Address:
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </label>
                <label>
                  Number of Bedrooms:
                  <input type="number" name="num_bedrooms" value={formData.num_bedrooms} onChange={handleInputChange} />
                </label>
                <label>
                  Number of Bathrooms:
                  <input type="number" name="num_bathrooms" value={formData.num_bathrooms} onChange={handleInputChange} />
                </label>
                <label>
                  Number of Floors:
                  <input type="number" name="num_floors" value={formData.num_floors} onChange={handleInputChange} />
                </label>
                <label>
                  Commercial Property:
                  <input type="checkbox" name="is_commercial" checked={formData.is_commercial} onChange={handleInputChange} />
                </label>
                <label>
                  HOA Property:
                  <input type="checkbox" name="is_hoa" checked={formData.is_hoa} onChange={handleInputChange} />
                </label>
                <label>
                  HOA Fee:
                  <input type="number" name="hoa_fee" value={formData.hoa_fee} onChange={handleInputChange} />
                </label>
                <label>
                  Purchase Price:
                  <input type="number" name="purchase_price" value={formData.purchase_price} onChange={handleInputChange} />
                </label>
                <label>
                  Purchase Date:
                  <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleInputChange} />
                </label>
                <label>
                  Property Type:
                  <input type="text" name="property_type" value={formData.property_type} onChange={handleInputChange} />
                </label>
                <div className="modal-buttons">
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Property"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Properties;
