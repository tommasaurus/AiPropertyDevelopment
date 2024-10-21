import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./component/navbarFooter/navbarFooter";
import ClientLogin from './component/clientLogin/clientLogin';
import Frontpage from "./component/frontpage/frontpage";
import ClientSignup from './component/clientSignup/clientSignup';
import Dashboard from './component/dashboard/Dashboard'; // Import the Dashboard
import RequireAuth from './component/RequireAuth'; // Import RequireAuth

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        
        {/* Define routes for different paths */}
        <Routes>
          <Route path="/" element={<Frontpage />} />
          <Route path="/client" element={<ClientLogin />} />
          <Route path="/signup" element={<ClientSignup />} />
          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
