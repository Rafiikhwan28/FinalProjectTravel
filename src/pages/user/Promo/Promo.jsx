import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Promo.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const Promo = () => {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getPromoList = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      const promoData = response?.data?.data || [];
      setPromos(promoData);
    } catch (err) {
      console.error("Error fetching promo data:", err);
      setError("Gagal mengambil data promo. Coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPromoList();
  }, []);

  if (isLoading) return <p className="loading">Sedang memuat promo...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
    <Navbar/>
    <div className="promo-page">
      <h1 className="promo-title">Promo Spesial untuk Anda</h1>

      {promos.length === 0 ? (
        <p className="no-data">Belum ada promo tersedia.</p>
      ) : (
        <div className="promo-grid">
          {promos.map((promo) => (
            <div key={promo.id} className="promo-item">
              <Link to={`/detail-promo/${promo.id}`} className="promo-link">
                <img
                  src={promo.imageUrl || "/default-image.jpg"}
                  alt={promo.title || "Promo"}
                  className="promo-image"
                />
                <h3 className="promo-item-title">{promo.title}</h3>
                <p className="promo-discount">
                  Diskon {promo.discountPercentage || 0}%
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Promo;
