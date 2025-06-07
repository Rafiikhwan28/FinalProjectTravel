import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);
  const [userDetails, setUserDetails] = useState(null);
  const [logoutHandler, setLogoutHandler] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user_details");

    if (token && user) {
      setIsLoggedIn(true);
      setUserDetails(JSON.parse(user));
    }

    const handleLogout = () => {
      axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }).then(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_details");
        setIsLoggedIn(false);
        setUserDetails(null);
        navigate("/");
      }).catch(() => {
        alert("Gagal logout, coba lagi.");
      });
    };

    setLogoutHandler(() => handleLogout);
  }, [navigate]);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img
          src="https://learn.dibimbing.id/logo-dibimbing-blue-512.svg"
          alt="Logo HappyTraveling"
          className="navbar-logo"
          onError={(e) => (e.target.src = "/default-logo.png")} // fallback lokal
          />
        </Link>

        <div
          className="menu-icon"
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') toggleMenu(); }}
        >
          {isOpen ? "✖" : "☰"}
        </div>

        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <ul className="nav-menu">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/category" onClick={() => setIsOpen(false)}>Category</Link></li>
            <li><Link to="/activity" onClick={() => setIsOpen(false)}>Activity</Link></li>
            <li><Link to="/promo" onClick={() => setIsOpen(false)}>Promo</Link></li>
          </ul>

          <div className="cart-icon">
            <Link to="/cart">
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="user-dropdown">
              <div className="user-avatar" onClick={toggleDropdown}>
                <img
                  src={userDetails?.profilePictureUrl || "/default-avatar.png"}
                  alt={userDetails?.name || "User"}
                  className="avatar-img"
                />
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                  <button onClick={() => { setShowDropdown(false); if (logoutHandler) logoutHandler(); }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-green">Masuk</Link>
              <Link to="/register" className="btn btn-gray">Daftar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
