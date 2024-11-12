// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Bell, Search, Upload } from "lucide-react";
import TopNavigation from "./TopNavigation/TopNavigation";
import Sidebar from "./sidebar/Sidebar";
import DashboardMetrics from "./dashboardMetrics/dashboardMetrics";
import EmptyDashboard from "./pages/emptyDashboard/emptyDashboard";
import api from "../../services/api";
import logo from "../../assets/img/logo.png";
import Greeting from "./greeting/Greeting";
import Chat from "./chatBot/Chat";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const response = await api.get("/properties");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector(".dashboard-main");
    const handleSidebarChange = () => {
      if (document.body.classList.contains("dashboard-sidebar-expanded")) {
        mainContent?.classList.add("sidebar-expanded");
      } else {
        mainContent?.classList.remove("sidebar-expanded");
      }
    };

    handleSidebarChange();

    const observer = new MutationObserver(handleSidebarChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleAddProperty = async () => {
    // Store the action in sessionStorage
    sessionStorage.setItem("pendingAction", "addProperty");
    // Navigate to properties page
    navigate("/dashboard/properties");
  };

  const handleUploadDocument = async () => {
    // Store the action in sessionStorage
    sessionStorage.setItem("pendingAction", "uploadDocument");
    // Navigate to properties page
    navigate("/dashboard/properties");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (properties.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className='dashboard-layout'>
      <Sidebar logo={logo} />
      <TopNavigation />
      <Chat />
      <main className='dashboard-main'>
        <div className='art-nouveau-border'>
          <div className='art-nouveau-corner top-left'></div>
          <div className='art-nouveau-corner top-right'></div>
          <div className='art-nouveau-corner bottom-left'></div>
          <div className='art-nouveau-corner bottom-right'></div>
          <div className='header-container'>
            <div className='header-left'>
              <Greeting />
            </div>
            <div className='header-actions'>
              <button
                className='nouveau-button primary'
                onClick={handleAddProperty}
              >
                <PlusCircle className='button-icon' />
                Add Property
              </button>
              <button
                className='nouveau-button secondary'
                onClick={handleUploadDocument}
              >
                <Upload className='button-icon' />
                Upload Document
              </button>
            </div>
          </div>
          <DashboardMetrics properties={properties} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
