import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, loginWithGoogle } from "../../services/login";
import "./clientLogin.css";
import logo from "../../assets/img/logo.png";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const xPercent = ((clientX - windowWidth / 2) / windowWidth) * 100;
      const yPercent = ((clientY - windowHeight / 2) / windowHeight) * 100;

      const gradientElement = document.querySelector(".gradient-bg");
      if (gradientElement) {
        gradientElement.classList.add("moving");
        gradientElement.style.backgroundPosition = `${50 + xPercent}% ${
          50 + yPercent
        }%`;
      }
    };

    const handleMouseLeave = () => {
      const gradientElement = document.querySelector(".gradient-bg");
      if (gradientElement) {
        gradientElement.style.backgroundPosition = "50% 50%";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);

      if (rememberMe) {
        localStorage.setItem("remember_user", email);
      } else {
        localStorage.removeItem("remember_user");
      }

      setTimeout(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
          navigate("/dashboard", { replace: true });
        } else {
          setError("Authentication failed");
        }
      }, 100);
    } catch (error) {
      setError(error.response?.data?.detail || "Unable to sign in.");
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  useEffect(() => {
    const rememberedUser = localStorage.getItem("remember_user");
    if (rememberedUser) {
      setEmail(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="gradient-bg"></div>
      <div className="white-overlay"></div>

      <nav className="login-page-navbar">
        <div className="login-page-navbar-container">
          <Link to="/" className="login-page-logo">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
      </nav>

      <div className="login-card">
        <h1 className="title">Sign in to your account</h1>

        <button onClick={handleGoogleLogin} className="google-button">
          <svg
            className="google-icon"
            width="18"
            height="18"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>or sign in with username</span>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label className="label">USERNAME</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-header">
              <label className="label">PASSWORD</label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="custom-checkbox"
              />
              <span className="checkbox-text">Remember me on this device</span>
            </label>
          </div>

          <button type="submit" className="sign-in-button">
            Sign in
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
          <p>
            By signing in, you agree to our{" "}
            <a href="/privacy-policy">Privacy Policy</a> and{" "}
            <a href="/terms-conditions">Terms & Conditions</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
