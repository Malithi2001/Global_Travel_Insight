import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logout } from "../services/authService.js";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <div
          className="nav-brand"
          onClick={() => navigate(user ? "/" : "/login")}
        >
          <span className="nav-logo">🌐</span>
          <div className="nav-brand-text">
            <span className="nav-title">Global Travel Insight</span>
            <span className="nav-subtitle">Travel smarter, safer.</span>
          </div>
        </div>

        <nav className="nav-links">
          {user && (
            <>
              <NavLink to="/" className="nav-link">
                Search
              </NavLink>
              <NavLink to="/history" className="nav-link">
                History
              </NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin" className="nav-link">
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user-email">{user.email}</span>
              <button className="nav-btn nav-btn-secondary" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="nav-btn nav-btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;