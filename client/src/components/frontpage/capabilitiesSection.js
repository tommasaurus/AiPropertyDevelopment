import React from "react";
import { Brain, Clock, GitFork, MessageCircle } from "lucide-react";

const CapabilitiesSection = () => {
  return (
    <div className='capabilities-section'>
      <h2 className='capabilities-title'>Spaceify Capabilities</h2>
      <div className='capabilities-grid'>
        <div className='capability-item'>
          <div className='capability-icon-wrapper'>
            <Brain className='capability-icon' size={24} strokeWidth={1.5} />
          </div>
          <h3>Intelligent Document Extraction</h3>
          <p>
            Automatically extract key information from leases, invoices, and
            other documents. This feature pulls details like payment terms,
            tenant information, and property rules, updating the system in
            real-time to keep records accurate and organized.
          </p>
        </div>

        <div className='capability-item'>
          <div className='capability-icon-wrapper'>
            <Clock className='capability-icon' size={24} strokeWidth={1.5} />
          </div>
          <h3>Automated Calendar & Task Management</h3>
          <p>
            Manage key property tasks with an AI-powered calendar that schedules
            maintenance, rent reminders, and lease renewals. Alerts are sent to
            tenants and managers, ensuring timely updates and streamlined task
            tracking.
          </p>
        </div>

        <div className='capability-item'>
          <div className='capability-icon-wrapper'>
            <GitFork className='capability-icon' size={24} strokeWidth={1.5} />
          </div>
          <h3>Development Roadmap & Compliance Tracker</h3>
          <p>
            Map out development projects and monitor regulatory compliance. The
            AI identifies necessary permits, deadlines, and regulation changes,
            keeping properties compliant and projects on track.
          </p>
        </div>

        <div className='capability-item'>
          <div className='capability-icon-wrapper'>
            <MessageCircle
              className='capability-icon'
              size={24}
              strokeWidth={1.5}
            />
          </div>
          <h3>AI Tenant Chatbot Communicator</h3>
          <p>
            Enhance tenant communication with a 24/7 chatbot that handles
            queries, processes requests, and escalates emergencies. It ensures
            fast response times and keeps property managers focused on
            high-priority tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesSection;
