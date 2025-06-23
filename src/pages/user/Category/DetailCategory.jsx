import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./DetailCategory.css";
import ActivityByCategory from "../Activity/ActivityByCategoryId";
import Footer from "../../../components/Footer";

const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const DetailCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/category/${id}`, {
          headers: { apiKey: API_KEY },
        });
        setCategory(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data kategori.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  const mapQuery = encodeURIComponent(category.name || "");

  return (
    <div>
      <Navbar />
      <div className="detail-category-container">
        <h1 className="detail-category-title">{category.name}</h1>
        {category.imageUrl && (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="detail-category-image"
          />
        )}

        <div className="detail-category-map-container">
          <iframe
            title="category-map"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "12px", marginTop: "1.5rem" }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          ></iframe>
        </div>
        <ActivityByCategory/>
      </div>
      <Footer/>
    </div>
  );
};

export default DetailCategory;
