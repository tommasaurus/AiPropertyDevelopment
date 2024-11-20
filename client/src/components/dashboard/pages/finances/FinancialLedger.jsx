import React, { useState, useEffect } from "react";
import "./FinancialLedger.css";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import AddTransaction from "./AddTransaction";
import api from "../../../../services/api";

const FinancialLedger = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    sent: { amount: "$0.00", label: "Sent", subtext: "0 transactions" },
    overdue: { amount: "$0.00", label: "Overdue", subtext: "0 transactions" },
    paid: { amount: "$0.00", label: "Paid", subtext: "0 transactions" },
    score: {
      label: "Payment score",
      value: "Good",
      subtext: "Seamless payments, right on schedule",
    },
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [expensesRes, incomesRes] = await Promise.all([
        api.get("/expenses"),
        api.get("/incomes"),
      ]);

      // Transform expenses (make amounts negative)
      const expenses = expensesRes.data.map((expense) => ({
        id: `expense-${expense.id}`,
        date: new Date(expense.transaction_date).toLocaleDateString(),
        description: expense.description || "",
        amount: -Math.abs(expense.amount),
        account: expense.bank_account || "",
        method: expense.method || "",
        entity: expense.entity || "",
        type: "expense",
      }));

      // Transform incomes (keep amounts positive)
      const incomes = incomesRes.data.map((income) => ({
        id: `income-${income.id}`,
        date: new Date(income.transaction_date).toLocaleDateString(),
        description: income.description || "",
        amount: Math.abs(income.amount),
        account: income.bank_account || "",
        method: income.method || "",
        entity: income.entity || "",
        type: "income",
      }));

      // Combine and sort by date
      const combined = [...expenses, ...incomes].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(combined);

      // Calculate summary data
      const totalExpenses = Math.abs(
        expenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
      const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

      setSummaryData({
        sent: {
          amount: `$${totalExpenses.toFixed(2)}`,
          label: "Expenses",
          subtext: `${expenses.length} transactions`,
        },
        overdue: {
          amount: `$${totalIncome.toFixed(2)}`,
          label: "Income",
          subtext: `${incomes.length} transactions`,
        },
        paid: {
          amount:
            totalIncome - totalExpenses >= 0
              ? `$${(totalIncome - totalExpenses).toFixed(2)}`
              : `$(${Math.abs(totalIncome - totalExpenses).toFixed(2)})`,
          label: "Net",
          subtext: `${combined.length} total transactions`,
        },
        score: {
          label: "Payment score",
          value: totalIncome > totalExpenses ? "Good" : "Review",
          subtext:
            totalIncome > totalExpenses
              ? "Income exceeds expenses"
              : "Expenses exceed income",
        },
      });
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ledger-container">
      <Sidebar />
      <TopNavigation />

      <div className="ledger-summary-boxes">
        {Object.entries(summaryData).map(([key, data]) => (
          <div
            key={key}
            className={`ledger-summary-box ${
              key === "score" ? "ledger-score-box" : ""
            }`}
          >
            {key === "score" ? (
              <>
                <div className="ledger-summary-score">{data.value}</div>
                <div className="ledger-summary-label">{data.label}</div>
                <div className="ledger-summary-subtext">{data.subtext}</div>
                <div className="ledger-score-bars">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="ledger-score-bar" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="ledger-summary-amount">{data.amount}</div>
                <div className="ledger-summary-label">{data.label}</div>
                <div className="ledger-summary-subtext">{data.subtext}</div>
              </>
            )}
          </div>
        ))}
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
          <button
            className="ledger-add-button"
            onClick={() => setShowAddTransaction(true)}
          >
            + Add Transaction
          </button>
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
            {filteredTransactions.map((transaction) => (
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
      {showAddTransaction && (
        <AddTransaction
          onClose={() => setShowAddTransaction(false)}
          fetchData={fetchTransactions}
        />
      )}
    </div>
  );
};

export default FinancialLedger;
