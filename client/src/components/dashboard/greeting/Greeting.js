// src/components/dashboard/greeting/Greeting.js

import React, { useEffect, useState } from "react";
import './Greeting.css';

const Greeting = () => {
    const [greeting, setGreeting] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    const businessName = "Jason";

    // Update greeting based on time of day
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

        updateGreeting(); // Initial call to set greeting

        const timer = setInterval(() => {
            updateGreeting();
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    return (
        // Greeting Section
        <div className="greeting-section">
            <h1 className="greeting-title">
                {greeting}, {businessName}
            </h1>
            <p className="greeting-date">
                {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </p>
        </div>
    );
};

export default Greeting;
