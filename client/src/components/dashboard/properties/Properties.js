import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import api from "../../../services/api";
import dwellexLogo from "../../../images/dwellexLogo.png";
import "./Properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const businessName = "Jason"; // Temporary hardcoded name, replace if needed

  useEffect(() => {
    // Fetch properties from API
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };
  
    // Set initial greeting
    updateGreeting();
  
    // Update greeting every minute
    const timer = setInterval(updateGreeting, 60000);
  
    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar logo={dwellexLogo} />

      <main className="dashboard-main">
        {/* Greeting Section */}
        <div className="greeting-section">
          <h1 className="greeting-title">
            {greeting} {businessName}
          </h1>
          <p className="greeting-date">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Properties Section */}
        <div className="properties-list">
          <h2 className="properties-title">Properties</h2>
          {properties.length > 0 ? (
            <ul className="properties-items">
              {properties.map((property) => (
                <li key={property.id} className="property-item">
                  <h3>{property.name}</h3>
                  <p>{property.address}</p>
                  <p>{property.city}, {property.state} {property.zipCode}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No properties available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Properties;
