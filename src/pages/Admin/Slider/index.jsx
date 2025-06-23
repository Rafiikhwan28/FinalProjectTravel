import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import './Slider.css';

const Sidebar = ({ onNavigate, activePage, isOpen }) => {
  const menuItems = [
    { key: "userlist", label: "All User", icon: <PeopleAltIcon /> },
    { key: "activity", label: "Activity Admin", icon: <EventNoteIcon /> },
    { key: "promo-admin", label: "Promo Admin", icon: <LocalOfferIcon /> },
    { key: "category", label: "Category Admin", icon: <CategoryIcon /> },
    { key: "banners", label: "List Banners", icon: <ImageIcon /> },
    { key: "transactions", label: "All Transactions", icon: <ReceiptLongIcon /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h2>Admin Menu</h2>
      <List component="nav" disablePadding>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={activePage === item.key ? "active" : ""}
          >
            <ListItemIcon sx={{ color: activePage === item.key ? "#0b132b" : "#fff" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 15 }} />
          </ListItemButton>
        ))}
      </List>
    </aside>
  );
};

export default Sidebar;
