import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [logoutHandler, setLogoutHandler] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user_details");

    if (token && user) {
      setIsLoggedIn(true);
      setUserDetails(JSON.parse(user));
    }

    const handleLogout = () => {
      axios
        .get(`${API_URL}/logout`, {
          headers: {
            apiKey: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_details");
          setIsLoggedIn(false);
          setUserDetails(null);
          navigate("/");
        })
        .catch(() => {
          alert("Gagal logout, coba lagi.");
        });
    };

    setLogoutHandler(() => handleLogout);
  }, [navigate]);

  // ================= FETCH CART COUNT =================
  const fetchCartItemCount = async () => {
    if (!TOKEN) return;

    try {
      const response = await axios.get(`${API_URL}/carts`, {
        headers: {
          apiKey: API_KEY,
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const cartItems = response.data?.data || [];
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    } catch (error) {
      console.error("Gagal mengambil data cart:", error);
      setCartItemCount(0); // fallback jika error
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItemCount();
    }
  }, [isLoggedIn]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo-link">
          <img
            src="https://learn.dibimbing.id/logo-dibimbing-blue-512.svg"
            alt="HappyTraveling"
            className="navbar-logo"
          />
        </Link>

        {/* BURGER MENU ICON */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? "✖" : "☰"}
        </button>

        {/* NAVIGATION LINKS */}
        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <ul className="nav-menu">
            <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/category" onClick={() => setIsOpen(false)}>Category</Link></li>
            <li><Link to="/activity" onClick={() => setIsOpen(false)}>Activity</Link></li>
            <li><Link to="/promo" onClick={() => setIsOpen(false)}>Promo</Link></li>
          </ul>

          {/* CART & USER */}
          <div className="nav-actions">
            <Link to="/cart" className="cart-icon" onClick={() => setIsOpen(false)}>
              🛒
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>

            {isLoggedIn ? (
              <div className="user-menu">
                <button className="avatar-btn" onClick={toggleDropdown} aria-label="User Menu">
                  <img
                    src={userDetails?.profilePictureUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    className="avatar-img"
                  />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                    <Link to="/transaksi" onClick={() => setShowDropdown(false)}>Transaksi</Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (logoutHandler) logoutHandler();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-green" onClick={() => setIsOpen(false)}>
                  Masuk
                </Link>
                <Link to="/register" className="btn btn-gray" onClick={() => setIsOpen(false)}>
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
