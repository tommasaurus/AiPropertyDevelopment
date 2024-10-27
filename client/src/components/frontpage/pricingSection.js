import React from "react";
import { Check } from "lucide-react";

const PricingSection = () => {
  return (
    <div className='pricing-container'>
      <div className='pricing-header'>
        <h2 className='pricing-title-main'>Simple, Transparent Pricing</h2>
        <p className='pricing-subtitle-main'>
          Choose the perfect plan for your property management needs
        </p>
      </div>

      <div className='pricing-grid'>
        <div className='pricing-card'>
          <h3 className='pricing-title'>Starter</h3>
          <div className='pricing-price'>$14.99</div>
          <div className='pricing-duration'>per month</div>
          <p className='pricing-description'>
            Perfect for individual property managers just getting started
          </p>
          <ul className='feature-list'>
            <li>My Properties Data Page</li>
            <li>Lease PDF to Data Extraction</li>
            <li>Automated Calendar</li>
            <li>Basic Expense Reports</li>
            <li>Email Support</li>
          </ul>
          <button className='pricing-button hollow'>Start Free Trial</button>
        </div>

        <div className='pricing-card popular'>
          <div className='popular-badge'>Popular</div>
          <h3 className='pricing-title'>Professional</h3>
          <div className='pricing-price'>$29.99</div>
          <div className='pricing-duration'>per month</div>
          <p className='pricing-description'>
            Ideal for growing property management businesses
          </p>
          <ul className='feature-list'>
            <li>All Starter Features</li>
            <li>Advanced Analytics</li>
            <li>AI Tenant Chatbot</li>
            <li>Custom Report Builder</li>
            <li>Priority Support</li>
          </ul>
          <button className='pricing-button'>Get Started</button>
        </div>

        <div className='pricing-card'>
          <h3 className='pricing-title'>Enterprise</h3>
          <div className='pricing-price'>Custom</div>
          <div className='pricing-duration'>tailored solutions</div>
          <p className='pricing-description'>
            Custom solutions for large property portfolios
          </p>
          <ul className='feature-list'>
            <li>All Professional Features</li>
            <li>Custom Integrations</li>
            <li>Dedicated Account Manager</li>
            <li>Custom AI Training</li>
            <li>24/7 Phone Support</li>
          </ul>
          <button className='pricing-button hollow'>Contact Sales</button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
