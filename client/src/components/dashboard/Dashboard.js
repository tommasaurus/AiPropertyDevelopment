import React, { useEffect, useState } from 'react';
import api from '../../services/api';  // Axios instance
import './Dashboard.css';
import PropertyDetails from './propertyDetails/propertyDetails';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    num_bedrooms: '',
    num_bathrooms: '',
    num_floors: '',
    is_commercial: false,
    is_hoa: false,
    hoa_fee: '',
    is_nnn: false,
    purchase_price: '',
    purchase_date: '',
    property_type: '',
  });
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);  // To store the clicked property

  // Fetch properties on component mount
  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      num_bedrooms: formData.num_bedrooms ? parseInt(formData.num_bedrooms, 10) : null,
      num_bathrooms: formData.num_bathrooms ? parseInt(formData.num_bathrooms, 10) : null,
      num_floors: formData.num_floors ? parseInt(formData.num_floors, 10) : null,
      hoa_fee: formData.hoa_fee ? parseFloat(formData.hoa_fee) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null
    };

    try {
      const response = await api.post('/properties', formattedData);
      console.log('Property added successfully:', response.data);
      setShowModal(false);
      fetchProperties();  // Re-fetch properties after adding the new one
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);  // Store the clicked property in state
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);  // Close the property details modal
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard</h1>
      <p>This is a protected page only accessible to authenticated users.</p>

      {/* Display the user's properties */}
      <div className="properties-list">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div 
              key={property.id} 
              className="property-card" 
              onClick={() => handlePropertyClick(property)}  // Pass the property to the handler
              style={{ cursor: 'pointer' }}  
            >
              <h3>{property.address}</h3>
              <p>Bedrooms: {property.num_bedrooms || 'N/A'}</p>
              <p>Bathrooms: {property.num_bathrooms || 'N/A'}</p>
              <p>Floors: {property.num_floors || 'N/A'}</p>
              <p>Commercial: {property.is_commercial ? 'Yes' : 'No'}</p>
            </div>
          ))
        ) : (
          <p>No properties available.</p>
        )}
      </div>

      {/* Add Property Button */}
      <button onClick={() => setShowModal(true)}>Add Property</button>

      {/* Add Property Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Property</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Number of Bedrooms:
                <input
                  type="number"
                  name="num_bedrooms"
                  value={formData.num_bedrooms}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Number of Bathrooms:
                <input
                  type="number"
                  name="num_bathrooms"
                  value={formData.num_bathrooms}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Number of Floors:
                <input
                  type="number"
                  name="num_floors"
                  value={formData.num_floors}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Commercial Property:
                <input
                  type="checkbox"
                  name="is_commercial"
                  checked={formData.is_commercial}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                HOA Property:
                <input
                  type="checkbox"
                  name="is_hoa"
                  checked={formData.is_hoa}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                HOA Fee:
                <input
                  type="number"
                  name="hoa_fee"
                  value={formData.hoa_fee}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Purchase Price:
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Purchase Date:
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Property Type:
                <input
                  type="text"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                />
              </label>

              <button type="submit" disabled={isSubmitting}>Add Property</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetails 
          property={selectedProperty} 
          onClose={handleCloseDetails}  // Pass the close handler
        />
      )}
    </div>
  );
};

export default Dashboard;
