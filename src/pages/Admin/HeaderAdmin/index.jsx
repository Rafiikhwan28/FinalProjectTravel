import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate dari React Router

const HeaderAdmin = ({ onLogout }) => {
    const navigate = useNavigate(); // Mendapatkan fungsi navigate untuk mengarahkan pengguna

    const handleLogout = () => {
        console.log('logout3')
        // Hapus token dan detail user dari localStorage
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/logout",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
          }
        ).then(() =>{
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_details");
          setIsLoggedIn(false);
          setUserDetails(null);
          navigate("/login"); // Arahkan kembali ke halaman login
        }).catch(() =>{
          alert("erorr logout")
        })
      };

    return (
        <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </header>
    );
};

export default HeaderAdmin;
