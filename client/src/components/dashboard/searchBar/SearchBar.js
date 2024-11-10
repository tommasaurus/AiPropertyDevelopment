// src/components/dashboard/searchBar/SearchBar.js

import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import './SearchBar.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const customSuggestionsList = [
  'Profile',
  'Settings',
  'Support',
  'Notifications'
  // Add more custom strings as needed
];

const sidebarSuggestionsList = [
  { type: 'sidebar', label: 'Dashboard', path: '/dashboard' },
  { type: 'sidebar', label: 'Properties', path: '/dashboard/properties' },
  { type: 'sidebar', label: 'Calendar', path: '/dashboard/calendar' },
  { type: 'sidebar', label: 'Tenants', path: '/dashboard/tenants' },
  { type: 'sidebar', label: 'Messages', path: '/dashboard/messages' },
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch properties owned by the user
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get('/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Update suggestions based on the query
  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Filter properties
    const propertySuggestions = properties
      .filter((property) =>
        property.address.toLowerCase().includes(lowerQuery)
      )
      .map((property) => ({ type: 'property', label: property.address, id: property.id }));

    // Filter custom suggestions
    const customSuggestionsFiltered = customSuggestionsList
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(lowerQuery)
      )
      .map((suggestion) => ({ type: 'custom', label: suggestion }));

    // Filter sidebar suggestions
    const sidebarSuggestionsFiltered = sidebarSuggestionsList
      .filter((suggestion) =>
        suggestion.label.toLowerCase().includes(lowerQuery)
      );

    // Combine and limit suggestions
    const combinedSuggestions = [
      ...customSuggestionsFiltered,
      ...sidebarSuggestionsFiltered,
      ...propertySuggestions,
    ].slice(0, 10); // Limit to 10 suggestions

    setSuggestions(combinedSuggestions);
    setActiveSuggestionIndex(-1);
  }, [query, properties]);

  const getAllSuggestions = () => {
    const propertySuggestions = properties.map((property) => ({
      type: 'property',
      label: property.address,
      id: property.id,
    }));

    const customSuggestions = customSuggestionsList.map((suggestion) => ({
      type: 'custom',
      label: suggestion,
    }));

    const sidebarSuggestions = sidebarSuggestionsList;

    return [...customSuggestions, ...sidebarSuggestions, ...propertySuggestions];
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === 'Tab') {
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          e.preventDefault();
          selectSuggestion(suggestions[activeSuggestionIndex]);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      } else if (e.key === 'Escape') {
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    // Refocus on the search input
    inputRef.current.focus();
  };

  const navigateToSuggestion = (suggestion) => {
    if (suggestion.type === 'property') {
      navigate(`/dashboard/properties?propertyId=${suggestion.id}`);
    } else if (suggestion.type === 'sidebar') {
      navigate(suggestion.path);
    } else if (suggestion.type === 'custom') {
      // Handle custom suggestions
      switch (suggestion.label.toLowerCase()) {
        case 'profile':
          navigate('/profile');
          break;
        case 'settings':
          navigate('/settings');
          break;
        case 'support':
          navigate('/support');
          break;
        case 'notifications':
          navigate('/notifications');
          break;
        default:
          break;
      }
    }
  };

  const performSearch = () => {
    const lowerQuery = query.toLowerCase();
    const allSuggestions = getAllSuggestions();

    // Try to find an exact match
    const matchedSuggestion = allSuggestions.find(
      (suggestion) => suggestion.label.toLowerCase() === lowerQuery
    );

    if (matchedSuggestion) {
      navigateToSuggestion(matchedSuggestion);
    } else {
      // No match found, you can display a message or handle it as needed
      console.log('No matching suggestion found');
    }
  };

  // Close suggestions when clicking outside
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-icon">
        <FaSearch />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        aria-label="Search"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-activedescendant={
          activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined
        }
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list" id="search-suggestions" ref={suggestionsRef}>
          {suggestions.map((item, index) => (
            <li
              key={index}
              id={`suggestion-${index}`}
              className={`suggestion-item ${
                index === activeSuggestionIndex ? 'active' : ''
              }`}
              onClick={() => selectSuggestion(item)}
              role="option"
              aria-selected={index === activeSuggestionIndex}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
