import React from "react";

const Sidebar = ({ onNavigate }) => {
    return (
        <aside className="dashboard-sidebar">
            <nav>
                <ul>
                    <li onClick={() => onNavigate("userlist")}>All user</li>
                    <li onClick={() => onNavigate("activity")}>Activity Admin</li>
                    <li onClick={() => onNavigate("promo-admin")}>Promo Admin</li>
                    <li onClick={() => onNavigate("category")}>Category Admin</li>
                    <li onClick={() => onNavigate("banners")}>List Banners</li>
                    <li onClick={() => onNavigate("transactions")}>All User Transactions</li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
