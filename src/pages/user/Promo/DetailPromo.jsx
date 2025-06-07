import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailPromo.css";
import Navbar from "../../../components/Navbar";

const DetailPromo = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromoDetail = async () => {
    try {
      const res = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promo/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );

      if (res.data && res.data.data) {
        setPromo(res.data.data);
      } else {
        throw new Error("Promo data is invalid");
      }
    } catch (err) {
      console.error("Error fetching promo detail:", err);
      setError("Gagal memuat detail promo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoDetail();
  }, [id]);

  if (loading) return <p className="loading">Memuat detail promo...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
    <Navbar/>
    <div className="detail-promo-page">
      <h1 className="detail-title">{promo.title}</h1>
      <img
        src={promo.imageUrl || "/default-image.jpg"}
        alt={promo.title}
        className="detail-image"
      />
      <div className="detail-content">
        <p><strong>Deskripsi:</strong> {promo.description}</p>
        <p><strong>Syarat & Ketentuan:</strong> {promo.terms_condition}</p>
        <p><strong>Kode Promo:</strong> {promo.promo_code}</p>
        <p><strong>Diskon:</strong> Rp {promo.promo_discount_price.toLocaleString()}</p>
        <p><strong>Minimal Transaksi:</strong> Rp {promo.minimum_claim_price.toLocaleString()}</p>
        <p className="created-at">
          Dibuat pada: {new Date(promo.createdAt).toLocaleString()}
        </p>
      </div>

      <Link to="/promo" className="back-link">← Kembali ke Promo</Link>
    </div>
    </>
  );
};

export default DetailPromo;
