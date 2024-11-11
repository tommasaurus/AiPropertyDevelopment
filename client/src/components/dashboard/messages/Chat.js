import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import "./Chat.css";
import api from "../../../services/api";
import { toast } from "react-toastify";
import botAvatar from '../../../assets/img/SpaceifyBot.webp';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") {
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat/copilot", { message: input });
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="modern-chat-container">
      <div className="modern-chat-header">
        <h1>Spaceify Assistant</h1>
        <div className="header-line"></div>
      </div>
      <div className="modern-chat-history" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`modern-message ${msg.sender}-container`}>
            <div className="message-avatar">
              {msg.sender === 'bot' && <img src={botAvatar} alt="Spaceify Bot" />}
            </div>
            <div className="message-content">
              <div className={`message-text ${msg.sender}`}>
                {msg.text}
              </div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="modern-message bot-container">
            <div className="message-avatar">
              <img src={botAvatar} alt="Spaceify Bot" />
            </div>
            <div className="message-content">
              <div className="message-text bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="modern-chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={isTyping || input.trim() === ""}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;