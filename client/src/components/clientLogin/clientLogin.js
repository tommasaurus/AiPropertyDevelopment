import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, loginWithGoogle } from "../../services/login";
import "./clientLogin.css";
import dwellexLogo from "../../logo/dwellexLogo.png";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className='modern-login-container'>
      <div className='modern-login-card'>
        <img src={dwellexLogo} alt='Dwellex Logo' className='modern-logo' />
        <p className='logo-subtitle'>
          <strong>Welcome Back!</strong>
        </p>

        <button onClick={handleGoogleLogin} className='btn-google-login'>
          <svg
            className='google-icon'
            width='18'
            height='18'
            viewBox='0 0 48 48'
          >
            <path
              fill='#EA4335'
              d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
            />
            <path
              fill='#4285F4'
              d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
            />
            <path
              fill='#FBBC05'
              d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
            />
            <path
              fill='#34A853'
              d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
            />
          </svg>
          Continue with Google
        </button>

        <div className='separator'>
          <span>or</span>
        </div>

        <form onSubmit={handleLogin} className='modern-login-form'>
          <div className='modern-input-group'>
            <label className='input-label'>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='modern-input-group'>
            <label className='input-label'>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='password-toggle'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <button type='submit' className='modern-btn modern-btn-primary'>
            Login
          </button>
        </form>

        <div className='modern-links'>
          <span>
            Don't have an account? <Link to='/signup'> Sign up</Link>
          </span>
          <Link to='/forgot-password'>Forgot your password?</Link>
        </div>

        <div className='privacy-terms'>
          <p>
            By logging in, you agree to our{" "}
            <a href='/privacy-policy'>Privacy Policy</a> and{" "}
            <a href='/terms-conditions'>Terms & Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
