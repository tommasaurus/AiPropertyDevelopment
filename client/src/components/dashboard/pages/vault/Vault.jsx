import React, { useState } from "react";
import { Search, Settings, Plus, Folder, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import api from "../../../../services/api";
import "./Vault.css";

const Vault = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderData, setFolderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [currentPath, setCurrentPath] = useState(["All"]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState(null);

  const folderStructure = {
    Documents: {
      icon: Folder,
      endpoint: null,
      subfolders: {
        Documents: { icon: Folder, endpoint: "/documents" },
        Contracts: { icon: Folder, endpoint: "/contracts" },
        Leases: { icon: Folder, endpoint: "/leases" },
        Invoices: { icon: Folder, endpoint: "/invoices" },
      },
    },
    Finances: {
      icon: Folder,
      endpoint: null,
      subfolders: {
        Income: { icon: Folder, endpoint: "/incomes" },
        Expenses: { icon: Folder, endpoint: "/expenses" },
      },
    },
    People: {
      icon: Folder,
      endpoint: null,
      subfolders: {
        Tenants: { icon: Folder, endpoint: "/tenants" },
        Vendors: { icon: Folder, endpoint: "/vendors" },
      },
    },
  };

  const getCurrentFolders = () => {
    if (currentPath.length === 1) {
      // Show only main categories
      return Object.entries(folderStructure).map(([name, data]) => ({
        id: name,
        name,
        isParent: true,
        ...data,
      }));
    }

    const mainFolder = folderStructure[currentPath[1]];
    if (!mainFolder) return [];

    // Return parent folder followed by its subfolders
    return [
      {
        id: currentPath[1],
        name: currentPath[1],
        isParent: true,
        ...mainFolder,
      },
      ...Object.entries(mainFolder.subfolders).map(([name, data]) => ({
        id: name,
        name,
        isParent: false,
        ...data,
      })),
    ];
  };

  const handlePathClick = (index) => {
    if (index === 0) {
      setExpandedFolder(null);
    }
    setCurrentPath((prev) => prev.slice(0, index + 1));
    setSelectedFolder(null);
    setFolderData([]);
    setTableColumns([]);
  };

  const handleFolderClick = async (folder) => {
    if (folder.isParent) {
      if (currentPath.includes(folder.name)) {
        // If clicking on an expanded parent folder, return to main view
        setIsAnimating(true);
        setCurrentPath(["All"]);
        setSelectedFolder(null);
        setFolderData([]);
        setTableColumns([]);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsAnimating(false);
      } else {
        // If clicking on a parent folder from main view, expand it
        setIsAnimating(true);
        setCurrentPath(["All", folder.name]);
        setSelectedFolder(null);
        setFolderData([]);
        setTableColumns([]);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsAnimating(false);
      }
    } else {
      setSelectedFolder(folder);
      fetchFolderData(folder);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return !isNaN(num) ? `$${num.toFixed(2)}` : "N/A";
  };

  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, key) => {
      const propName = prefix ? `${prefix}_${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        return { ...acc, ...flattenObject(obj[key], key) };
      }
      return { ...acc, [propName]: obj[key] };
    }, {});
  };

  const getColumnsFromData = (data) => {
    if (!data || data.length === 0) return [];

    const allKeys = data.reduce((keys, item) => {
      const flatItem = flattenObject(item);
      Object.keys(flatItem).forEach((key) => {
        if (!keys.includes(key)) keys.push(key);
      });
      return keys;
    }, []);

    const excludedFields = [
      "id",
      "property_id",
      "owner_id",
      "lease_id",
      "expense_id",
      "invoice_id",
      "tenant_id",
      "contract_id",
    ];

    const displayFields = allKeys.filter(
      (key) => !excludedFields.includes(key)
    );

    return displayFields.map((key) => ({
      key,
      label: key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      formatter: (value) => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (key.includes("date")) return formatDate(value);
        if (
          key.includes("amount") ||
          key.includes("price") ||
          key.includes("fee") ||
          key.includes("rent")
        ) {
          return formatCurrency(value);
        }
        return value.toString();
      },
    }));
  };

  const fetchFolderData = async (folder) => {
    setIsLoading(true);
    try {
      const response = await api.get(folder.endpoint);
      const data = response.data;
      setFolderData(data);
      const columns = getColumnsFromData(data);
      setTableColumns(columns);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTableRow = (item) => {
    const flatItem = flattenObject(item);
    return tableColumns.map((column) => (
      <td key={`${item.id}-${column.key}`}>
        {column.formatter(flatItem[column.key])}
      </td>
    ));
  };

  const filteredData = folderData.filter((item) => {
    const flatItem = flattenObject(item);
    return Object.values(flatItem).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="vault-container">
      <Sidebar />
      <TopNavigation />
      <div className="vault-content">
        <h2 className="vault-recent-activity-title">Recent activity</h2>

        <div className="vault-recent-activity">
          {getCurrentFolders().map((folder) => (
            <div
              key={folder.id}
              className={`vault-folder-card 
                ${folder.isParent ? "parent" : ""} 
                ${folder.name === currentPath[1] ? "expanded" : ""}
                ${folder.name === expandedFolder ? "selected" : ""} 
                ${selectedFolder?.id === folder.id ? "selected" : ""} 
                ${folder.className || ""}`}
              onClick={() => handleFolderClick(folder)}
            >
              <Folder size={36} />
              <span className="vault-folder-name">{folder.name}</span>
            </div>
          ))}
        </div>

        <div className="vault-table-section">
          <div className="vault-breadcrumb">
            {currentPath.map((path, index) => (
              <React.Fragment key={path}>
                <span
                  className="vault-breadcrumb-item"
                  onClick={() => handlePathClick(index)}
                >
                  {path}
                </span>
                {index < currentPath.length - 1 && (
                  <span className="vault-breadcrumb-separator">
                    <ChevronRight size={16} />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="vault-table-header">
            <div className="vault-table-actions">
              <div className="vault-search-container">
                <Search size={16} className="vault-search-icon" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="vault-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="vault-icon-button">
                <Settings size={16} />
              </button>
              <button className="vault-icon-button">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="vault-table-wrapper">
            <table className="vault-table">
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="vault-empty-state"
                    >
                      <div>Loading...</div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="vault-empty-state"
                    >
                      <div>
                        <h3>
                          {selectedFolder ? selectedFolder.name : "No Data"}
                        </h3>
                        <p>
                          {selectedFolder
                            ? `No ${selectedFolder.name.toLowerCase()} found.`
                            : "Select a folder to view its contents."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id}>{renderTableRow(item)}</tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;
