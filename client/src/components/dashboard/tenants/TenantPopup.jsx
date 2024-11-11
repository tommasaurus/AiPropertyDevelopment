import React from 'react';
import './TenantPopup.css';

const TenantPopup = ({ tenant, onClose }) => {
  return (
    <div className="tenant-popup-overlay" onClick={onClose}>
      <div className="tenant-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="tenant-popup-header">
          <div className="tenant-popup-avatar"></div>
          <div className="tenant-popup-title">
            <h2>{tenant.name}</h2>
            <p>{tenant.title}</p>
          </div>
        </div>

        <div className="tenant-popup-sections">
          <div className="popup-section">
            <h3>Lease Information</h3>
            <div className="popup-grid">
              <div className="popup-detail">
                <span className="popup-label">Unit</span>
                <span className="popup-value">{tenant.unit}</span>
              </div>
              <div className="popup-detail">
                <span className="popup-label">Monthly Rent</span>
                <span className="popup-value">{tenant.rentAmount}</span>
              </div>
              <div className="popup-detail">
                <span className="popup-label">Lease End Date</span>
                <span className="popup-value">{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
              </div>
              <div className="popup-detail">
                <span className="popup-label">Last Payment</span>
                <span className="popup-value">{new Date(tenant.lastPayment).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="popup-section">
            <h3>Contact Information</h3>
            <div className="popup-grid">
              <div className="popup-detail">
                <span className="popup-label">Email</span>
                <span className="popup-value">{tenant.email}</span>
              </div>
              <div className="popup-detail">
                <span className="popup-label">Phone</span>
                <span className="popup-value">{tenant.phone}</span>
              </div>
            </div>
          </div>

          <div className="popup-section">
            <h3>Actions</h3>
            <div className="popup-actions">
              <button className="popup-action-btn edit">Edit Tenant</button>
              <button className="popup-action-btn message">Send Message</button>
              <button className="popup-action-btn delete">Remove Tenant</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPopup;