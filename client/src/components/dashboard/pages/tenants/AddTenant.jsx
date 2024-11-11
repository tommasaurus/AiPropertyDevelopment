import React, { useState } from 'react';
import './AddTenant.css';

const AddTenant = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    unit: '',
    rentAmount: '',
    leaseStart: '',
    leaseEnd: '',
    company: '',
    title: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="add-tenant-container">
      <div className="add-tenant-header">
        <button className="back-button" onClick={onClose}>←</button>
        <h1>Add New Tenant</h1>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-section">
          <h2>General Info</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>FIRST NAME</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>LAST NAME</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group profile-picture">
              <label>PROFILE PICTURE</label>
              <div className="profile-upload">
                <div className="profile-placeholder"></div>
                <button type="button" className="change-photo-btn">
                  CHANGE PHOTO
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>UNIT NUMBER</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>MONTHLY RENT</label>
              <input
                type="text"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>LEASE START DATE</label>
              <input
                type="date"
                name="leaseStart"
                value={formData.leaseStart}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>LEASE END DATE</label>
              <input
                type="date"
                name="leaseEnd"
                value={formData.leaseEnd}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>PHONE NUMBER</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="save-button">
          SAVE TENANT
        </button>
      </form>
    </div>
  );
};

export default AddTenant;