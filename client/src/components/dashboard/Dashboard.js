import React, { useEffect, useState } from "react";
import {
  Building2,
  DollarSign,
  Users,
  Percent,
  PlusCircle,
  Bell,
  FileText,
  Search,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import Sidebar from "./sidebar/Sidebar";
import PropertyDetails from "./propertyDetails/propertyDetails";
import api from "../../services/api";
import dwellexLogo from "../../images/dwellexLogo.png";
import "./Dashboard.css";

const Dashboard = () => {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    num_bedrooms: "",
    num_bathrooms: "",
    num_floors: "",
    is_commercial: false,
    is_hoa: false,
    hoa_fee: "",
    is_nnn: false,
    purchase_price: "",
    purchase_date: "",
    property_type: "",
  });

  // Stats data
  const stats = [
    {
      title: "Properties",
      value: properties.length,
      subtitle: "Total Active",
      icon: Building2,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "$4,680.00",
      subtitle: "August 2024",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Tenants",
      value: "15",
      subtitle: "Across all properties",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Occupancy Rate",
      value: "94%",
      subtitle: "Property utilization",
      icon: Percent,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedData = {
      ...formData,
      num_bedrooms: formData.num_bedrooms
        ? parseInt(formData.num_bedrooms, 10)
        : null,
      num_bathrooms: formData.num_bathrooms
        ? parseInt(formData.num_bathrooms, 10)
        : null,
      num_floors: formData.num_floors
        ? parseInt(formData.num_floors, 10)
        : null,
      hoa_fee: formData.hoa_fee ? parseFloat(formData.hoa_fee) : null,
      purchase_price: formData.purchase_price
        ? parseFloat(formData.purchase_price)
        : null,
      purchase_date: formData.purchase_date || null,
      property_type: formData.property_type || null,
    };

    try {
      const response = await api.post("/properties", formattedData);
      console.log("Property added successfully:", response.data);
      setShowModal(false);
      fetchProperties();
    } catch (error) {
      console.error("Error adding property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <div className='dashboard-layout'>
      {/* Sidebar with imported logo */}
      <Sidebar logo={dwellexLogo} />

      <main className='dashboard-main'>
        {/* Header Section */}
        <div className='dashboard-header'>
          <div className='header-container'>
            <div className='header-title'>
              <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
              <p className='text-sm text-gray-500 mt-1'>
                Welcome to your property management dashboard
              </p>
            </div>
            <div className='header-actions'>
              <div className='search-container'>
                <Search className='search-icon' size={20} />
                <input
                  type='text'
                  placeholder='Search properties...'
                  className='search-input'
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className='btn-primary'
              >
                <PlusCircle size={20} />
                <span>Add Property</span>
              </button>
              <div className='notification-badge'>
                <Bell size={24} />
                <span className='badge-indicator' />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='stats-grid'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className='hover:shadow-lg transition-shadow'>
                <CardContent className='p-6'>
                  <div className='flex items-center justify-between'>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                    <span className='text-sm text-gray-500'>
                      {stat.subtitle}
                    </span>
                  </div>
                  <div className='mt-4'>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {stat.value}
                    </h3>
                    <p className='text-gray-600'>{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Properties Section */}
        <div className='properties-section'>
          <div className='properties-header'>
            <h2 className='text-xl font-bold text-gray-900'>Your Properties</h2>
            <select className='filter-select'>
              <option>All Properties</option>
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </div>

          <div className='properties-grid'>
            {properties.length > 0 ? (
              properties.map((property) => (
                <Card
                  key={property.id}
                  className='property-card'
                  onClick={() => handlePropertyClick(property)}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-lg font-semibold text-gray-900 truncate'>
                        {property.address}
                      </h3>
                      <FileText className='w-5 h-5 text-gray-400' />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-sm text-gray-500'>Bedrooms</p>
                        <p className='font-medium'>
                          {property.num_bedrooms || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Bathrooms</p>
                        <p className='font-medium'>
                          {property.num_bathrooms || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Type</p>
                        <p className='font-medium'>
                          {property.is_commercial
                            ? "Commercial"
                            : "Residential"}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Status</p>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          Active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className='empty-state'>
                <Building2 className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                  No properties
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Get started by adding a new property.
                </p>
                <div className='mt-6'>
                  <button
                    onClick={() => setShowModal(true)}
                    className='btn-primary'
                  >
                    <PlusCircle size={20} />
                    <span>Add Property</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Property Modal */}
        {showModal && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2 className='text-xl font-bold'>Add New Property</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className='modal-form'>
                <div className='form-group'>
                  <label>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='form-group'>
                    <label>Bedrooms</label>
                    <input
                      type='number'
                      name='num_bedrooms'
                      value={formData.num_bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className='form-group'>
                    <label>Bathrooms</label>
                    <input
                      type='number'
                      name='num_bathrooms'
                      value={formData.num_bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className='form-group'>
                  <label>Floors</label>
                  <input
                    type='number'
                    name='num_floors'
                    value={formData.num_floors}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='flex gap-4'>
                  <div className='form-group checkbox'>
                    <label>
                      <input
                        type='checkbox'
                        name='is_commercial'
                        checked={formData.is_commercial}
                        onChange={handleInputChange}
                      />
                      Commercial Property
                    </label>
                  </div>

                  <div className='form-group checkbox'>
                    <label>
                      <input
                        type='checkbox'
                        name='is_hoa'
                        checked={formData.is_hoa}
                        onChange={handleInputChange}
                      />
                      HOA Property
                    </label>
                  </div>
                </div>

                {formData.is_hoa && (
                  <div className='form-group'>
                    <label>HOA Fee</label>
                    <input
                      type='number'
                      name='hoa_fee'
                      value={formData.hoa_fee}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className='form-group'>
                  <label>Purchase Price</label>
                  <input
                    type='number'
                    name='purchase_price'
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='form-group'>
                  <label>Purchase Date</label>
                  <input
                    type='date'
                    name='purchase_date'
                    value={formData.purchase_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='form-group'>
                  <label>Property Type</label>
                  <input
                    type='text'
                    name='property_type'
                    value={formData.property_type}
                    onChange={handleInputChange}
                  />
                </div>

                <div className='modal-footer'>
                  <button
                    type='button'
                    onClick={() => setShowModal(false)}
                    className='btn-secondary'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='btn-primary'
                  >
                    {isSubmitting ? "Adding..." : "Add Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Property Details Modal */}
        {selectedProperty && (
          <PropertyDetails
            property={selectedProperty}
            onClose={handleCloseDetails}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
