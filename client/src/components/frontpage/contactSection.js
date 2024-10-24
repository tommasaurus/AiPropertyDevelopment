import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSending(true);

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwEynB_XHcmCC2e9Kb1w2EVkMx0ZSzEEAyIjf1GFfOBAn3-bgb5sSP8Jm-T2y1aKpWMMw/exec";

    try {
      const url = `${SCRIPT_URL}?nom=${encodeURIComponent(
        formData.name
      )}&email=${encodeURIComponent(
        formData.email
      )}&message=${encodeURIComponent(formData.message)}`;
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error((await response.text()) || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        "There was an error sending your message. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='contact-section'>
      <div className='contact-container'>
        <h2 className='contact-header'>Contact Us</h2>
        <p className='contact-subheader'>We'd love to hear from you!</p>

        <form className='contact-form-container' onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='contact-input'
              placeholder='Your Email'
            />
          </div>

          <div className='form-group'>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              className='contact-input contact-textarea'
              placeholder='Your Message'
              rows='4'
            />
          </div>

          <button type='submit' className='contact-button' disabled={isSending}>
            <Send className='send-icon' size={20} />
            {isSending ? "Sending..." : "Send Message"}
          </button>

          {isSubmitted && (
            <div className='success-message'>Message sent successfully!</div>
          )}

          {submitError && <div className='error-message'>{submitError}</div>}
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
