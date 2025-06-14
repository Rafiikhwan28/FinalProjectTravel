import React, { useState } from "react";
import HeaderAdmin from "../HeaderAdmin";
import Sidebar from "../Slider";
import ActivityAdmin from "../ActivityAdmin";
import CategoryAdmin from "../CategoryAdmin";
import TransaksiAllUser from "../Transaksi";
import ListBaner from "../BanerAdmin";
import "./AdminDashboard.css";
import UserList from "../UserList";
import PromoAdmin from "../PromoAdmin";

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("activity");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        alert("You have been logged out.");
        // Redirect to login page
    };

    const handleNavigate = (page) => {
        setActivePage(page);
    };

    return (
        <div className="dashboard-container">
            <HeaderAdmin onLogout={handleLogout} />
            <div className="dashboard-main">
                <Sidebar onNavigate={handleNavigate} />
                <div className="dashboard-content">
                    {activePage === "userlist" && <UserList />}
                    {activePage === "activity" && <ActivityAdmin />}
                    {activePage === "promo-admin" && <PromoAdmin />}
                    {activePage === "category" && <CategoryAdmin />}
                    {activePage === "transactions" && <TransaksiAllUser />}
                    {activePage === "banners" && <ListBaner />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
