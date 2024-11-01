// src/components/messages/ExpensesTable.js

import React from "react";
import PropTypes from "prop-types";
import "./ExpenseTable.css";
import { ClipLoader } from "react-spinners";

const ExpensesTable = ({ expenses, loading }) => {
  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader color="#28a745" loading={loading} size={50} />
      </div>
    );
  }

  if (expenses.length === 0) {
    return <p>No expenses found for the selected property.</p>;
  }

  return (
    <div className="expenses-section">
      <h2>Expenses for Selected Property</h2>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date Incurred</th>
            <th>Category</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.description || "N/A"}</td>
              <td>{`$${expense.amount.toFixed(2)}`}</td>
              <td>{new Date(expense.date_incurred).toLocaleDateString()}</td>
              <td>{expense.category || "N/A"}</td>
              <td>
                {expense.receipt_url ? (
                  <a href={expense.receipt_url} target="_blank" rel="noopener noreferrer">
                    View Receipt
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string,
      amount: PropTypes.number.isRequired,
      date_incurred: PropTypes.string.isRequired,
      category: PropTypes.string,
      receipt_url: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default React.memo(ExpensesTable);
