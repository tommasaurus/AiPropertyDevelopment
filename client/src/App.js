import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./components/navbarFooter/navbarFooter";
import ClientLogin from "./components/clientLogin/clientLogin";
import Frontpage from "./components/frontpage/frontpage";
import ClientSignup from "./components/clientSignup/clientSignup";
import Dashboard from "./components/dashboard/Dashboard"; // Import the Dashboard
import RequireAuth from "./components/RequireAuth"; // Import RequireAuth

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />

        {/* Define routes for different paths */}
        <Routes>
          <Route path='/' element={<Frontpage />} />
          <Route path='/client' element={<ClientLogin />} />
          <Route path='/signup' element={<ClientSignup />} />
          {/* Protected dashboard route */}
          <Route
            path='/dashboard'
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
