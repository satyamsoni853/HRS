import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">H</div>
        <span className="logo-text">
          HR<span className="text-primary">Master</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Users size={20} />
          <span>All Employees</span>
        </NavLink>
        <NavLink
          to="/add-employee"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <UserPlus size={20} />
          <span>Add Employee</span>
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={20} style={{ transform: "rotate(90deg)" }} />
          <span>Attendance</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="nav-item text-danger">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
