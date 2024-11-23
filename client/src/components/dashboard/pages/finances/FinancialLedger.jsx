import React, { useState, useEffect } from "react";
import { X, AlertTriangle, MoreVertical, Trash } from "lucide-react";
import { toast } from "react-toastify";
import "./FinancialLedger.css";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import AddTransaction from "./AddTransaction";
import api from "../../../../services/api";
import Chat from "../../chatBot/Chat";

// Row Action Menu Component
const RowActionMenu = ({ isOpen, onClose, onDelete, position }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
    onClose(); // Close the menu when showing confirm
  };

  return (
    <>
      <div
        className="row-action-menu"
        style={{
          position: "fixed",
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: "translate(-100%, -50%)", // Center vertically and position to left
        }}
      >
        <button
          onClick={handleDeleteClick}
          className="row-action-delete-button"
        >
          <Trash size={16} />
          Delete
        </button>
      </div>

      {showConfirm && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            onDelete();
            setShowConfirm(false);
          }}
          count={1}
        />
      )}
    </>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm();
  };

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <h3 className="delete-modal-title">Confirm Delete</h3>
        <p className="delete-modal-message">
          Are you sure you want to delete {count} selected{" "}
          {count === 1 ? "transaction" : "transactions"}? This action cannot be
          undone.
        </p>
        <div className="delete-modal-buttons">
          <button onClick={onClose} className="delete-modal-cancel-button">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="delete-modal-confirm-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const formatNumberWithCommas = (number) => {
  const parts = Math.abs(number).toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${number < 0 ? "(" : ""}${parts.join(".")}${number < 0 ? ")" : ""}`;
};

const FinancialLedger = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMenu, setActionMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    transactionId: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      const netAmount = totalIncome - totalExpenses;
      const isPositive = totalIncome > totalExpenses;

      setSummaryData({
        sent: {
          amount: formatNumberWithCommas(totalExpenses),
          label: "Expenses",
          subtext: `${expenses.length} transactions`,
        },
        overdue: {
          amount: formatNumberWithCommas(totalIncome),
          label: "Income",
          subtext: `${incomes.length} transactions`,
        },
        paid: {
          amount: formatNumberWithCommas(netAmount),
          label: "Net",
          subtext: `${combined.length} total transactions`,
        },
        score: {
          label: "Payment score",
          value: isPositive ? "Good" : "Review",
          subtext: isPositive
            ? "Income exceeds expenses"
            : "Expenses exceed income",
          status: isPositive ? "positive" : "negative", // Add this line
        },
      });
    } catch (err) {
      setError("Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleMoreOptionsClick = (e, transactionId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();

    setActionMenu({
      isOpen: true,
      position: {
        x: rect.left,
        y: rect.top + rect.height / 2 + window.scrollY,
      },
      transactionId,
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedRows.map((id) => {
        const type = id.startsWith("expense") ? "expenses" : "incomes";
        const cleanId = id.replace(/^(expense|income)-/, "");
        return api.delete(`/${type}/${cleanId}`);
      });

      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${selectedRows.length} transactions`);
      fetchTransactions();
      setSelectedRows([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting transactions:", error);
      toast.error("Failed to delete some transactions");
    }
  };

  const handleSingleDelete = async (transactionId) => {
    try {
      const type = transactionId.startsWith("expense") ? "expenses" : "incomes";
      const cleanId = transactionId.replace(/^(expense|income)-/, "");
      await api.delete(`/${type}/${cleanId}`);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
      setActionMenu({
        isOpen: false,
        position: { x: 0, y: 0 },
        transactionId: null,
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenu.isOpen) {
        setActionMenu({
          isOpen: false,
          position: { x: 0, y: 0 },
          transactionId: null,
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [actionMenu.isOpen]);

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
      <TopNavigation onDataUpdate={refreshData} />
      <Chat />

      <div className="ledger-summary-boxes">
        {Object.entries(summaryData).map(([key, data]) => (
          <div
            key={key}
            className={`ledger-summary-box ${
              key === "score" ? "ledger-score-box" : ""
            }`}
            data-status={key === "score" ? data.status : undefined}
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
          <div className="ledger-button-group">
            {selectedRows.length > 0 && (
              <button
                className="selected-delete-button"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash size={16} />
                Delete Selected ({selectedRows.length})
              </button>
            )}
            <button
              className="ledger-add-button"
              onClick={() => setShowAddTransaction(true)}
            >
              + Add Transaction
            </button>
          </div>
        </div>

        <div className="ledger-table-wrapper">
          <table className="ledger-transactions-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="ledger-checkbox"
                    checked={
                      filteredTransactions.length > 0 &&
                      selectedRows.length === filteredTransactions.length
                    }
                    onChange={handleSelectAll}
                  />
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
                  className={`${
                    selectedRows.includes(transaction.id)
                      ? "ledger-selected"
                      : ""
                  } hover:bg-gray-50`}
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
                    {formatNumberWithCommas(transaction.amount)}
                  </td>
                  <td>{transaction.account}</td>
                  <td>{transaction.method}</td>
                  <td>
                    <button
                      className="table-more-options-button"
                      onClick={(e) => handleMoreOptionsClick(e, transaction.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddTransaction && (
        <AddTransaction
          onClose={() => setShowAddTransaction(false)}
          fetchData={fetchTransactions}
        />
      )}

      <RowActionMenu
        isOpen={actionMenu.isOpen}
        onClose={() =>
          setActionMenu({
            isOpen: false,
            position: { x: 0, y: 0 },
            transactionId: null,
          })
        }
        onDelete={() => handleSingleDelete(actionMenu.transactionId)}
        position={actionMenu.position}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSelected}
        count={selectedRows.length}
      />
    </div>
  );
};

export default FinancialLedger;
