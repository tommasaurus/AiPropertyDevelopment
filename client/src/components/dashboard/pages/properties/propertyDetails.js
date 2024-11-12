// src/components/properties/PropertyDetails.js

import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import './propertyDetails.css';

const PropertyDetails = ({ property, onClose }) => {
  const [activeTab, setActiveTab] = useState('tenants');
  const [contracts, setContracts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
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
          api.get('/contracts'),
          api.get('/documents'),
          api.get('/expenses'),
          api.get('/incomes'),
          api.get('/invoices'),
          api.get('/leases'),
          api.get('/payments'),
          api.get('/tenants'),
          api.get('/vendors'),
        ]);

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
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Helper functions
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPropertyAge = () => {
    if (!property.purchase_date) return 'N/A';

    const purchaseDate = new Date(property.purchase_date);
    const today = new Date();

    const years = today.getFullYear() - purchaseDate.getFullYear();
    const months = today.getMonth() - purchaseDate.getMonth();

    if (months < 0) {
      return `${years - 1} years, ${months + 12} months`;
    }

    if (years === 0) {
      return `${months} months`;
    }

    return `${years} years, ${months} months`;
  };

  // Filter data for current property
  const propertyContracts = contracts.filter((c) => c.property_id === property.id);
  const propertyDocuments = documents.filter((d) => d.property_id === property.id);
  const propertyExpenses = expenses.filter((e) => e.property_id === property.id);
  const propertyIncomes = incomes.filter((i) => i.property_id === property.id);
  const propertyInvoices = invoices.filter((i) => i.property_id === property.id);
  const propertyLeases = leases.filter((l) => l.property_id === property.id);
  const propertyPayments = payments.filter((p) => p.property_id === property.id);

  const currentTenantIds = propertyLeases
    .filter((lease) => lease.is_active)
    .map((lease) => lease.tenant_id);
  const propertyTenants = tenants.filter((t) => currentTenantIds.includes(t.id));

  return (
    <div className="property-modal">
      <div className="property-modal-content">
        <div className="modal-header">
          <h2>{property.address}</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Property Overview */}
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Property Details</h3>
              <dl>
                <dt>Type</dt>
                <dd>{property.property_type || 'N/A'}</dd>
                <dt>Purchase Price</dt>
                <dd>{formatCurrency(property.purchase_price)}</dd>
                <dt>Owned For</dt>
                <dd>{getPropertyAge()}</dd>
              </dl>
            </div>

            <div className="overview-card">
              <h3>Structure</h3>
              <dl>
                <dt>Bedrooms</dt>
                <dd>{property.num_bedrooms || 'N/A'}</dd>
                <dt>Bathrooms</dt>
                <dd>{property.num_bathrooms || 'N/A'}</dd>
                <dt>Floors</dt>
                <dd>{property.num_floors || 'N/A'}</dd>
              </dl>
            </div>

            <div className="overview-card">
              <h3>Fees & Status</h3>
              <dl>
                <dt>Property Type</dt>
                <dd>{property.is_commercial ? 'Commercial' : 'Residential'}</dd>
                <dt>HOA</dt>
                <dd>{property.is_hoa ? 'Yes' : 'No'}</dd>
                <dt>HOA Fee</dt>
                <dd>{formatCurrency(property.hoa_fee)}</dd>
              </dl>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <div className="tabs-list">
              {['tenants', 'leases', 'finances', 'documents', 'contracts'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'tenants' && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyTenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{`${tenant.first_name} ${tenant.last_name}`}</td>
                      <td>{tenant.email}</td>
                      <td>{tenant.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'leases' && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Monthly Rent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyLeases.map((lease) => (
                    <tr key={lease.id}>
                      <td>{lease.lease_type}</td>
                      <td>{formatDate(lease.start_date)}</td>
                      <td>{formatDate(lease.end_date)}</td>
                      <td>{formatCurrency(lease.rent_amount_monthly)}</td>
                      <td>
                        <span
                          className={`status-badge ${lease.is_active ? 'active' : 'inactive'}`}
                        >
                          {lease.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'finances' && (
              <>
                <h3>Income</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyIncomes.map((income) => (
                      <tr key={income.id}>
                        <td>{formatDate(income.date_received)}</td>
                        <td>{formatCurrency(income.amount)}</td>
                        <td>{income.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3>Expenses</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.date_incurred)}</td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'documents' && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Upload Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.document_type}</td>
                      <td>{formatDate(doc.upload_date)}</td>
                      <td>{doc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'contracts' && (
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {propertyContracts.map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.contract_type}</td>
                      <td>{formatDate(contract.start_date)}</td>
                      <td>{formatDate(contract.end_date)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            contract.is_active ? 'active' : 'inactive'
                          }`}
                        >
                          {contract.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
