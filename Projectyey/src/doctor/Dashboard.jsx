import React from "react";
import './dashboard.css';
import Nav from '../components/NavNurseDentist';
import { Link, useLocation } from 'react-router-dom';

const DocDashboard = () => {
  const location = useLocation();
  return (
    <><Nav />    
        <div className="dashboard">
      {/* Appointments Section */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="icon-appointments" /> Appointments
          </h3>
          <button className="add-button">+</button>
        </div>
        <div className="card">
          <div className="card-item">
            <h2>0</h2>
            <p>Today</p>
            <i className="icon-view" />
          </div>
          <div className="card-item">
            <h2>0</h2>
            <p>Upcoming</p>
            <i className="icon-arrow" />
          </div>
        </div>
        {/* <button className="calendar-button">View Device Calendar
        
        </button> */}
        <Link
      to="/CalendarSchedule"
      className={`calendar-button ${location.pathname === "/CalendarSchedule" ? "font-bold" : ""}`}
    >
      View Device Calendar
    </Link>
      </div>

      {/* Patients Section */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="icon-patients" /> Patients
          </h3>
          <button className="add-button">+</button>
        </div>
        <div className="card">
          <div className="card-item">
            <h2>1</h2>
            <p>Total Patients</p>
            <i className="icon-view" />
          </div>
          <div className="card-item">
            <h2>0</h2>
            <p>Total Patient for Re-call</p>
            <i className="icon-arrow" />
          </div>
          <div className="card-item">
            <h2>0</h2>
            <p>Upcoming Birthdays</p>
            <i className="icon-birthday" />
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default DocDashboard;
