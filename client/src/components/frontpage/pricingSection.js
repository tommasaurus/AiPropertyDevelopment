import React from "react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handleTryForFree = () => {
    navigate("/login");
  };

  const handleTalkToFounders = () => {
    window.open("https://cal.com/ronish-dua-wufnm8", "_blank");
  };

  return (
    <div className="hero-container">
      <div className="hero-content-centered">
        <h1 className="hero-title">Stress free by spaceify.</h1>
        <p className="hero-description">
          AI-Powered platform for your entire portfolio. Simplify Operations &
          Maximize Profit.
        </p>
        <div className="hero-buttons">
          <button className="tff-button hollow" onClick={handleTalkToFounders}>
            Talk to founders
          </button>
          <button className="tff-button" onClick={handleTryForFree}>
            Try it for free
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
