import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Bell, Upload } from "lucide-react";
import api from "../../../services/api";
import PropertyDetails from "../pages/properties/propertyDetails";
import UploadDocument from "../uploadDocument/UploadDocument";
import profilePhoto from "../../../assets/img/DefaultProfilePhoto.webp";
import "./TopNavigation.css";

const TopNavigation = () => {
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [userName, setUserName] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const customSuggestionsList = [
    "Profile",
    "Settings",
    "Support",
    "Notifications",
  ];

  const sidebarSuggestionsList = [
    { type: "sidebar", label: "Dashboard", path: "/dashboard" },
    { type: "sidebar", label: "Properties", path: "/dashboard/properties" },
    { type: "sidebar", label: "Calendar", path: "/dashboard/calendar" },
    { type: "sidebar", label: "Tenants", path: "/dashboard/tenants" },
    { type: "sidebar", label: "Finances", path: "/dashboard/finances" },
    { type: "sidebar", label: "Vault", path: "/dashboard/vault" },
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get("/users/me");
        const firstName = response.data.name
          ? response.data.name.split(" ")[0]
          : "User";
        setUserName(firstName);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const propertySuggestions = properties
      .filter((property) => property.address.toLowerCase().includes(lowerQuery))
      .map((property) => ({
        type: "property",
        label: property.address,
        id: property.id,
      }));

    const customSuggestionsFiltered = customSuggestionsList
      .filter((suggestion) => suggestion.toLowerCase().includes(lowerQuery))
      .map((suggestion) => ({ type: "custom", label: suggestion }));

    const sidebarSuggestionsFiltered = sidebarSuggestionsList.filter(
      (suggestion) => suggestion.label.toLowerCase().includes(lowerQuery)
    );

    const combinedSuggestions = [
      ...customSuggestionsFiltered,
      ...sidebarSuggestionsFiltered,
      ...propertySuggestions,
    ].slice(0, 10);

    setSuggestions(combinedSuggestions);
    setActiveSuggestionIndex(-1);
  }, [query, properties]);

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === "Tab") {
        if (
          activeSuggestionIndex >= 0 &&
          activeSuggestionIndex < suggestions.length
        ) {
          e.preventDefault();
          const suggestion = suggestions[activeSuggestionIndex];
          setQuery(suggestion.label);
          setSuggestions([]);
          setActiveSuggestionIndex(-1);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    inputRef.current.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    selectSuggestion(suggestion);
    if (suggestion.type === "property") {
      const property = properties.find((p) => p.id === suggestion.id);
      setSelectedProperty(property);
    } else {
      navigateToSuggestion(suggestion);
    }
  };

  const navigateToSuggestion = (suggestion) => {
    if (suggestion.type === "sidebar") {
      navigate(suggestion.path);
    } else if (suggestion.type === "custom") {
      switch (suggestion.label.toLowerCase()) {
        case "profile":
          navigate("/profile");
          break;
        case "settings":
          navigate("/settings");
          break;
        case "support":
          navigate("/support");
          break;
        case "notifications":
          navigate("/notifications");
          break;
        default:
          break;
      }
    }
  };

  const getAllSuggestions = () => {
    const propertySuggestions = properties.map((property) => ({
      type: "property",
      label: property.address,
      id: property.id,
    }));

    const customSuggestions = customSuggestionsList.map((suggestion) => ({
      type: "custom",
      label: suggestion,
    }));

    return [
      ...customSuggestions,
      ...sidebarSuggestionsList,
      ...propertySuggestions,
    ];
  };

  const performSearch = () => {
    const lowerQuery = query.toLowerCase();
    const allSuggestions = getAllSuggestions();

    const matchedSuggestion = allSuggestions.find(
      (suggestion) => suggestion.label.toLowerCase() === lowerQuery
    );

    if (matchedSuggestion) {
      if (matchedSuggestion.type === "property") {
        const property = properties.find((p) => p.id === matchedSuggestion.id);
        setSelectedProperty(property);
      } else {
        navigateToSuggestion(matchedSuggestion);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="top-navigation">
      <div className="nav-content">
        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              aria-label="Search"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-activedescendant={
                activeSuggestionIndex >= 0
                  ? `suggestion-${activeSuggestionIndex}`
                  : undefined
              }
            />
            <div className="search-icon">
              <FaSearch />
            </div>
            {suggestions.length > 0 && (
              <ul
                className="suggestions-list"
                id="search-suggestions"
                ref={suggestionsRef}
              >
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    id={`suggestion-${index}`}
                    className={`suggestion-item ${
                      index === activeSuggestionIndex ? "active" : ""
                    }`}
                    onClick={() => handleSuggestionClick(item)}
                    role="option"
                    aria-selected={index === activeSuggestionIndex}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="nav-items">
          <button
            className="upload-wrapper"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={20} />
            <span>Upload</span>
          </button>
          <button className="notification-wrapper">
            <Bell size={20} />
            <span className="notification-count">0</span>
          </button>
          <div className="user-profile">
            <img src={profilePhoto} alt="User avatar" className="user-avatar" />
            <span>{userName}</span>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {showUploadModal && (
        <UploadDocument
          properties={properties}
          onClose={() => setShowUploadModal(false)}
          fetchAllData={() => {}}
        />
      )}
    </div>
  );
};

export default TopNavigation;
