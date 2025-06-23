import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Menu, MenuItem, IconButton, Tooltip } from "@mui/material";
import { Logout, Menu as MenuIcon } from "@mui/icons-material";
import "./HeaderAdmin.css";

const HeaderAdmin = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");

      await axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout", {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("access_token");
      localStorage.removeItem("user_details");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Gagal logout: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <IconButton onClick={toggleSidebar} className="menu-toggle">
          <MenuIcon style={{ color: "#0b132b" }} />
        </IconButton>
        <h1 className="logo">
          Happy<span>Traveling</span> Admin
        </h1>
      </div>

      <div className="profile-area">
        <Tooltip title="Profil Admin">
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar sx={{ bgcolor: "#ffb700", color: "#0b132b" }}>A</Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleLogout}>
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default HeaderAdmin;
