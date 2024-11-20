// src/components/dashboard/properties/Properties.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusCircle, Upload, Search } from "lucide-react";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import api from "../../../../services/api";
import PropertyDetails from "./propertyDetails";
import UploadDocument from "./UploadDocument";
import AddProperty from "./AddProperty";
import Chat from "../../chatBot/Chat";
import Map from "../../Map/Map";
import "./Properties.css";

const Properties = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Add states for all related data
  const [contracts, setContracts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePropertyDelete = async (propertyId) => {
    console.log("Starting deletion process for property:", propertyId);

    try {
      const response = await api.delete(`/properties/${propertyId}`);
      console.log("Delete response:", response);

      // Update local state
      setProperties(properties.filter((p) => p.id !== propertyId));
      setSelectedProperty(null);

      toast.success(response.data.message || "Property successfully deleted", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refetch data
      await fetchAllData();
      return true;
    } catch (error) {
      console.error("Delete error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      toast.error(error.response?.data?.detail || "Failed to delete property", {
        position: "top-right",
        autoClose: 5000,
      });

      throw error;
    }
  };

  // Check for pending actions on mount
  useEffect(() => {
    const pendingAction = sessionStorage.getItem("pendingAction");
    if (pendingAction) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        if (pendingAction === "addProperty") {
          setShowAddPropertyModal(true);
        } else if (pendingAction === "uploadDocument") {
          setShowUploadModal(true);
        }
        // Clear the pending action
        sessionStorage.removeItem("pendingAction");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [
        propertiesRes,
        contractsRes,
        documentsRes,
        expensesRes,
        incomesRes,
        invoicesRes,
        leasesRes,
        paymentsRes,
        tenantsRes,
        vendorsRes,
      ] = await Promise.all([
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

      setProperties(propertiesRes.data);
      setContracts(contractsRes.data);
      setDocuments(documentsRes.data);
      setExpenses(expensesRes.data);
      setIncomes(incomesRes.data);
      setInvoices(invoicesRes.data);
      setLeases(leasesRes.data);
      setPayments(paymentsRes.data);
      setTenants(tenantsRes.data);
      setVendors(vendorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="loading-spinner">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TopNavigation />
      <Chat />
      <main className="dashboard-main">
        <div className="properties-container">
          <div className="properties-header">
            <div className="header-left">
              <h1 className="properties-title">Properties</h1>
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="header-actions">
              <button
                className="nouveau-button primary"
                onClick={() => setShowAddPropertyModal(true)}
              >
                <PlusCircle className="button-icon" />
                Add Property
              </button>
              <button
                className="nouveau-button secondary"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="button-icon" />
                Upload Document
              </button>
            </div>
          </div>

          <div className="properties-grid">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="property-card"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="property-card-header">
                  <div className="property-type-badge">
                    {property.property_type || "Residential"}
                  </div>
                  <div className="property-status">
                    {property.is_commercial ? "Commercial" : "Residential"}
                  </div>
                </div>
                <div className="property-card-content">
                  <h3 className="property-address">{property.address}</h3>
                  <div className="property-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Bedrooms</span>
                      <span className="detail-value">
                        {property.num_bedrooms || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Bathrooms</span>
                      <span className="detail-value">
                        {property.num_bathrooms || "N/A"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Purchase Price</span>
                      <span className="detail-value">
                        {formatCurrency(property.purchase_price)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">HOA Fee</span>
                      <span className="detail-value">
                        {property.is_hoa
                          ? formatCurrency(property.hoa_fee)
                          : "No HOA"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="property-card-footer">
                  <span className="purchase-date">
                    Purchased: {formatDate(property.purchase_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Map section */}
          {filteredProperties.length > 0 && (
            <div className="dashboard-map-container">
              <Map />
            </div>
          )}

          {/* Error Message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {/* Modals */}
          {selectedProperty && (
            <PropertyDetails
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
              onDelete={handlePropertyDelete}
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

          {showAddPropertyModal && (
            <AddProperty
              onClose={() => setShowAddPropertyModal(false)}
              fetchAllData={fetchAllData}
            />
          )}

          {showUploadModal && (
            <UploadDocument
              properties={properties}
              onClose={() => setShowUploadModal(false)}
              fetchAllData={fetchAllData}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Properties;
