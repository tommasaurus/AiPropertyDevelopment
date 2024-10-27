import React from "react";
import { useNavigate } from "react-router-dom";
import "./frontpage.css";
import PricingSection from "./pricingSection";
import CapabilitiesSection from "./capabilitiesSection";
import frontpage from "../../images/dashboardPic.png";

const Frontpage = () => {
  const navigate = useNavigate();

  const handleTryForFree = () => {
    navigate("/signup");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <div className='page-container'>
      <div className='hero-container'>
        <div className='hero-content'>
          <div className='hero-top-section'>
            <h1 className='animated-title'>
              {"AI-Powered platform for your entire portfolio"
                .split(" ")
                .map((word, index) => (
                  <React.Fragment key={index}>
                    <span
                      className='word'
                      style={{
                        animationDelay: `${0.1 + index * 0.17}s`,
                      }}
                    >
                      {word}
                    </span>{" "}
                  </React.Fragment>
                ))}
            </h1>
            <h2 className='subtitle'>Simplify Operations & Maximize Profit</h2>
            <div className='button-container'>
              <button className='tff-button' onClick={handleTryForFree}>
                Try for free
              </button>
              <button className='tff-button hollow' onClick={handleLearnMore}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className='dashboard-preview'>
          <img
            src={frontpage}
            alt='Spaceify Dashboard Interface'
            className='dashboard-image'
          />
        </div>
      </div>

      <CapabilitiesSection />

      <PricingSection />
    </div>
  );
};

export default Frontpage;
