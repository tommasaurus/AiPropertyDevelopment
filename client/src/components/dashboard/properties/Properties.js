// src/components/properties/Properties.js

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import Greeting from "../greeting/Greeting";
import SearchBar from "../searchBar/SearchBar";
import AddressAutocomplete from "../addressAutocomplete/AddressAutocomplete";
import PropertyDetails from "./propertyDetails";
import "./Properties.css";

const Properties = () => {
  // State variables for properties and related data
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);

  // State variables for UI and form handling
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [customDocType, setCustomDocType] = useState("");
  const [uploadStep, setUploadStep] = useState(1);
  const [addStep, setAddStep] = useState(1); // For Add Property Steps

  // State for form data when adding a new property
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

  const fileInputRef = useRef(null);
  const documentTypes = ["Lease", "Contract", "Invoice", "Legal", "Other"];

  // Helper functions for formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const responses = await Promise.all([
        api.get("/properties"),
        api.get("/contracts"),
        api.get("/documents"),
        api.get("/expenses"),
        api.get("/incomes"),
        api.get("/invoices"),
        api.get("/leases"),
        api.get("/payments"),
        api.get("/tenants"),
        api.get("/vendors"),
      ]);

      setProperties(responses[0].data);
      setContracts(responses[1].data);
      setDocuments(responses[2].data);
      setExpenses(responses[3].data);
      setIncomes(responses[4].data);
      setInvoices(responses[5].data);
      setLeases(responses[6].data);
      setPayments(responses[7].data);
      setTenants(responses[8].data);
      setVendors(responses[9].data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle property row click
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

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
    setUploadStep(3);
  };

  // Handle Step 3: Process document
  const handleProcessDocument = async () => {
    if (!selectedProperty) {
      setErrorMessage("Please select a property.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    formDataToSend.append(
      "document_type",
      selectedDocType === "Other" ? customDocType : selectedDocType
    );
    formDataToSend.append("property_id", selectedProperty.id);

    try {
      setUploading(true);
      setErrorMessage("");

      await api.post("/processor/process", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsUploaded(true);
      resetUploadStates();
      fetchAllData(); // Refresh data after successful upload
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

  // Handle address selection from autocomplete
  const handleSelectAddress = (addressData) => {
    setFormData((prev) => ({
      ...prev,
      address: addressData.formattedAddress || "",
      city: addressData.city || "",
      state: addressData.state || "",
      zipCode: addressData.zipCode || "",
    }));
  };

  // Proceed to next step in Add Property modal
  const handleNextAddStep = () => {
    if (addStep === 1) {
      // You can add validation for address fields here if needed
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setErrorMessage("Please fill in all address fields.");
        return;
      }
      // Auto-fill property information with placeholder data
      const randomInt = Math.floor(Math.random() * 5) + 1;   // Random integer between 1 and 5
      const randomIntFloor = Math.floor(Math.random() * 3) + 2;
      const propertyValue = randomInt * 417827;

      setFormData((prev) => ({
        ...prev,
        num_bedrooms: randomInt,
        num_bathrooms: randomInt,
        num_floors: randomIntFloor,
        purchase_price: propertyValue,
        property_type: "Residential", // Example default value
        is_hoa: true
      }));

      setErrorMessage("");
      setAddStep(2);
    }
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
      await api.post("/properties", formattedData);
      setShowModal(false);
      setFormData({
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
      setAddStep(1);
      fetchAllData();
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

  // Reset add property modal states
  const resetAddPropertyStates = () => {
    setFormData({
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
    setAddStep(1);
    setErrorMessage("");
    setIsSubmitting(false);
    setShowModal(false);
  };

  // Reset upload states
  const resetUploadStates = () => {
    setFile(null);
    setSelectedDocType(null);
    setCustomDocType("");
    setUploadStep(1);
    setErrorMessage("");
    setIsUploaded(false);
    setShowUploadModal(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
        <SearchBar />
        <Greeting />
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
                <tr
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  className="cursor-pointer hover:bg-gray-50"
                >
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

        {/* Property Details Modal */}
        {selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            contracts={contracts}
            documents={documents}
            expenses={expenses}
            incomes={incomes}
            invoices={invoices}
            leases={leases}
            payments={payments}
            tenants={tenants}
            vendors={vendors}
          />
        )}

        {/* Add Property Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Add New Property</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    resetAddPropertyStates();
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="steps-indicator-add">
                  <div className={`step-add ${addStep >= 1 ? "active" : ""}`}>
                    1. Address Information
                  </div>
                  <div className={`step-add ${addStep >= 2 ? "active" : ""}`}>
                    2. Property Details
                  </div>
                </div>

                {addStep === 1 && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Address</label>
                      <AddressAutocomplete onSelectAddress={handleSelectAddress} />
                    </div>

                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {errorMessage && (
                      <p className="error-message">{errorMessage}</p>
                    )}

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={handleNextAddStep}
                      >
                        Next
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
                      <label>Purchase Date</label>
                      <input
                        type="date"
                        name="purchase_date"
                        value={formData.purchase_date}
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

                    <div className="form-group">
                      <label>HOA Fee</label>
                      <input
                        type="number"
                        name="hoa_fee"
                        value={formData.hoa_fee}
                        onChange={handleInputChange}
                      />
                    </div>

                    {errorMessage && (
                      <p className="error-message">{errorMessage}</p>
                    )}

                    <div className="modal-footer">
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
        )}

        {/* Upload Document Modal */}        
        {showUploadModal && (
          <div className='modal'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2>Upload Document</h2>
                <button
                  className='close-button'
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadStates();
                  }}
                >
                  ×
                </button>
              </div>

              <div className='modal-body'>
                {/* Steps Indicator */}
                <div className='steps-indicator'>
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
                      <p>Drag & drop files here, or click to upload</p>
                    </div>

                    {file && (
                      <div className='uploaded-file-preview'>
                        <p>{file.name}</p>
                        <button
                          className='delete-file'
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
                  <div className='upload-step'>
                    <h3>Determine Document Type</h3>
                    <p>
                      The document type has been determined as:{" "}
                      <strong>{selectedDocType}</strong>. You can change it if
                      necessary.
                    </p>
                    <div className='document-type-boxes'>
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
                        className='custom-doc-input'
                        placeholder='Enter custom document type'
                        value={customDocType}
                        onChange={(e) => setCustomDocType(e.target.value)}
                      />
                    )}
                  </div>
                )}

                {/* Step 3: Select Property */}
                {uploadStep === 3 && (
                  <div className='upload-step'>
                    <h3>Select Property</h3>
                    <select
                      value={selectedProperty ? selectedProperty.id : ""}
                      onChange={(e) => {
                        const property = properties.find(
                          (p) => p.id === parseInt(e.target.value)
                        );
                        setSelectedProperty(property);
                      }}
                      className='property-dropdown'
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
                  </div>
                )}

                {/* Success and Error Messages */}
                {errorMessage && (
                  <p className='error-message'>{errorMessage}</p>
                )}
                {isUploaded && (
                  <p className='success-message'>
                    Document uploaded successfully!
                  </p>
                )}
              </div>

              <div className='modal-footer'>
                {/* Back Button */}
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

                {/* Next Button */}
                {uploadStep < 3 && (
                  <button
                    className='primary-button'
                    onClick={async () => {
                      if (uploadStep === 1) {
                        if (!file) {
                          setErrorMessage("Please select a file first.");
                          return;
                        }
                        await handleDetermineDocType();
                      } else if (uploadStep === 2) {
                        if (selectedDocType === "Other" && !customDocType) {
                          setErrorMessage(
                            "Please enter a custom document type."
                          );
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
        )}
      </main>
    </div>
  );
};

export default Properties;
