import React, { useState } from "react";
import "./FinancialLedger.css";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";

const FinancialLedger = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const summaryData = {
    sent: {
      amount: "$36,500.50",
      label: "Sent",
      subtext: "12 invoice",
    },
    overdue: {
      amount: "$12,500.50",
      label: "Overdue",
      subtext: "12 invoice",
    },
    paid: {
      amount: "$24,500.50",
      label: "Paid",
      subtext: "12 invoice",
    },
    score: {
      label: "Payment score",
      value: "Good",
      subtext: "Seamless payments, right on schedule",
    },
  };

  const transactions = [
    {
      id: 1,
      date: "Mar 16",
      description: "Github",
      amount: -2450.5,
      account: "Company savings",
      method: "Other",
      entity: "Github Inc.",
    },
    {
      id: 2,
      date: "Mar 15",
      description: "H23504959",
      amount: 16799.0,
      account: "Company savings",
      method: "Payment savings",
      entity: "Client XYZ Corp",
    },
    {
      id: 3,
      date: "Mar 14",
      description: "Figma",
      amount: -199.5,
      account: "Debit account",
      method: "Card",
      entity: "Figma Ltd",
    },
    {
      id: 1,
      date: "Mar 16",
      description: "Github",
      amount: -2450.5,
      account: "Company savings",
      method: "Other",
      entity: "Github Inc.",
    },
    {
      id: 2,
      date: "Mar 15",
      description: "H23504959",
      amount: 16799.0,
      account: "Company savings",
      method: "Payment savings",
      entity: "Client XYZ Corp",
    },
    {
      id: 3,
      date: "Mar 14",
      description: "Figma",
      amount: -199.5,
      account: "Debit account",
      method: "Card",
      entity: "Figma Ltd",
    },
    {
      id: 1,
      date: "Mar 16",
      description: "Github",
      amount: -2450.5,
      account: "Company savings",
      method: "Other",
      entity: "Github Inc.",
    },
    {
      id: 2,
      date: "Mar 15",
      description: "H23504959",
      amount: 16799.0,
      account: "Company savings",
      method: "Payment savings",
      entity: "Client XYZ Corp",
    },
    {
      id: 3,
      date: "Mar 14",
      description: "Figma",
      amount: -199.5,
      account: "Debit account",
      method: "Card",
      entity: "Figma Ltd",
    },
    {
      id: 1,
      date: "Mar 16",
      description: "Github",
      amount: -2450.5,
      account: "Company savings",
      method: "Other",
      entity: "Github Inc.",
    },
    {
      id: 2,
      date: "Mar 15",
      description: "H23504959",
      amount: 16799.0,
      account: "Company savings",
      method: "Payment savings",
      entity: "Client XYZ Corp",
    },
    {
      id: 3,
      date: "Mar 14",
      description: "Figma",
      amount: -199.5,
      account: "Debit account",
      method: "Card",
      entity: "Figma Ltd",
    },
  ];

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="ledger-container">
      <Sidebar />
      <TopNavigation />

      <div className="ledger-summary-boxes">
        <div className="ledger-summary-box">
          <div className="ledger-summary-amount">{summaryData.sent.amount}</div>
          <div className="ledger-summary-label">{summaryData.sent.label}</div>
          <div className="ledger-summary-subtext">
            {summaryData.sent.subtext}
          </div>
        </div>
        <div className="ledger-summary-box">
          <div className="ledger-summary-amount">
            {summaryData.overdue.amount}
          </div>
          <div className="ledger-summary-label">
            {summaryData.overdue.label}
          </div>
          <div className="ledger-summary-subtext">
            {summaryData.overdue.subtext}
          </div>
        </div>
        <div className="ledger-summary-box">
          <div className="ledger-summary-amount">{summaryData.paid.amount}</div>
          <div className="ledger-summary-label">{summaryData.paid.label}</div>
          <div className="ledger-summary-subtext">
            {summaryData.paid.subtext}
          </div>
        </div>
        <div className="ledger-summary-box ledger-score-box">
          <div className="ledger-summary-score">{summaryData.score.value}</div>
          <div className="ledger-summary-label">{summaryData.score.label}</div>
          <div className="ledger-summary-subtext">
            {summaryData.score.subtext}
          </div>
          <div className="ledger-score-bars">
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
            <div className="ledger-score-bar"></div>
          </div>
        </div>
      </div>

      <div className="ledger-table-section">
        <div className="ledger-search-filter-bar">
          <div className="ledger-search-container">
            <input
              type="text"
              className="ledger-search-bar"
              placeholder="Search or filter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="ledger-add-button">+ Add Transaction</button>
        </div>

        <table className="ledger-transactions-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="ledger-checkbox" />
              </th>
              <th>Date</th>
              <th>Description</th>
              <th>Entity</th>
              <th>Amount</th>
              <th>Bank account</th>
              <th>Method</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={
                  selectedRows.includes(transaction.id) ? "ledger-selected" : ""
                }
                data-positive={transaction.amount > 0}
              >
                <td>
                  <input
                    type="checkbox"
                    className="ledger-checkbox"
                    checked={selectedRows.includes(transaction.id)}
                    onChange={() => handleRowSelect(transaction.id)}
                  />
                </td>
                <td>{transaction.date}</td>
                <td className="ledger-description">
                  {transaction.description}
                </td>
                <td className="ledger-entity">{transaction.entity}</td>
                <td
                  className={`ledger-amount ${
                    transaction.amount > 0
                      ? "ledger-positive"
                      : "ledger-negative"
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>{transaction.account}</td>
                <td>{transaction.method}</td>
                <td>
                  <button className="ledger-more-options">⋯</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialLedger;
