import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../../../services/api";
import "./AddTransaction.css";

const AddTransaction = ({ onClose, fetchData }) => {
  const [formData, setFormData] = useState(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() + today.getTimezoneOffset());
    return {
      date: today.toISOString().split("T")[0],
      description: "",
      entity: "",
      amount: "",
      account: "",
      method: "",
      property_id: "",
      type: "expense",
    };
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        setProperties(response.data);
      } catch (err) {
        setError("Failed to fetch properties");
        console.error("Error fetching properties:", err);
      }
    };
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = formData.type === "expense" ? "/expenses" : "/incomes";
      const payload = {
        property_id: formData.property_id
          ? parseInt(formData.property_id)
          : null,
        amount: parseFloat(formData.amount),
        description: formData.description || null,
        category: formData.method || null,
        transaction_date: formData.date || null,
        entity: formData.entity || null,
        bank_account: formData.account || null,
        method: formData.method || null,
      };

      await api.post(endpoint, payload);
      fetchData();
      onClose();
    } catch (err) {
      setError("Failed to create transaction");
      console.error("Error creating transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal">
        <div className="transaction-modal-header">
          <h2>Add New Transaction</h2>
          <button className="transaction-close-button" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="transaction-form-group">
            <label>Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="transaction-select"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="transaction-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="transaction-input"
            />
          </div>

          <div className="transaction-form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="transaction-input"
              placeholder="Enter description"
            />
          </div>

          <div className="transaction-form-group">
            <label>Entity</label>
            <input
              type="text"
              name="entity"
              value={formData.entity}
              onChange={handleChange}
              className="transaction-input"
              placeholder="Enter entity name"
            />
          </div>

          <div className="transaction-form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="transaction-input"
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </div>

          <div className="transaction-form-group">
            <label>Bank Account</label>
            <select
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="transaction-select"
            >
              <option value="">Select account</option>
              <option value="Company savings">Company savings</option>
              <option value="Debit account">Debit account</option>
            </select>
          </div>

          <div className="transaction-form-group">
            <label>Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="transaction-select"
            >
              <option value="">Select method</option>
              <option value="Card">Card</option>
              <option value="Payment savings">Payment savings</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="transaction-form-group">
            <label>Property</label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              className="transaction-select"
              required
            >
              <option value="">Select property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="transaction-error">{error}</div>}

          <div className="transaction-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="transaction-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="transaction-submit-button"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
