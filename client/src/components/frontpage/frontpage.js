import React from "react";
import { useNavigate } from "react-router-dom";
import "./frontpage.css";
import PricingSection from "./pricingSection";
import CapabilitiesSection from "./capabilitiesSection";
import FeaturesSection from "./FeaturesSection";
import frontpage from "../../assets/img/dashboardPic.png";

const Frontpage = () => {
  const navigate = useNavigate();

  const handleTryForFree = () => {
    navigate("/signup");
    // navigate("/login");
  };

  const handleTalkToFounders = () => {
    window.open("https://cal.com/ronish-dua-wufnm8", "_blank");
  };

  return (
    <div className="page-container">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-top-section">
            <h1 className="animated-title">
              {"AI-Powered platform for your entire portfolio"
                .split(" ")
                .map((word, index) => (
                  <React.Fragment key={index}>
                    <span
                      className="word"
                      style={{
                        animationDelay: `${0.1 + index * 0.17}s`,
                      }}
                    >
                      {word}
                    </span>{" "}
                  </React.Fragment>
                ))}
            </h1>
            <h2 className="subtitle">Simplify Operations & Maximize Profit</h2>
            <div className="button-container">
              <div className="buttons-row">
                <button
                  className="tff-button hollow"
                  onClick={handleTalkToFounders}
                >
                  Talk to founders
                </button>
                <button className="tff-button" onClick={handleTryForFree}>
                  Try for free
                </button>
              </div>
              <span className="button-subtext">
                Claim $29/mo deal, free during beta.
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-preview-container">
          <div className="dashboard-wrapper">
            <img
              src={frontpage}
              alt="Spaceify Dashboard Interface"
              className="dashboard-image"
            />
          </div>
        </div>
      </div>
      <div id="features">
        <FeaturesSection />
      </div>

      <div id="capabilities">
        <CapabilitiesSection />
      </div>

      <div id="pricing">
        <PricingSection />
      </div>
    </div>
  );
};

export default Frontpage;
