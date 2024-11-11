// src/components/properties/AddProperty.js

import React, { useState } from "react";
import api from "../../../../services/api";
import AddressAutocomplete from "../../addressAutocomplete/AddressAutocomplete";
import "./AddProperty.css";

const AddProperty = ({ onClose, fetchAllData }) => {
  // State variables for form handling
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
      const randomInt = Math.floor(Math.random() * 5) + 1; // Random integer between 1 and 5
      const randomIntFloor = Math.floor(Math.random() * 3) + 2;
      const propertyValue = randomInt * 417827;

      setFormData((prev) => ({
        ...prev,
        num_bedrooms: randomInt,
        num_bathrooms: randomInt,
        num_floors: randomIntFloor,
        purchase_price: propertyValue,
        property_type: "Residential", // Example default value
        is_hoa: true,
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
      num_bedrooms: formData.num_bedrooms ? parseInt(formData.num_bedrooms, 10) : null,
      num_bathrooms: formData.num_bathrooms ? parseInt(formData.num_bathrooms, 10) : null,
      num_floors: formData.num_floors ? parseInt(formData.num_floors, 10) : null,
      hoa_fee: formData.hoa_fee ? parseFloat(formData.hoa_fee) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null,
    };

    try {
      await api.post("/properties", formattedData);
      resetAddPropertyStates();
      fetchAllData();
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding property:", error);
      setErrorMessage(
        error.response?.data?.detail || "Failed to add property. Please try again."
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
  };

  return (
    <div className="modal nouveau-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Property</h2>
          <button
            className="close-button"
            onClick={() => {
              resetAddPropertyStates();
              onClose();
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

              {errorMessage && <p className="error-message">{errorMessage}</p>}

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

              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setAddStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="primary-button" disabled={isSubmitting}>
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
