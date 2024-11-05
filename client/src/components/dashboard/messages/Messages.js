// src/components/messages/Messages.js

import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import dwellexLogo from "../../../images/dwellexLogo.png";
import api from "../../../services/api";
import ExpensesTable from "./ExpenseTable"; 
import Greeting from "../greeting/Greeting";
import Chat from "./Chat";
import "./Messages.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Messages = () => {
  // State variables for properties
  const [properties, setProperties] = useState([]);

  // State variables for UI and form handling  ;
  const [selectedProperty, setSelectedProperty] = useState("");  
  const [errorMessage, setErrorMessage] = useState("");

  // State variables for expenses
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expensesError, setExpensesError] = useState("");

  const businessName = "Jason";

  // Helper functions for formatting
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties.");
      setErrorMessage("Failed to fetch properties.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Handler to fetch expenses
  const handleGetExpenses = async () => {
    if (!selectedProperty) {
      toast.error("Please select a property first.");
      setExpensesError("Please select a property first.");
      return;
    }

    setLoadingExpenses(true);
    setExpensesError("");
    setExpenses([]);

    try {
      const response = await api.get(`/properties/${selectedProperty}/expenses`);
      if (response.data.length === 0) {
        toast.info("No expenses found for the selected property.");
        setExpensesError("No expenses found for the selected property.");
      } else {
        setExpenses(response.data);
        toast.success("Expenses fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses.");
      setExpensesError("Failed to fetch expenses.");
    } finally {
      setLoadingExpenses(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
        {/* Greeting Section */}
        <Greeting/>

        {/* Property Selection Dropdown */}
        <div className="property-selection">
          <h2>Select Property</h2>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="property-dropdown"
            aria-label="Select a property"
          >
            <option value="" disabled>
              Select a property
            </option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.address}
              </option>
            ))}
          </select>
        </div>

        {/* Get Expenses Button */}
        <div className="get-expenses-button">
          <button
            onClick={handleGetExpenses}
            className="expenses-button"
            disabled={loadingExpenses}
            aria-label="Get Expenses"
          >
            {loadingExpenses ? "Fetching Expenses..." : "Get Expenses"}
          </button>
        </div>

        {/* Loading Spinner */}
        {loadingExpenses && (
          <div className="spinner-container">
            <ClipLoader color="#28a745" loading={loadingExpenses} size={50} />
          </div>
        )}

        {/* Expenses Display */}
        {expenses.length > 0 && <ExpensesTable expenses={expenses} />}

        {/* Chat Component */}
        <Chat />

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </main>
    </div>
  );
};

export default Messages;
