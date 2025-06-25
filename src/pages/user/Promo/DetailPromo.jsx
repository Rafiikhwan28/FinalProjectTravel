import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import "./DetailPromo.css";
import Footer from "../../../components/Footer";

const DetailPromo = () => {
  const { id } = useParams();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPromoDetail = async () => {
      try {
        const res = await axios.get(`${API_URL}/promo/${id}`, {
          headers: { apiKey: API_KEY },
        });
        if (res.data?.data) {
          setPromo(res.data.data);
        } else {
          throw new Error("Promo data is invalid");
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat detail promo.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromoDetail();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="detail-container">
        <div className="image-section">
          <img
            src={promo.imageUrl || "/default-image.jpg"}
            alt={promo.title}
            className="promo-image"
          />
        </div>

        <div className="info-section">
          <h1 className="promo-title">{promo.title}</h1>
          <p className="promo-description">{promo.description}</p>

          <div className="promo-info-grid">
            <div><span className="badge">🏷️ Kode Promo:</span> <strong>{promo.promo_code}</strong></div>
            <div><span className="badge">💸 Diskon:</span> <strong>Rp {promo.promo_discount_price.toLocaleString()}</strong></div>
            <div><span className="badge">🛒 Min. Transaksi:</span> Rp {promo.minimum_claim_price.toLocaleString()}</div>
            <div><span className="badge">📄 S&K:</span> {promo.terms_condition}</div>
          </div>

          <button
            className="btn-add"
            disabled={addingToCart}
          >
            {addingToCart ? (
              <div className="loading-spinner"></div>
            ) : (
              "🛒 Tambah ke Keranjang"
            )}
          </button>

          <Link to="/promo" className="back-link">← Kembali ke Promo</Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DetailPromo;
