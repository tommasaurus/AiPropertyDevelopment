import React, { useState } from "react";
import {
  Upload,
  Building2,
  DollarSign,
  Users,
  Wallet,
  Building,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import TopNavigation from "../../TopNavigation/TopNavigation";
import Chat from "../../chatBot/Chat";
import "./emptyDashboard.css";

const EmptyDashboard = () => {
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());

  const handleAddProperty = () => {
    navigate("/dashboard/properties");
    sessionStorage.setItem("pendingAction", "addProperty");
  };

  return (
    <div className='empty-dashboard-layout'>
      <Sidebar />
      <TopNavigation />
      <Chat />

      <main className='empty-dashboard-main'>
        <div className='content-container'>
          <div className='welcome-section'>
            <div className='welcome-message'>
              <h1>Welcome to Your Dashboard</h1>
              <p>
                Get started by adding your first property to unlock powerful
                management features.
              </p>
              <button
                onClick={handleAddProperty}
                className='add-property-button'
              >
                <PlusCircle className='button-icon' />
                Add Your First Property
              </button>
            </div>

            <div className='features-grid'>
              <div className='feature-card'>
                <DollarSign className='feature-icon' />
                <h3>Financial Tracking</h3>
                <p>
                  Monitor revenue, expenses, and profitability for each property
                </p>
              </div>

              <div className='feature-card'>
                <Users className='feature-icon' />
                <h3>Tenant Management</h3>
                <p>Efficiently manage tenants, leases, and communications</p>
              </div>

              <div className='feature-card'>
                <Wallet className='feature-icon' />
                <h3>Payment Processing</h3>
                <p>Handle rent collection and expense payments seamlessly</p>
              </div>

              <div className='feature-card'>
                <Building className='feature-icon' />
                <h3>Property Insights</h3>
                <p>Get detailed analytics and performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmptyDashboard;
