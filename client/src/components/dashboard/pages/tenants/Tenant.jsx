import React, { useState } from 'react';
import './Tenant.css';
import Sidebar from '../../sidebar/Sidebar';
import TenantPopup from './TenantPopup';
import AddTenant from './AddTenant';
import Chat from '../../chatBot/Chat'

const TenantPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const tenants = [
    {
      id: 1,
      name: 'Samantha William',
      title: 'Web Developer',
      unit: 'A101',
      rentAmount: '$2,500',
      leaseEnd: '2024-12-31',
      lastPayment: '2024-03-01',
      email: 'email@mail.com',
      phone: '+12 345 6789',
      status: 'current'
    },
    {
      id: 2,
      name: 'Samantha William',
      title: 'Web Developer',
      unit: 'A101',
      rentAmount: '$2,500',
      leaseEnd: '2024-12-31',
      lastPayment: '2024-03-01',
      email: 'email@mail.com',
      phone: '+12 345 6789',
      status: 'late'
    },
    {
      id: 3,
      name: 'Samantha William',
      title: 'Web Developer',
      unit: 'A101',
      rentAmount: '$2,500',
      leaseEnd: '2024-12-31',
      lastPayment: '2024-03-01',
      email: 'email@mail.com',
      phone: '+12 345 6789',
      status: 'current'
    },
    {
      id: 4,
      name: 'Samantha William',
      title: 'Web Developer',
      unit: 'A101',
      rentAmount: '$2,500',
      leaseEnd: '2024-12-31',
      lastPayment: '2024-03-01',
      email: 'email@mail.com',
      phone: '+12 345 6789',
      status: 'late'
    }
  ];

  const handleTenantClick = (tenant) => {
    setSelectedTenant(tenant);
  };

  const filteredTenants = activeFilter === 'all' 
    ? tenants 
    : tenants.filter(tenant => tenant.status === activeFilter);

  return (
    <div className="tenant-page-container">
      <Sidebar/>
      <Chat/>
      <div className="tenant-content">
        <div className="tenant-page-header">
          <div className="header-left">
            <h1>Tenants</h1>            
          </div>
          
          <div className="header-right">
            <button 
              className="add-tenant-btn"
              onClick={() => setShowAddTenant(true)}
            >
              + Add Tenant
            </button>

            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'current' ? 'active' : ''}`}
                onClick={() => setActiveFilter('current')}
              >
                Current
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'late' ? 'active' : ''}`}
                onClick={() => setActiveFilter('late')}
              >
                Late
              </button>
            </div>

            <div className="search-box">
              <input type="text" placeholder="Search here" />
              <button className="search-icon">🔍</button>
            </div>
            
            <div className="view-toggles">
              <button 
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ≡
              </button>
              <button 
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
            </div>
          </div>
        </div>

        <div className={`tenant-grid ${viewMode}`}>
          {filteredTenants.map(tenant => (
            <div 
              key={tenant.id} 
              className={`tenant-card ${tenant.status}`}
              onClick={() => handleTenantClick(tenant)}
            >
              <div className="tenant-avatar"></div>
              <div className="tenant-info">
                <h3>{tenant.name}</h3>
                <p className="tenant-title">{tenant.title}</p>
                
                <div className="tenant-details">
                  <div className="detail-group">
                    <span className="label">Unit</span>
                    <span className="value">{tenant.unit}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Monthly Rent</span>
                    <span className="value">{tenant.rentAmount}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Lease Ends</span>
                    <span className="value">{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Last Payment</span>
                    <span className="value">{new Date(tenant.lastPayment).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Status</span>
                    <span className={`status-badge ${tenant.status}`}>
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="contact-buttons">
                  <button 
                    className="contact-btn phone"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle phone call
                    }}
                  >
                    <span>Phone</span>
                  </button>
                  <button 
                    className="contact-btn email"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle email
                    }}
                  >
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <div className="pagination-info">
            Showing 1-16 from 64 data
          </div>
          <div className="pagination-controls">
            <button className="page-btn prev">←</button>
            <div className="page-numbers">
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
            </div>
            <button className="page-btn next">→</button>
          </div>
        </div>

        {selectedTenant && (
          <TenantPopup 
            tenant={selectedTenant} 
            onClose={() => setSelectedTenant(null)} 
          />
        )}

        {showAddTenant && (
          <div className="modal-overlay" onClick={() => setShowAddTenant(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <AddTenant onClose={() => setShowAddTenant(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPage;