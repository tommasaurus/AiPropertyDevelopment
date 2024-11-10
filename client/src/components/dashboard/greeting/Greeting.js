import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Greeting.css";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting();

    const timer = setInterval(() => {
      updateGreeting();
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get("/users/me");
        // Extract first name from full name
        const firstName = response.data.name
          ? response.data.name.split(" ")[0]
          : "User";
        setUserName(firstName);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      }
    };

    fetchUserName();
  }, []);

  const formatDate = () => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(currentTime);
  };

  return (
    <div className='greeting-container'>
      <div className='greeting-content'>
        <h1 className='greeting-title'>
          {greeting}, {userName}
        </h1>
        <p className='greeting-date'>{formatDate()}</p>
      </div>
    </div>
  );
};

export default Greeting;
