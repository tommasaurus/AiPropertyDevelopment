import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import "./Properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(""); // State for selected property
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customDocType, setCustomDocType] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
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
      setFilePreview(URL.createObjectURL(selectedFile));
      setIsUploaded(false);
      setErrorMessage("");
    }
  };

  // Upload file to backend
  const handleUploadFile = async () => {
    if (!file || (!selectedDocType && !customDocType) || !selectedProperty) {
      setErrorMessage("Please upload a file, select a document type, and select a property.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", selectedDocType === "Other" ? customDocType : selectedDocType);
    formData.append("propertyId", selectedProperty); // Include selected property ID

    try {
      setUploading(true);
      setErrorMessage("");

      const response = await api.post("/placeholder-upload-endpoint", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload successful:", response.data);
      setIsUploaded(true);
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error uploading document:", error);
      setErrorMessage("Failed to upload document. Please try again.");
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
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

        <div
          className={`file-drop-area ${dragActive ? "active" : ""}`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
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

        {filePreview && (
          <div className="uploaded-file-preview">
            <img src={filePreview} alt="Preview" className="file-preview-image" />
            <button className="delete-file" onClick={() => { setFile(null); setFilePreview(null); }}>
              Remove
            </button>
          </div>
        )}

        <button onClick={handleUploadFile} className="upload-button" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        {isUploaded && <p className="success-message">Document uploaded successfully!</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Properties List Section */}
        <div className="properties-list">
          <h2 className="properties-title">Properties</h2>
          {properties.length > 0 ? (
            <ul className="properties-items">
              {properties.map((property) => (
                <li key={property.id} className="property-item">
                  <h3>{property.address}</h3>
                  <p>{property.address}</p>
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
