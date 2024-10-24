import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./frontpage.css";
import PricingSection from "./pricingSection";
import ContactSection from "./contactSection";
import frontpage from "../../images/frontpage.png";

const Frontpage = () => {
  const navigate = useNavigate(); // Add this hook

  const handleTryForFree = () => {
    navigate("/signup");
  };

  return (
    <div className='page-container'>
      <div className='hero-container'>
        <div className='hero-content'>
          <div className='hero-top-section'>
            <h1>AI-Powered Property Management</h1>
            <h2>Simplify Operations & Maximize Profit</h2>
            <div className='button-container'>
              <button className='tff-button' onClick={handleTryForFree}>
                Try for free
              </button>
              <span className='trial-text'>Free 7-day trial</span>
            </div>
            <div className='property-types-container'>
              <div className='list-block'>
                <div className='list'>
                  <div className='icon'>
                    <img
                      src='https://cdn-jjhdp.nitrocdn.com/bCNBVbTheHNXGCJUfbFIUsfDTeGMjDFk/assets/images/source/rev-9602161/innago.com/wp-content/uploads/2021/04/residential-properties.svg'
                      alt='Residential Properties'
                      width='64'
                      height='64'
                    />
                  </div>
                  <p className='title'>
                    Residential
                    <br />
                    Properties
                  </p>
                </div>
                <div className='list'>
                  <div className='icon'>
                    <img
                      src='https://cdn-jjhdp.nitrocdn.com/bCNBVbTheHNXGCJUfbFIUsfDTeGMjDFk/assets/images/source/rev-9602161/innago.com/wp-content/uploads/2021/04/commercial-properties.svg'
                      alt='Commercial Properties'
                      width='64'
                      height='64'
                    />
                  </div>
                  <p className='title'>
                    Commercial
                    <br />
                    Properties
                  </p>
                </div>
                <div className='list'>
                  <div className='icon'>
                    <img
                      src='https://cdn-jjhdp.nitrocdn.com/bCNBVbTheHNXGCJUfbFIUsfDTeGMjDFk/assets/images/source/rev-9602161/innago.com/wp-content/uploads/2021/04/Student-housing.svg'
                      alt='Student Housing'
                      width='64'
                      height='64'
                    />
                  </div>
                  <p className='title'>
                    Student
                    <br />
                    Housing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='dashboard-preview'>
        <img
          src={frontpage}
          alt='ProhostAI Dashboard Interface'
          className='dashboard-image'
        />
      </div>
      <PricingSection />
      <ContactSection />
    </div>
  );
};

export default Frontpage;
