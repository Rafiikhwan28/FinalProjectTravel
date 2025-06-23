import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* BRAND & DESCRIPTION */}
        <div className="footer-section brand">
          <h2>HappyTraveling</h2>
          <p>Website terbaik untuk menemukan destinasi wisata, promo menarik, dan pengalaman traveling yang seru.</p>
        </div>

        {/* MENU LINKS */}
        <div className="footer-section links">
          <h3>Menu</h3>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/promo">Promo</Link></li>
            <li><Link to="/activity">Aktivitas</Link></li>
            <li><Link to="/category">Kategori</Link></li>
          </ul>
        </div>

        {/* SUPPORT LINKS */}
        <div className="footer-section links">
          <h3>Bantuan</h3>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/kontak">Kontak Kami</Link></li>
            <li><Link to="/kebijakan-privasi">Kebijakan Privasi</Link></li>
            <li><Link to="/syarat-ketentuan">Syarat & Ketentuan</Link></li>
          </ul>
        </div>

        {/* SOCIAL LINKS */}
        <div className="footer-section social">
          <h3>Follow Kami</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} HappyTraveling • All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
