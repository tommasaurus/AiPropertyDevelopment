// src/components/messages/Chat.js

import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import api from "../../../services/api";
import { toast } from "react-toastify";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages are added
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

    try {
      const response = await api.post("/chat/copilot", { message: input });
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Spaceify Assistant</div>
      <div className="chat-history" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-button" aria-label="Send Message">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
