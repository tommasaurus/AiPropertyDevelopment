import React, { useEffect, useState } from "react";
import { PlusCircle, Bell, Search } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";
import DashboardMetrics from "./dashboardMetrics/dashboardMetrics";
import EmptyDashboard from "./emptyDashboard/emptyDashboard";
import api from "../../services/api";
import logo from "../../images/logo.png";
import Greeting from "./greeting/Greeting";
import "./Dashboard.css";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);  
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual API call to get user/business name
  const businessName = "Jason.";

  useEffect(() => {
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

    fetchProperties();
  }, []);

  // Handle sidebar expansion
  useEffect(() => {
    const mainContent = document.querySelector(".dashboard-main");
    const handleSidebarChange = () => {
      if (document.body.classList.contains("dashboard-sidebar-expanded")) {
        mainContent?.classList.add("sidebar-expanded");
      } else {
        mainContent?.classList.remove("sidebar-expanded");
      }
    };

    // Initial check
    handleSidebarChange();

    // Create observer to watch for class changes
    const observer = new MutationObserver(handleSidebarChange);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add proper loading component here
  }

  // If no properties, show empty dashboard
  if (properties.length === 0) {
    return <EmptyDashboard />;
  }

  // Regular dashboard with properties
  return (
    <div className='dashboard-layout'>
      {/* Sidebar with imported logo */}
      <Sidebar logo={logo} />

      <main className='dashboard-main'>
        {/* Greeting Section */}
        <Greeting/>

        {/* Dashboard Metrics */}
        <DashboardMetrics properties={properties} />
      </main>
    </div>
  );
};

export default Dashboard;
