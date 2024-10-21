// ClientLogin.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../../services/login";
import "./clientLogin.css";
import dwellexLogo from "../../logo/dwellexLogo.png";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      console.log("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className='client-login-container'>
      <div className='login-card'>
        <img src={dwellexLogo} alt='Dwellex Logo' className='logo' />
        <h2>WELCOME BACK!</h2>
        <p>To continue, log in to Dwellex</p>
        <button onClick={handleGoogleLogin} className='btn btn-google-login'>
          <img
            src='/path-to-google-icon.png'
            alt='Google Icon'
            className='google-icon'
          />
          Continue with Google
        </button>
        <div className='separator'>
          <span>or</span>
        </div>
        <form onSubmit={handleLogin} className='login-form'>
          <input
            type='email'
            placeholder='Email Address *'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password *'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit' className='btn btn-login'>
            Sign In
          </button>
        </form>
        <Link to='/signup' className='btn btn-signup'>
          Sign Up
        </Link>
        <Link to='/forgot-password' className='forgot-password'>
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default ClientLogin;
