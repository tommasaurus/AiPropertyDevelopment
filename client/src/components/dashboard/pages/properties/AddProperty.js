// AddProperty.jsx
import React, { useState } from "react";
import api from "../../../../services/api";
import AddressAutocomplete from "../../addressAutocomplete/AddressAutocomplete";
import { Home, X, ChevronRight } from "lucide-react";
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

  const generateSmartPropertyDetails = () => {
    // Generate random number of floors (1-4)
    const floors = Math.floor(Math.random() * 4) + 1;

    // Calculate bedrooms based on floors (2-4 bedrooms per floor)
    const bedroomsPerFloor = Math.floor(Math.random() * 4) + 1;
    const totalBedrooms = floors * bedroomsPerFloor;

    // Calculate bathrooms (typically fewer than bedrooms)
    const totalBathrooms = Math.max(floors, Math.ceil(totalBedrooms * 0.7));

    // Base price per bedroom (350k-450k)
    const pricePerBedroom = Math.random() * 150000 + 350000;

    // Calculate total price based on bedrooms, floors, and a random factor
    const basePrice = totalBedrooms * pricePerBedroom;
    const floorMultiplier = 1 + (floors - 1) * 0.2; // Each additional floor adds 20%
    const randomFactor = 0.9 + Math.random() * 0.2; // ±10% variation
    const totalPrice = Math.round(basePrice * floorMultiplier * randomFactor);

    // Property types based on size
    const propertyTypes = [
      "Single Family Home",
      "Townhouse",
      "Multi-Family Home",
      "Apartment Complex",
    ];
    const propertyType =
      propertyTypes[Math.min(floors - 1, propertyTypes.length - 1)];

    // HOA fee based on property type and size
    const baseHoaFee = 250;
    const hoaFee = Math.round(
      baseHoaFee * (floors * 0.5) * (Math.random() * 0.4 + 0.8)
    );

    return {
      num_bedrooms: totalBedrooms,
      num_bathrooms: totalBathrooms,
      num_floors: floors,
      purchase_price: totalPrice,
      property_type: propertyType,
      is_hoa: true,
      hoa_fee: hoaFee,
    };
  };

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

  const handleNextAddStep = () => {
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      setErrorMessage("Please fill in all address fields.");
      return;
    }
    // Auto-fill property details with smart random data
    const propertyDetails = generateSmartPropertyDetails();
    setFormData((prev) => ({
      ...prev,
      ...propertyDetails,
    }));
    setErrorMessage("");
    setAddStep(2);
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
      resetAddPropertyStates();
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
              <span>Address Information</span>
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
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              <div className="button-group">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleNextAddStep}
                >
                  Next <ChevronRight size={22} strokeWidth={2.5} />
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
