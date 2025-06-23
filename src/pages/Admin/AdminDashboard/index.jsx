import React, { useState } from "react";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as LocalOfferIcon,
  Image as ImageIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

import HeaderAdmin from "../HeaderAdmin";
import ActivityAdmin from "../ActivityAdmin";
import CategoryAdmin from "../CategoryAdmin";
import TransaksiAllUser from "../Transaksi";
import ListBaner from "../BanerAdmin";
import UserList from "../UserList";
import PromoAdmin from "../PromoAdmin";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("activity");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_details");
    window.location.href = "/";
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { key: "activity", label: "Aktivitas", icon: <DashboardIcon /> },
    { key: "userlist", label: "Users", icon: <PeopleIcon /> },
    { key: "category", label: "Kategori", icon: <CategoryIcon /> },
    { key: "promo-admin", label: "Promo", icon: <LocalOfferIcon /> },
    { key: "banners", label: "Banner", icon: <ImageIcon /> },
    { key: "transactions", label: "Transaksi", icon: <ShoppingCartIcon /> },
  ];

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <HeaderAdmin toggleSidebar={toggleSidebar} />

      <div className="dashboard-body">
        {/* SIDEBAR */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <h2>Admin Menu</h2>

          <ul className="menu-list">
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={activePage === item.key ? "active" : ""}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            className="logout-btn"
            fullWidth
          >
            Logout
          </Button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-content">
          {activePage === "activity" && <ActivityAdmin />}
          {activePage === "userlist" && <UserList />}
          {activePage === "category" && <CategoryAdmin />}
          {activePage === "promo-admin" && <PromoAdmin />}
          {activePage === "banners" && <ListBaner />}
          {activePage === "transactions" && <TransaksiAllUser />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
