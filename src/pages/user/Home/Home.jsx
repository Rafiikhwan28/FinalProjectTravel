// Home.js
import React from "react";
import Navbar from "../../../components/Navbar";
import './Home.css'
const Home = () => {
  return (
    <div>
        <Navbar/>
      <header className="home-header">
        <div className="header-content">
          <h1>Selamat Datang di HappyTraveling</h1>
          <p>
            Temukan destinasi impianmu, promo menarik, dan rencanakan liburan dengan mudah!
          </p>
          <a href="/page-destinasi" className="btn-explore">Jelajahi Sekarang</a>
        </div>
      </header>

      <section className="features-section">
        <h2>Rekomendasi destinasi</h2>
        <div className="features-container">
          <div className="feature-card">
            <img src="/icons/support.png" alt="24/7 Support" />
            <h3>Destinasi</h3>
            <p>Kami siap membantu Anda kapan saja, di mana saja.</p>
          </div>
          <div className="feature-card">
            <img src="/icons/promo.png" alt="Best Deals" />
            <h3>Destinasi viral</h3>
            <p>Dapatkan penawaran terbaik untuk liburan Anda.</p>
          </div>
          <div className="feature-card">
            <img src="/icons/destination.png" alt="Top Destinations" />
            <h3>Destinasi Populer</h3>
            <p>Ribuan pilihan tempat wisata dari seluruh dunia.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} HappyTraveling. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
