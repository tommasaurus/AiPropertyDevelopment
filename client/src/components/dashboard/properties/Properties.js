// src/components/properties/Properties.js

import React, { useEffect, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import SearchBar from "../searchBar/SearchBar";
import PropertyDetails from "./propertyDetails";
import UploadDocument from "./UploadDocument";
import AddProperty from "./AddProperty";
import "./Properties.css";

const Properties = () => {
  // State variables for properties and related data
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);

  // State variables for UI handling
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper functions for formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  // Fetch all data
  const fetchAllData = async () => {
    try {
      const responses = await Promise.all([
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

      setProperties(responses[0].data);
      setContracts(responses[1].data);
      setDocuments(responses[2].data);
      setExpenses(responses[3].data);
      setIncomes(responses[4].data);
      setInvoices(responses[5].data);
      setLeases(responses[6].data);
      setPayments(responses[7].data);
      setTenants(responses[8].data);
      setVendors(responses[9].data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle property row click
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />
      <main className="dashboard-main">
        <div className="art-nouveau-border">
          <div className="art-nouveau-corner top-left" />
          <div className="art-nouveau-corner top-right" />
          <div className="art-nouveau-corner bottom-left" />
          <div className="art-nouveau-corner bottom-right" />

          <SearchBar />

          <div className="nouveau-content-section">
            <div className="header-content">
              <div className="header-title-wrapper">
                <h1 className="nouveau-title">Properties</h1>
                <div className="title-underline">
                  <div className="underline-ornament left" />
                  <div className="underline-ornament right" />
                </div>
              </div>
              <div className="header-actions">
                <button
                  className="nouveau-button primary-gradient"
                  onClick={() => setShowAddPropertyModal(true)}
                >
                  <div className="button-ornament left" />
                  <div className="button-content">
                    <PlusCircle className="button-icon" />
                    <span>Add Property</span>
                  </div>
                  <div className="button-ornament right" />
                </button>
                <button
                  className="nouveau-button secondary-gradient"
                  onClick={() => setShowUploadModal(true)}
                >
                  <div className="button-ornament left" />
                  <div className="button-content">
                    <Upload className="button-icon" />
                    <span>Upload Document</span>
                  </div>
                  <div className="button-ornament right" />
                </button>
              </div>
            </div>

            <div className="properties-table-container">
              <div className="table-background-pattern" />
              <div className="table-ornament top-left" />
              <div className="table-ornament top-right" />
              <div className="table-ornament bottom-left" />
              <div className="table-ornament bottom-right" />

              <table className="properties-table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Property Type</th>
                    <th>Bedrooms</th>
                    <th>Bathrooms</th>
                    <th>Floors</th>
                    <th>Commercial</th>
                    <th>HOA</th>
                    <th>HOA Fee</th>
                    <th>Purchase Price</th>
                    <th>Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      onClick={() => handlePropertyClick(property)}
                      className="property-row"
                    >
                      <td>{property.address}</td>
                      <td>{property.property_type || "N/A"}</td>
                      <td>{property.num_bedrooms || "N/A"}</td>
                      <td>{property.num_bathrooms || "N/A"}</td>
                      <td>{property.num_floors || "N/A"}</td>
                      <td>{property.is_commercial ? "Yes" : "No"}</td>
                      <td>{property.is_hoa ? "Yes" : "No"}</td>
                      <td>
                        {property.hoa_fee ? formatCurrency(property.hoa_fee) : "N/A"}
                      </td>
                      <td>{formatCurrency(property.purchase_price)}</td>
                      <td>{formatDate(property.purchase_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Property Details Modal */}
          {selectedProperty && (
            <PropertyDetails
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
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

          {/* Add Property Modal */}
          {showAddPropertyModal && (
            <AddProperty
              onClose={() => setShowAddPropertyModal(false)}
              fetchAllData={fetchAllData}
            />
          )}

          {/* Upload Document Modal */}
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
