// src/components/tenant/TenantPage.jsx

import React, { useState, useEffect } from "react";
import "./Tenant.css";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import TenantPopup from "./TenantPopup";
import AddTenant from "./AddTenant";
import Chat from "../../chatBot/Chat";
import api from "../../../../services/api";
import profilePhoto from "../../../../assets/img/DefaultProfilePhoto.webp";

const TenantPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTenants = async () => {
    try {
      const response = await api.get("/tenants");
      setTenants(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleTenantClick = (tenant) => {
    setSelectedTenant(tenant);
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesFilter =
      activeFilter === "all" || tenant.status === activeFilter;
    const matchesSearch =
      tenant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="tenant-page-container">
      <TopNavigation />
      <Sidebar />
      <Chat />
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
                className={`filter-btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "current" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("current")}
              >
                Current
              </button>
              <button
                className={`filter-btn ${
                  activeFilter === "late" ? "active" : ""
                }`}
                onClick={() => setActiveFilter("late")}
              >
                Late
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search Tenants"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14L11 11"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="view-toggles">
              <button
                className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                ≡
              </button>
              <button
                className={`view-toggle ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                ⊞
              </button>
            </div>
          </div>
        </div>

        <div className={`tenant-grid ${viewMode}`}>
          {filteredTenants.map((tenant) => (
            <div
              key={tenant.id}
              className={`tenant-card ${tenant.status || "current"}`}
              onClick={() => handleTenantClick(tenant)}
            >
              <img src={profilePhoto} className="tenant-avatar"></img>
              <div className="tenant-info">
                <h3>
                  {tenant.first_name} {tenant.last_name}
                </h3>
                <p className="tenant-title">{tenant.title || ""}</p>

                <div className="tenant-details">
                  <div className="detail-group">
                    <span className="label">Property</span>
                    <span className="value">
                      {tenant.property ? tenant.property.address : "N/A"}
                    </span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Monthly Rent</span>
                    <span className="value">
                      {tenant.lease && tenant.lease.rent_amount_monthly
                        ? `$${tenant.lease.rent_amount_monthly.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="detail-group">
                    <span className="label">Lease Ends</span>
                    <span className="value">
                      {tenant.lease && tenant.lease.end_date
                        ? new Date(tenant.lease.end_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  {/* You can add more details here as needed */}
                  <div className="detail-group">
                    <span className="label">Status</span>
                    <span className={`status-badge ${tenant.status}`}>
                      {tenant.status
                        ? tenant.status.charAt(0).toUpperCase() +
                          tenant.status.slice(1)
                        : "Current"}
                    </span>
                  </div>
                </div>

                <div className="contact-buttons">
                  {tenant.phone_number && (
                    <button
                      className="contact-btn phone"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle phone call
                        window.location.href = `tel:${tenant.phone_number}`;
                      }}
                    >
                      <span>Phone</span>
                    </button>
                  )}
                  {tenant.email && (
                    <button
                      className="contact-btn email"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle email
                        window.location.href = `mailto:${tenant.email}`;
                      }}
                    >
                      <span>Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {filteredTenants.length} of {tenants.length} tenants
          </div>
          {/* Implement pagination controls if needed */}
        </div>

        {/* Tenant Details Popup */}
        {selectedTenant && (
          <TenantPopup
            tenant={selectedTenant}
            onClose={() => setSelectedTenant(null)}
            fetchTenants={fetchTenants} // Add this prop
          />
        )}

        {/* Add Tenant Modal */}
        {showAddTenant && (
          <div
            className="modal-overlay"
            onClick={() => setShowAddTenant(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <AddTenant
                onClose={() => setShowAddTenant(false)}
                fetchTenants={fetchTenants}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPage;
