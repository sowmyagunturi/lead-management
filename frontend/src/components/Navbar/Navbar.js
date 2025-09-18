import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Redirect to login if user is null
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("https://lead-management-backend-6ihr.onrender.com/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null); // Clear context
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Try again!");
    }
  };

  if (!user) return null; // Prevents Navbar flash before redirect

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <h1 className="navbar-title">Hi {user.name}</h1>
        <p className="navbar-subtitle">Welcome to Lead Management System!</p>
      </div>
      <div className="navbar-right">
        <button className="navbar-logout-btn" onClick={() => navigate("/create-lead")}>
          Create
        </button>
        <button className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
