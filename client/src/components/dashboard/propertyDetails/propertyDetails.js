// client/src/components/dashboard/Dashboard.js

import React from 'react';
import './propertyDetails.css';

const PropertyDetails = ({ property, onClose }) => {
  if (!property) return null; // If no property is provided, don't render anything.

  return (
    <div className="property-details-modal">
      <div className="property-details-content">
        <h2>{property.address}</h2>
        <p><strong>Bedrooms:</strong> {property.num_bedrooms || 'N/A'}</p>
        <p><strong>Bathrooms:</strong> {property.num_bathrooms || 'N/A'}</p>
        <p><strong>Floors:</strong> {property.num_floors || 'N/A'}</p>
        <p><strong>Commercial:</strong> {property.is_commercial ? 'Yes' : 'No'}</p>
        <p><strong>HOA:</strong> {property.is_hoa ? 'Yes' : 'No'}</p>
        <p><strong>HOA Fee:</strong> {property.hoa_fee || 'N/A'}</p>
        <p><strong>Purchase Price:</strong> {property.purchase_price || 'N/A'}</p>
        <p><strong>Purchase Date:</strong> {property.purchase_date || 'N/A'}</p>
        <p><strong>Property Type:</strong> {property.property_type || 'N/A'}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PropertyDetails;
