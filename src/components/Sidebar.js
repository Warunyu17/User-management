import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo-container">
          <img src="/pictures/logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="sidebar-heading">Overview</div>
        <nav>
          <NavLink to="/user" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src="/pictures/user.png" alt="User" className="icon" />
            <span>User</span>
          </NavLink>
          <NavLink to="/setting" className={({ isActive }) => (isActive ? "active" : "")}>
            <img src="/pictures/setting.png" alt="Setting" className="icon" />
            <span>Setting</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
}
