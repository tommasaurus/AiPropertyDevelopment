import React from "react";
import "./FeaturesSection.css";
import CalendarVideo from "../../assets/videos/SpaceifyCalendar.mp4";
import UploadLeasePart1 from "../../assets/videos/SpaceifyUploadLeasePart1.mov";
import UploadLeasePart2 from "../../assets/videos/SpaceifyUploadLeasePart2.mov";
import ChatBotVideo from "../../assets/videos/SpaceifyAstor.mp4";

const FeaturesSection = () => {
  return (
    <section className='featuressection-features-section'>
      {/* New title section */}
      <div className='hero-top-section-cap'>
        <h1 className='animated-title'>
          {"Everything you need".split(" ").map((word, index) => (
            <React.Fragment key={index}>
              <span
                className='word'
                style={{
                  animationDelay: `${1.35 + index * 0.3}s`,
                }}
              >
                {word}
              </span>{" "}
            </React.Fragment>
          ))}
        </h1>
        <h2 className='subtitle-static'>
          From automated receipt-to-transaction mapping to conversing with your
          financials and consolidating all your files
        </h2>
      </div>

      {/* Upload Lease Part 1 */}
      <div className='featuressection-feature-row'>
        <div className='featuressection-feature-video-container'>
          <video
            className='featuressection-feature-video'
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={UploadLeasePart1} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='featuressection-feature-content'>
          <h2 className='featuressection-feature-title'>Upload A Document</h2>
          <p className='featuressection-feature-description'>
            Upload any document - from leases and contracts to invoices and
            receipts - and let our AI instantly extract and organize all the
            important information
          </p>
        </div>
      </div>

      {/* Upload Lease Part 2 */}
      <div className='featuressection-feature-row featuressection-reverse'>
        <div className='featuressection-feature-video-container'>
          <video
            className='featuressection-feature-video'
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={UploadLeasePart2} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='featuressection-feature-content'>
          <h2 className='featuressection-feature-title'>
            Get An Analysis Instantly
          </h2>
          <p className='featuressection-feature-description'>
            Watch as our AI analyzes your lease documents in real-time,
            extracting key information and providing detailed insights about
            terms, conditions, and important dates.
          </p>
        </div>
      </div>

      {/* Calendar Video */}
      <div className='featuressection-feature-row'>
        <div className='featuressection-feature-video-container'>
          <video
            className='featuressection-feature-video'
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={CalendarVideo} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='featuressection-feature-content'>
          <h2 className='featuressection-feature-title'>
            Smart Calendar Management
          </h2>
          <p className='featuressection-feature-description'>
            Never miss a deadline with our AI-powered calendar that
            automatically tracks and reminds you of important dates from all
            your documents.
          </p>
        </div>
      </div>

      {/* ChatBot Video */}
      <div className='featuressection-feature-row featuressection-reverse'>
        <div className='featuressection-feature-video-container'>
          <video
            className='featuressection-feature-video'
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={ChatBotVideo} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className='featuressection-feature-content'>
          <h2 className='featuressection-feature-title'>
            AI Property Assistant
          </h2>
          <p className='featuressection-feature-description'>
            Get instant answers about anything in your account, from property
            details to document information, with our intelligent AI assistant.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
