// TenantPage.jsx
import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import './TenantPage.css';

const TenantPage = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  
  const tenants = [
    {
      id: 1,
      name: "Sarah Johnson",
      unit: "A-101",
      leaseEnd: "2024-12-31",
      rentStatus: "current",
      contactNumber: "(555) 123-4567",
      email: "sarah.j@email.com",
      moveInDate: "2023-01-15",
      rentAmount: "$2,400",
      lastPayment: "2024-03-01",
      profileColor: "#C8977F"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      unit: "A-101",
      leaseEnd: "2024-12-31",
      rentStatus: "current",
      contactNumber: "(555) 123-4567",
      email: "sarah.j@email.com",
      moveInDate: "2023-01-15",
      rentAmount: "$2,400",
      lastPayment: "2024-03-01",
      profileColor: "#A17A69"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      unit: "A-101",
      leaseEnd: "2024-12-31",
      rentStatus: "current",
      contactNumber: "(555) 123-4567",
      email: "sarah.j@email.com",
      moveInDate: "2023-01-15",
      rentAmount: "$2,400",
      lastPayment: "2024-03-01",
      profileColor: "#D4B4A7"
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <div className="tenant-page">
          <div className="decorative-header">
            <div className="header-line">
              <div className="circle-ornament"></div>
            </div>
            <h1>TENANT PORTAL</h1>
            <div className="header-line">
              <div className="circle-ornament"></div>
            </div>
          </div>

          <div className="search-filter-bar">
            <input type="search" placeholder="Search tenants..." className="search-input" />
            <div className="filter-buttons">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Current</button>
              <button className="filter-btn">Late</button>
            </div>
          </div>

          <div className="tenant-grid">
            {tenants.map(tenant => (
              <div 
                key={tenant.id} 
                className={`tenant-card ${selectedTenant === tenant.id ? 'selected' : ''}`}
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <div className="card-content">
                  <div className="tenant-header">
                    <div 
                      className="tenant-avatar"
                      style={{ backgroundColor: tenant.profileColor }}
                    >
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="tenant-title">
                      <h2>{tenant.name}</h2>
                      <span className="unit-number">Unit {tenant.unit}</span>
                    </div>
                  </div>

                  <div className="tenant-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="label">Monthly Rent</span>
                        <span className="value">{tenant.rentAmount}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Last Payment</span>
                        <span className="value">{new Date(tenant.lastPayment).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="label">Lease Ends</span>
                        <span className="value">{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className={`status-badge ${tenant.rentStatus}`}>
                          {tenant.rentStatus.charAt(0).toUpperCase() + tenant.rentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="action-btn email">
                      <span className="action-text">Email</span>
                    </button>
                    <button className="action-btn call">
                      <span className="action-text">Call</span>
                    </button>
                    <button className="action-btn more">
                      <span className="action-text">Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPage;