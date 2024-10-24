import React from "react";
import { X } from "lucide-react";

const PropertyDetails = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='text-xl font-bold'>Property Details</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='modal-body p-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <h3 className='font-semibold mb-4'>Basic Information</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>Address</p>
                  <p className='font-medium'>{property.address}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Property Type</p>
                  <p className='font-medium'>
                    {property.property_type || "N/A"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Purchase Date</p>
                  <p className='font-medium'>
                    {property.purchase_date
                      ? new Date(property.purchase_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Purchase Price</p>
                  <p className='font-medium'>
                    {property.purchase_price
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(property.purchase_price)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Property Details</h3>
              <div className='space-y-3'>
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
                  <p className='text-sm text-gray-500'>Floors</p>
                  <p className='font-medium'>{property.num_floors || "N/A"}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Property Type</p>
                  <p className='font-medium'>
                    {property.is_commercial ? "Commercial" : "Residential"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {property.is_hoa && (
            <div className='mt-6'>
              <h3 className='font-semibold mb-4'>HOA Information</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm text-gray-500'>HOA Fee</p>
                  <p className='font-medium'>
                    {property.hoa_fee
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(property.hoa_fee)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
