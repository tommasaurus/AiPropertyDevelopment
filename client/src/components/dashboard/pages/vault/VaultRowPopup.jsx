import React, { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import "./VaultRowPopup.css";

export default function VaultRowPopup({
  data,
  columns,
  isOpen,
  onClose,
  onDelete,
  currentFolder,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDelete = async () => {
    if (!currentFolder?.name) {
      toast.error("Unable to determine record type for deletion");
      return;
    }

    // Get the endpoint from the folder name
    const endpoint = `/${currentFolder.name.toLowerCase()}/${data.id}`;

    // Show confirmation dialog
    const recordType = currentFolder.name.slice(0, -1); // Remove 's' from plural
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${recordType}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await api.delete(endpoint);

      // Close the popup
      onClose();

      // Notify parent component to refresh data
      if (onDelete) onDelete();

      // Show success message
      toast.success(`${recordType} successfully deleted`);
    } catch (error) {
      console.error("Error deleting record:", error);
      let errorMessage = "Failed to delete record. ";

      // Handle specific error cases
      if (error.response?.status === 409) {
        errorMessage +=
          "This record is referenced by other items and cannot be deleted.";
      } else if (error.response?.data?.detail) {
        errorMessage += error.response.data.detail;
      } else {
        errorMessage += "Please try again.";
      }

      setDeleteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vault-popup-overlay" onClick={onClose}>
      <div className="vault-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="vault-popup-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="vault-popup-header">
          <h3>Record Details</h3>
        </div>

        <div className="vault-popup-body">
          <div className="vault-popup-fields">
            {columns.map((column) => (
              <div key={column.key} className="vault-popup-field">
                <div className="vault-popup-label">{column.label}</div>
                <div className="vault-popup-value">
                  {column.formatter(data[column.key])}
                </div>
              </div>
            ))}
          </div>
        </div>

        {deleteError && (
          <div className="vault-popup-error">
            <AlertTriangle size={16} />
            <span>{deleteError}</span>
          </div>
        )}

        <div className="vault-popup-footer">
          <button
            className="vault-popup-button vault-popup-button-delete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button className="vault-popup-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
