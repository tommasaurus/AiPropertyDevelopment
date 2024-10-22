import React from "react";
import "./frontpage.css";
import PricingSection from "./pricingSection"; // Add this import at the top

const Frontpage = () => {
  return (
    <div className='hero-container'>
      <div className='hero-content'>
        <h1>AI-Powered Property Management</h1>
        <h2>Simplify Operations & Maximize Profit</h2>
        <button className='cta-button'>Request Demo</button>
        <div className='container'>
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
        <PricingSection />
      </div>
    </div>
  );
};

export default Frontpage;
