// src/components/properties/AllDataTables.js

import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./AllDataTables.css";

const AllDataTables = () => {
  // State variables for each table
  const [contracts, setContracts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [invoices, setInvoices] = useState([]);  
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  // const [propertyDetails, setPropertyDetails] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [vendors, setVendors] = useState([]);

  // State for error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch functions for each table
  const fetchContracts = async () => {
    try {
      const response = await api.get("/contracts");
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setErrorMessage("Failed to fetch contracts.");
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setErrorMessage("Failed to fetch documents.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setErrorMessage("Failed to fetch expenses.");
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await api.get("/incomes");
      setIncomes(response.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setErrorMessage("Failed to fetch incomes.");
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setErrorMessage("Failed to fetch invoices.");
    }
  };

  const fetchLeases = async () => {
    try {
      const response = await api.get("/leases");
      setLeases(response.data);
    } catch (error) {
      console.error("Error fetching leases:", error);
      setErrorMessage("Failed to fetch leases.");
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setErrorMessage("Failed to fetch payments.");
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setErrorMessage("Failed to fetch properties.");
    }
  };

  // const fetchPropertyDetails = async () => {
  //   try {
  //     const response = await api.get("/property_details");
  //     setPropertyDetails(response.data);
  //   } catch (error) {
  //     console.error("Error fetching property details:", error);
  //     setErrorMessage("Failed to fetch property details.");
  //   }
  // };

  const fetchTenants = async () => {
    try {
      const response = await api.get("/tenants");
      setTenants(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setErrorMessage("Failed to fetch tenants.");
    }
  };

  const fetchUtilities = async () => {
    try {
      const response = await api.get("/utilities");
      setUtilities(response.data);
    } catch (error) {
      console.error("Error fetching utilities:", error);
      setErrorMessage("Failed to fetch utilities.");
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setErrorMessage("Failed to fetch vendors.");
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchContracts();
    fetchDocuments();
    fetchExpenses();
    fetchIncomes();
    // fetchInvoiceItems();
    fetchInvoices();
    fetchLeases();
    fetchPayments();
    fetchProperties();
    // fetchPropertyDetails();
    fetchTenants();
    fetchUtilities();
    fetchVendors();
  }, []);

  // Helper functions for formatting
  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatJSON = (data) => {
    return data ? JSON.stringify(data, null, 2) : "N/A";
  };

  return (
    <div className="all-data-tables">
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Contracts Table */}
      <section>
        <h2>Contracts</h2>
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Vendor ID</th>
                <th>Contract Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Terms</th>
                <th>Document URL</th>
                <th>Is Active</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.id}</td>
                  <td>{contract.property_id}</td>
                  <td>{contract.vendor_id || "N/A"}</td>
                  <td>{contract.contract_type || "N/A"}</td>
                  <td>{formatDate(contract.start_date)}</td>
                  <td>{formatDate(contract.end_date)}</td>
                  <td>{contract.terms || "N/A"}</td>
                  <td>
                    {contract.document_url ? (
                      <a href={contract.document_url} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{contract.is_active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No contracts available.</p>
        )}
      </section>

      {/* Documents Table */}
      <section>
        <h2>Documents</h2>
        {documents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Tenant ID</th>
                <th>Lease ID</th>
                <th>Expense ID</th>
                <th>Invoice ID</th>
                <th>Contract ID</th>
                <th>Document Type</th>
                <th>Upload Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.property_id}</td>
                  <td>{doc.tenant_id || "N/A"}</td>
                  <td>{doc.lease_id || "N/A"}</td>
                  <td>{doc.expense_id || "N/A"}</td>
                  <td>{doc.invoice_id || "N/A"}</td>
                  <td>{doc.contract_id || "N/A"}</td>
                  <td>{doc.document_type || "N/A"}</td>
                  <td>{formatDate(doc.upload_date)}</td>
                  <td>{doc.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No documents available.</p>
        )}
      </section>

      {/* Expenses Table */}
      <section>
        <h2>Expenses</h2>
        {expenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Vendor ID</th>
                <th>Invoice ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date Incurred</th>
                <th>Description</th>
                <th>Receipt URL</th>
                <th>Is Recurring</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.property_id}</td>
                  <td>{expense.vendor_id || "N/A"}</td>
                  <td>{expense.invoice_id || "N/A"}</td>
                  <td>{expense.category || "N/A"}</td>
                  <td>{formatCurrency(expense.amount)}</td>
                  <td>{formatDate(expense.date_incurred)}</td>
                  <td>{expense.description || "N/A"}</td>
                  <td>
                    {expense.receipt_url ? (
                      <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                        View Receipt
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{expense.is_recurring ? "Yes" : "No"}</td>
                  <td>{expense.frequency || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No expenses available.</p>
        )}
      </section>

      {/* Incomes Table */}
      <section>
        <h2>Incomes</h2>
        {incomes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date Received</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id}>
                  <td>{income.id}</td>
                  <td>{income.property_id}</td>
                  <td>{income.category || "N/A"}</td>
                  <td>{formatCurrency(income.amount)}</td>
                  <td>{formatDate(income.date_received)}</td>
                  <td>{income.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No incomes available.</p>
        )}
      </section>

      {/* Invoice Items Table */}
      {/* <section>
        <h2>Invoice Items</h2>
        {invoiceItems.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.invoice_id}</td>
                  <td>{item.description || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unit_price)}</td>
                  <td>{formatCurrency(item.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoice items available.</p>
        )}
      </section> */}

      {/* Invoices Table */}
      <section>
        <h2>Invoices</h2>
        {invoices.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Vendor ID</th>
                <th>Invoice Number</th>
                <th>Amount</th>
                <th>Paid Amount</th>
                <th>Remaining Balance</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.property_id}</td>
                  <td>{invoice.vendor_id || "N/A"}</td>
                  <td>{invoice.invoice_number || "N/A"}</td>
                  <td>{formatCurrency(invoice.amount)}</td>
                  <td>{formatCurrency(invoice.paid_amount)}</td>
                  <td>{formatCurrency(invoice.remaining_balance)}</td>
                  <td>{formatDate(invoice.invoice_date)}</td>
                  <td>{formatDate(invoice.due_date)}</td>
                  <td>{invoice.status || "N/A"}</td>
                  <td>{invoice.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices available.</p>
        )}
      </section>

      {/* Leases Table */}
      <section>
        <h2>Leases</h2>
        {leases.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Lease Type</th>
                <th>Rent Amount Total</th>
                <th>Rent Amount Monthly</th>
                <th>Security Deposit Amount</th>
                <th>Security Deposit Held By</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Payment Frequency</th>
                <th>Tenant Info</th>
                <th>Special Lease Terms</th>
                <th>Is Active</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((lease) => (
                <tr key={lease.id}>
                  <td>{lease.id}</td>
                  <td>{lease.property_id}</td>
                  <td>{lease.lease_type || "N/A"}</td>
                  <td>{formatCurrency(lease.rent_amount_total)}</td>
                  <td>{formatCurrency(lease.rent_amount_monthly)}</td>
                  <td>{lease.security_deposit_amount || "N/A"}</td>
                  <td>{lease.security_deposit_held_by || "N/A"}</td>
                  <td>{formatDate(lease.start_date)}</td>
                  <td>{formatDate(lease.end_date)}</td>
                  <td>{lease.payment_frequency || "N/A"}</td>
                  <td>{formatJSON(lease.tenant_info)}</td>
                  <td>{formatJSON(lease.special_lease_terms)}</td>
                  <td>{lease.is_active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leases available.</p>
        )}
      </section>

      {/* Payments Table */}
      <section>
        <h2>Payments</h2>
        {payments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.property_id}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.method || "N/A"}</td>
                  <td>{payment.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments available.</p>
        )}
      </section>

      {/* Property Details Table */}
      {/* <section>
        <h2>Property Details</h2>
        {propertyDetails.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Year Built</th>
                <th>Square Footage</th>
                <th>Lot Size</th>
                <th>Zoning</th>
                <th>Tax Assessed Value</th>
                <th>Insurance Policy Number</th>
                <th>HOA Name</th>
                <th>HOA Contact</th>
                <th>HOA Phone</th>
                <th>HOA Email</th>
                <th>HOA Website</th>
              </tr>
            </thead>
            <tbody>
              {propertyDetails.map((detail) => (
                <tr key={detail.id}>
                  <td>{detail.id}</td>
                  <td>{detail.property_id}</td>
                  <td>{detail.year_built || "N/A"}</td>
                  <td>{detail.square_footage || "N/A"}</td>
                  <td>{detail.lot_size || "N/A"}</td>
                  <td>{detail.zoning || "N/A"}</td>
                  <td>{formatCurrency(detail.tax_assessed_value)}</td>
                  <td>{detail.insurance_policy_number || "N/A"}</td>
                  <td>{detail.hoa_name || "N/A"}</td>
                  <td>{detail.hoa_contact || "N/A"}</td>
                  <td>{detail.hoa_phone || "N/A"}</td>
                  <td>{detail.hoa_email || "N/A"}</td>
                  <td>
                    {detail.hoa_website ? (
                      <a href={detail.hoa_website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No property details available.</p>
        )}
      </section> */}

      {/* Tenants Table */}
      <section>
        <h2>Tenants</h2>
        {tenants.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Landlord</th>
                <th>Email</th>
                <th>Phone</th>                
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>{tenant.id}</td>
                  <td>{tenant.first_name || "N/A"}</td>
                  <td>{tenant.last_name || "N/A"}</td>
                  <td>{tenant.landlord || "N/A"}</td>
                  <td>{tenant.email || "N/A"}</td>
                  <td>{tenant.phone || "N/A"}</td>                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tenants available.</p>
        )}
      </section>

      {/* Utilities Table */}
      <section>
        <h2>Utilities</h2>
        {utilities.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Property ID</th>
                <th>Utility Type</th>
                <th>Provider</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {utilities.map((utility) => (
                <tr key={utility.id}>
                  <td>{utility.id}</td>
                  <td>{utility.property_id}</td>
                  <td>{utility.utility_type || "N/A"}</td>
                  <td>{utility.provider || "N/A"}</td>
                  <td>{formatCurrency(utility.amount)}</td>
                  <td>{formatDate(utility.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No utilities available.</p>
        )}
      </section>

      {/* Vendors Table */}
      <section>
        <h2>Vendors</h2>
        {vendors.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service Type</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.id}</td>
                  <td>{vendor.name || "N/A"}</td>
                  <td>{vendor.email || "N/A"}</td>
                  <td>{vendor.phone || "N/A"}</td>
                  <td>{vendor.service_type || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vendors available.</p>
        )}
      </section>
    </div>
  );
};

export default AllDataTables;
