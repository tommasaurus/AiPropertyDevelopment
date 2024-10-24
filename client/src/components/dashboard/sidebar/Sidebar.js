import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  Pin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import dwellexLogo from "../../../images/dwellexLogo.png";
import tabLogo from "../../../images/tabLogo.png";

const Sidebar = () => {
  const [isPinned, setPinned] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clear any session storage data if used
    sessionStorage.clear();

    // Clear any cookies if used for authentication
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Redirect to login page
    navigate("/");
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      active: window.location.pathname === "/dashboard",
    },
    {
      icon: Building2,
      label: "Properties",
      path: "/properties",
      active: window.location.pathname === "/properties",
    },
    {
      icon: Calendar,
      label: "Calendar",
      path: "/calendar",
      active: window.location.pathname === "/calendar",
    },
    {
      icon: UserCircle,
      label: "Tenants",
      path: "/tenants",
      active: window.location.pathname === "/tenants",
    },
  ];

  const bottomNavItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      active: window.location.pathname === "/settings",
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/help",
      active: window.location.pathname === "/help",
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout, // Updated to use the logout handler
    },
  ];

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const togglePin = () => {
    setPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const handleNavigation = (path, action) => {
    if (action) {
      action();
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    // Only apply to dashboard pages
    if (window.location.pathname.startsWith("/dashboard")) {
      document.body.classList.toggle("dashboard-sidebar-expanded", isExpanded);
      return () => {
        document.body.classList.remove("dashboard-sidebar-expanded");
      };
    }
  }, [isExpanded]);

  const renderNavItem = (item, index) => {
    const Icon = item.icon;
    return (
      <button
        key={index}
        className={`nav-item ${item.active ? "active" : ""}`}
        onClick={() => handleNavigation(item.path, item.action)}
        title={!isExpanded ? item.label : ""}
      >
        <div className='nav-item-content'>
          <Icon size={24} />
          <span className='nav-label'>{item.label}</span>
        </div>
      </button>
    );
  };

  return (
    <aside
      className={`dashboard-sidebar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='sidebar-header'>
        <div className='logo-container'>
          <img src={tabLogo} className='tab-logo' alt='Tab Logo' />
          <img src={dwellexLogo} className='logo' alt='Dwellex Logo' />
        </div>
        <button
          className={`pin-button ${isPinned ? "pinned" : ""}`}
          onClick={togglePin}
        >
          <Pin size={16} />
        </button>
      </div>

      <nav className='sidebar-nav'>
        <div className='nav-section'>{navItems.map(renderNavItem)}</div>
        <div className='nav-section bottom'>
          {bottomNavItems.map(renderNavItem)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
