// AddressAutocomplete.jsx
import React, { useRef, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import "./AddressAutocomplete.css";

const libraries = ["places"];

const AddressAutocomplete = ({ onSelectAddress, value, onChange }) => {
  const inputRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.log("No details available for input: '" + place.name + "'");
          return;
        }

        const addressComponents = place.address_components;
        let streetNumber = "";
        let route = "";
        let city = "";
        let state = "";
        let zipCode = "";

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
          if (types.includes("route")) {
            route = component.long_name;
          }
          if (types.includes("locality")) {
            city = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });

        const formattedAddress = place.formatted_address;
        const placeId = place.place_id;
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

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

  // Handle manual input changes
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  return (
    <div className="address-autocomplete">
      <input
        ref={inputRef}
        type="text"
        name="address"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter property address"
        className="autocomplete-input"
        disabled={!isLoaded}
      />
    </div>
  );
};

export default AddressAutocomplete;
