import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import SearchBar from "../searchBar/SearchBar";
import dwellexLogo from "../../../assets/img/dwellexLogo.png";
import api from "../../../services/api";
import ExpensesTable from "./ExpenseTable"; 
import Chat from "./Chat";
import "./Messages.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Messages = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");  
  const [errorMessage, setErrorMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expensesError, setExpensesError] = useState("");

  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  // const fetchProperties = async () => {
  //   try {
  //     const response = await api.get("/properties");
  //     setProperties(response.data);
  //   } catch (error) {
  //     console.error("Error fetching properties:", error);
  //     toast.error("Failed to fetch properties.");
  //     setErrorMessage("Failed to fetch properties.");
  //   }
  // };

  // useEffect(() => {
  //   fetchProperties();
  // }, []);

  // const handleGetExpenses = async () => {
  //   if (!selectedProperty) {
  //     toast.error("Please select a property first.");
  //     setExpensesError("Please select a property first.");
  //     return;
  //   }

  //   setLoadingExpenses(true);
  //   setExpensesError("");
  //   setExpenses([]);

  //   try {
  //     const response = await api.get(`/properties/${selectedProperty}/expenses`);
  //     if (response.data.length === 0) {
  //       toast.info("No expenses found for the selected property.");
  //       setExpensesError("No expenses found for the selected property.");
  //     } else {
  //       setExpenses(response.data);
  //       toast.success("Expenses fetched successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching expenses:", error);
  //     toast.error("Failed to fetch expenses.");
  //     setExpensesError("Failed to fetch expenses.");
  //   } finally {
  //     setLoadingExpenses(false);
  //   }
  // };

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
            {/* <div className="property-selection">
              <h2>Messages & Expenses</h2>
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

            <div className="get-expenses-button">
              <button
                onClick={handleGetExpenses}
                className="expenses-button"
                disabled={loadingExpenses}
                aria-label="Get Expenses"
              >
                <span>{loadingExpenses ? "Fetching Expenses..." : "Get Expenses"}</span>
              </button>
            </div>

            {loadingExpenses && (
              <div className="spinner-container">
                <ClipLoader color="#8B6D5D" loading={loadingExpenses} size={50} />
              </div>
            )}

            {expenses.length > 0 && <ExpensesTable expenses={expenses} />} */}

            <div className="chat-container">
              <Chat />
            </div>
          </div>
        </div>

        <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </div>
  );
};

export default Messages;