import React, { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import api from "../../../../services/api";
import logo from "../../../../assets/img/logo.png";
import Chat from "../../chatBot/Chat";
import Greeting from "../../greeting/Greeting";
import "./emptyDashboard.css";

const EmptyDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

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
      const propertyResponse = await api.post("/properties", formattedData);
      const propertyId = propertyResponse.data.id;

      if (file) {
        const fileFormData = new FormData();
        fileFormData.append("file", file);
        fileFormData.append("property_id", propertyId);
        fileFormData.append("document_type", "purchase_contract");

        await api.post("/contracts/upload", fileFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      window.location.reload();
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
    <div className='empty-dashboard-layout'>
      <Sidebar logo={logo} />
      <TopNavigation />
      <Chat />
      <Greeting />

      <main className='empty-dashboard-main'>
        <div className='dashboard-header'>
          <p className='date-display'>
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className='content-container'>
          <form onSubmit={handleSubmit} className='property-form'>
            <h3 className='section-title'>Add Your First Property</h3>

            <div className='form-section'>
              <div className='input-group'>
                <label className='form-label'>Address</label>
                <input
                  type='text'
                  name='address'
                  className='form-input'
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter property address'
                />
              </div>

              <div className='form-row'>
                <div className='input-group'>
                  <label className='form-label'>Bedrooms</label>
                  <input
                    type='number'
                    name='num_bedrooms'
                    className='form-input'
                    value={formData.num_bedrooms}
                    onChange={handleInputChange}
                    placeholder='0'
                  />
                </div>

                <div className='input-group'>
                  <label className='form-label'>Bathrooms</label>
                  <input
                    type='number'
                    name='num_bathrooms'
                    className='form-input'
                    value={formData.num_bathrooms}
                    onChange={handleInputChange}
                    placeholder='0'
                  />
                </div>

                <div className='input-group'>
                  <label className='form-label'>Floors</label>
                  <input
                    type='number'
                    name='num_floors'
                    className='form-input'
                    value={formData.num_floors}
                    onChange={handleInputChange}
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='input-group'>
                  <label className='form-label'>Purchase Price</label>
                  <input
                    type='number'
                    name='purchase_price'
                    className='form-input'
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    placeholder='Enter amount'
                  />
                </div>

                <div className='input-group'>
                  <label className='form-label'>Purchase Date</label>
                  <input
                    type='date'
                    name='purchase_date'
                    className='form-input'
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='input-group'>
                <label className='form-label'>Property Type</label>
                <input
                  type='text'
                  name='property_type'
                  className='form-input'
                  value={formData.property_type}
                  onChange={handleInputChange}
                  placeholder='e.g., Single Family, Apartment'
                />
              </div>

              <div className='checkbox-section'>
                <label className='checkbox-container'>
                  <input
                    type='checkbox'
                    name='is_commercial'
                    checked={formData.is_commercial}
                    onChange={handleInputChange}
                  />
                  <span className='checkbox-text'>Commercial Property</span>
                </label>

                <label className='checkbox-container'>
                  <input
                    type='checkbox'
                    name='is_nnn'
                    checked={formData.is_nnn}
                    onChange={handleInputChange}
                  />
                  <span className='checkbox-text'>NNN Lease</span>
                </label>

                <label className='checkbox-container'>
                  <input
                    type='checkbox'
                    name='is_hoa'
                    checked={formData.is_hoa}
                    onChange={handleInputChange}
                  />
                  <span className='checkbox-text'>HOA Property</span>
                </label>
              </div>

              {formData.is_hoa && (
                <div className='input-group'>
                  <label className='form-label'>HOA Fee</label>
                  <input
                    type='number'
                    name='hoa_fee'
                    className='form-input'
                    value={formData.hoa_fee}
                    onChange={handleInputChange}
                    placeholder='Enter monthly HOA fee'
                  />
                </div>
              )}
            </div>
          </form>

          <div className='document-upload-section'>
            <h3 className='section-title'>Upload Documents</h3>
            <div
              className='upload-area'
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) setFile(droppedFile);
              }}
            >
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
                accept='.pdf,.doc,.docx'
              />
              <Upload className='upload-icon' />
              <p className='upload-text'>
                {file ? file.name : "Drop files here or click to upload"}
              </p>
              <p className='upload-subtext'>Supports: PDF, DOC, DOCX</p>
            </div>

            {file && (
              <div className='file-preview'>
                <span className='file-name'>{file.name}</span>
                <button className='remove-file' onClick={() => setFile(null)}>
                  Remove
                </button>
              </div>
            )}

            {errorMessage && <p className='error-message'>{errorMessage}</p>}

            <button
              type='submit'
              disabled={isSubmitting}
              className='submit-button'
              onClick={handleSubmit}
            >
              {isSubmitting ? "Adding Property..." : "Add Property"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmptyDashboard;
