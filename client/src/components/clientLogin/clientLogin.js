import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../../services/login"; // Import login functions
import "./clientLogin.css"; // Style as needed

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the loginUser function from your services
      await loginUser(email, password);
      console.log("Login successful");
      navigate("/dashboard"); // Redirect to the dashboard or another protected route after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleGoogleLogin = () => {
    // Use the loginWithGoogle function from your services
    loginWithGoogle();
  };

  return (
    <div className="client-login-container">
      <h2>Welcome to Dwellex</h2>
      <p>Please login or sign up to access your client portal</p>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-login">
          Login
        </button>
      </form>

      <div className="login-buttons">
        <button onClick={handleGoogleLogin} className="btn btn-google-login">
          Login with Google
        </button>
        <Link to="/signup" className="btn btn-signup">
          Sign Up
        </Link> {/* Link to the signup page */}
      </div>
    </div>
  );
};

export default ClientLogin;
