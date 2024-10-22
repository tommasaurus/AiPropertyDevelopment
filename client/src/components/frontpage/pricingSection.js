import React from "react";

const PricingSection = () => {
  return (
    <div className='pricing-container'>
      <div className='pricing-grid'>
        <div className='pricing-card'>
          <div className='plan-label'>Basic Plan</div>
          <div className='price-container'>
            <span className='price-text'>Free</span>
            <span className='duration'>/7 days</span>
            <span className='plus'>+</span>
            <span className='price-amount'>$14.99</span>
            <span className='period'>/mo</span>
          </div>
          <div className='billing-text'>Billed Monthly</div>
          <p className='plan-description'>
            Get all current features with the basic plan, and kickstart your
            journey with a 7-day free trial! Pricing starts at 14.99 per month
            for the first 15 properties, with a $0.99 charge for each additional
            property. Experience the full power of Propaya and elevate your
            property management game!
          </p>
          <ul className='feature-list'>
            <li>My Properties Data Page</li>
            <li>Lease PDF to Data Extraction</li>
            <li>Automated Calendar</li>
            <li>Automated Expense Report</li>
            <li>More Features to Come!</li>
          </ul>
          <div className='additional-info'>
            $0.99 per month extra for each property after the first 15
          </div>
          <button className='pricing-button'>Get Started For Free!</button>
        </div>

        <div className='pricing-card'>
          <div className='plan-label'>Enterprise Plan</div>
          <div className='enterprise-title'>
            A <span className='highlight'>Custom</span> Plan to
            <br />
            Suit Your Needs
          </div>
          <p className='plan-description'>
            Have a team of property managers that work collaboratively? Need a
            custom feature to boost your efficiency and streamline your
            workflow? Contact us directly and our team will find a solution that
            works for you! Prices will vary depending on services provided.
          </p>
          <ul className='feature-list'>
            <li>My Properties Data Page</li>
            <li>Lease PDF to Data Extraction</li>
            <li>Automated Calendar</li>
            <li>Automated Expense Report</li>
            <li>More Features to Come!</li>
            <li>Ideal for Teams of Property Managers or Realtors</li>
            <li>Flexible Plans and Custom Features Tailored to Your Needs</li>
          </ul>
          <button className='pricing-button'>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
