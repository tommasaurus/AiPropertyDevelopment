// src/components/addressAutocomplete/AddressAutocomplete.js

import React, { useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import './AddressAutocomplete.css'; // Optional: Import CSS for styling

const libraries = ['places'];

const AddressAutocomplete = ({ onSelectAddress }) => {
  const inputRef = useRef(null);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Adjust as needed
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }

        const addressComponents = place.address_components;
        let streetNumber = '';
        let route = '';
        let city = '';
        let state = '';
        let zipCode = '';

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        });

        const formattedAddress = place.formatted_address;
        const placeId = place.place_id;
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        // Pass the selected address data to the parent component
        onSelectAddress({
          address: `${streetNumber} ${route}`,
          city,
          state,
          zipCode,
          formattedAddress,
          placeId,
          latitude,
          longitude,
        });
      });
    }
  }, [isLoaded, onSelectAddress]);

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  return (
    <div className="address-autocomplete">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter property address"
        className="autocomplete-input"
        disabled={!isLoaded}
      />
    </div>
  );
};

export default AddressAutocomplete;
