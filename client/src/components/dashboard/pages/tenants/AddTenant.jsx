// src/components/tenant/AddTenant.jsx

import React, { useState, useEffect } from 'react';
import './AddTenant.css';
import api from '../../../../services/api';

const AddTenant = ({ onClose, fetchTenants }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    property_id: '',
    lease_type: '',
    rent_amount_monthly: '',
    lease_start: '',
    lease_end: '',
  });

  const [properties, setProperties] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch properties from API on component mount
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setErrorMessage('Failed to fetch properties. Please try again.');
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        setErrorMessage('First name and last name are required.');
        setIsSubmitting(false);
        return;
      }

      // Create tenant payload
      const tenantPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || null,
        phone_number: formData.phone_number || null,
        property_id: formData.property_id || null,
      };

      // Create Tenant
      const tenantResponse = await api.post('/tenants/manual', tenantPayload);
      const tenant = tenantResponse.data;

      // Conditionally create Lease if property_id and lease_type are provided
      if (formData.property_id && formData.lease_type) {
        const leasePayload = {
          property_id: parseInt(formData.property_id, 10),
          lease_type: formData.lease_type,
          rent_amount_monthly: formData.rent_amount_monthly
            ? parseFloat(formData.rent_amount_monthly)
            : null,
          start_date: formData.lease_start || null,
          end_date: formData.lease_end || null,
          tenant_id: tenant.id,
        };

        // Check if a lease with the same property_id and lease_type exists
        const existingLeasesResponse = await api.get('/leases', {
          params: {
            property_id: leasePayload.property_id,
            lease_type: leasePayload.lease_type,
          },
        });
        const existingLeases = existingLeasesResponse.data;

        if (existingLeases.length === 0) {
          // Create Lease only if it doesn't exist
          await api.post('/leases', leasePayload);
        }
      }

      // Refresh tenant list
      if (fetchTenants) {
        await fetchTenants();
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error adding tenant:', error);
      // Check if error response exists
      if (error.response && error.response.data && error.response.data.detail) {
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          // If it's an array, map over the errors to create a string
          const messages = errorDetail.map((err) => err.msg).join(' ');
          setErrorMessage(messages);
        } else if (typeof errorDetail === 'string') {
          // If it's a string, use it directly
          setErrorMessage(errorDetail);
        } else {
          setErrorMessage('An unknown error occurred.');
        }
      } else {
        setErrorMessage('Failed to add tenant. Please try again.');
      }    
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-tenant-container">
      <div className="add-tenant-header">
        <button className="back-button" onClick={onClose}>
          ←
        </button>
        <h1>Add New Tenant</h1>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-section">
          <h2>General Info</h2>

          <div className="form-row">
            <div className="form-group">
              <label>FIRST NAME *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>LAST NAME *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="form-group profile-picture">
              <label>PROFILE PICTURE</label>
              <div className="profile-upload">
                <div className="profile-placeholder">No Image</div>
                <button type="button" className="change-photo-btn">
                  CHANGE PHOTO
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PROPERTY</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
              >
                <option value="">Select Property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>LEASE TYPE</label>
              <input
                type="text"
                name="lease_type"
                value={formData.lease_type}
                onChange={handleChange}
                placeholder="e.g., Housing Contract"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>LEASE START DATE</label>
              <input
                type="date"
                name="lease_start"
                value={formData.lease_start}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>LEASE END DATE</label>
              <input
                type="date"
                name="lease_end"
                value={formData.lease_end}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>MONTHLY RENT</label>
              <input
                type="number"
                name="rent_amount_monthly"
                value={formData.rent_amount_monthly}
                onChange={handleChange}
                placeholder="e.g., 2500"
                min="0"
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
                placeholder="e.g., email@mail.com"
              />
            </div>

            <div className="form-group">
              <label>PHONE NUMBER</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="e.g., +12 345 6789"
              />
            </div>
          </div>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="save-button" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'SAVE TENANT'}
        </button>
      </form>
    </div>
  );
};

export default AddTenant;
