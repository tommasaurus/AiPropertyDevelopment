import React, { useState } from "react";
import "./TenantPopup.css";
import profilePhoto from "../../../../assets/img/DefaultProfilePhoto.webp";

const TenantPopup = ({ tenant, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");

  // Sample financial data - replace with actual data
  const financialData = {
    payments: [
      { id: 1, date: "2024-03-01", amount: 2500, status: "Paid", type: "Rent" },
      { id: 2, date: "2024-02-01", amount: 2500, status: "Paid", type: "Rent" },
      { id: 3, date: "2024-01-01", amount: 2500, status: "Paid", type: "Rent" },
      {
        id: 4,
        date: "2023-12-01",
        amount: 300,
        status: "Paid",
        type: "Utility",
      },
    ],
    expenses: [
      {
        id: 1,
        date: "2024-02-15",
        amount: 200,
        category: "Maintenance",
        description: "Plumbing repair",
      },
      {
        id: 2,
        date: "2024-01-20",
        amount: 150,
        category: "Utility",
        description: "Electricity bill",
      },
      {
        id: 3,
        date: "2024-01-10",
        amount: 300,
        category: "Repairs",
        description: "Window replacement",
      },
    ],
  };

  return (
    <div className='tenant-popup-overlay' onClick={onClose}>
      <div
        className='tenant-popup-content'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='close-btn' onClick={onClose}>
          ×
        </button>

        <div className='tenant-popup-header'>
          <img
            src={profilePhoto}
            className='tenant-popup-avatar'
            alt='Tenant Profile'
          />
          <div className='tenant-popup-title'>
            <h2>
              {tenant.first_name} {tenant.last_name}
            </h2>
            <p>{tenant.title || "Tenant"}</p>
          </div>
        </div>

        <div className='popup-tabs'>
          <button
            className={`popup-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Information
          </button>
          <button
            className={`popup-tab ${
              activeTab === "financials" ? "active" : ""
            }`}
            onClick={() => setActiveTab("financials")}
          >
            Financials
          </button>
        </div>

        {activeTab === "info" ? (
          <div className='tenant-popup-sections'>
            <div className='popup-section'>
              <h3>Lease Information</h3>
              <div className='popup-grid'>
                <div className='popup-detail'>
                  <span className='popup-label'>Property</span>
                  <span className='popup-value'>
                    {tenant.property ? tenant.property.address : "N/A"}
                  </span>
                </div>
                <div className='popup-detail'>
                  <span className='popup-label'>Monthly Rent</span>
                  <span className='popup-value'>
                    {tenant.lease && tenant.lease.rent_amount_monthly
                      ? `$${tenant.lease.rent_amount_monthly}`
                      : "N/A"}
                  </span>
                </div>
                <div className='popup-detail'>
                  <span className='popup-label'>Lease End Date</span>
                  <span className='popup-value'>
                    {tenant.lease && tenant.lease.end_date
                      ? new Date(tenant.lease.end_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className='popup-detail'>
                  <span className='popup-label'>Status</span>
                  <span className={`status-pill ${tenant.status || "current"}`}>
                    {tenant.status
                      ? tenant.status.charAt(0).toUpperCase() +
                        tenant.status.slice(1)
                      : "Current"}
                  </span>
                </div>
              </div>
            </div>

            <div className='popup-section'>
              <h3>Contact Information</h3>
              <div className='popup-grid'>
                <div className='popup-detail'>
                  <span className='popup-label'>Email</span>
                  <span className='popup-value'>{tenant.email || "N/A"}</span>
                </div>
                <div className='popup-detail'>
                  <span className='popup-label'>Phone</span>
                  <span className='popup-value'>
                    {tenant.phone_number || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className='popup-section'>
              <h3>Actions</h3>
              <div className='popup-actions'>
                <button className='popup-action-btn edit'>Edit Tenant</button>
                <button className='popup-action-btn message'>
                  Send Message
                </button>
                <button className='popup-action-btn delete'>
                  Remove Tenant
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='tenant-popup-sections'>
            <div className='popup-section'>
              <div className='section-header'>
                <h3>Payment History</h3>
                <button className='add-payment-btn'>+ Add Payment</button>
              </div>
              <div className='financial-table'>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                        <td>{payment.type}</td>
                        <td>${payment.amount}</td>
                        <td>
                          <span
                            className={`status-pill ${payment.status.toLowerCase()}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='popup-section'>
              <div className='section-header'>
                <h3>Expenses</h3>
                <button className='add-expense-btn'>+ Add Expense</button>
              </div>
              <div className='financial-table'>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.category}</td>
                        <td>{expense.description}</td>
                        <td>${expense.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className='popup-section'>
              <h3>Financial Summary</h3>
              <div className='financial-summary'>
                <div className='summary-item'>
                  <span className='summary-label'>Total Payments</span>
                  <span className='summary-value'>
                    $
                    {financialData.payments.reduce(
                      (sum, payment) => sum + payment.amount,
                      0
                    )}
                  </span>
                </div>
                <div className='summary-item'>
                  <span className='summary-label'>Total Expenses</span>
                  <span className='summary-value'>
                    $
                    {financialData.expenses.reduce(
                      (sum, expense) => sum + expense.amount,
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPopup;
