import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./DetailCategory.css";

const DetailCategory = () => {
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const getDetailCategory = async () => {
    try {
      const res = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/category/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      if (res.data && res.data.data) {
        setCategory(res.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch category details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailCategory();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  // Encode nama category untuk URL Google Maps tanpa API key
  const mapQuery = encodeURIComponent(category.name || "");

  return (
    <div>
      <Navbar />
      <div className="detail-category-container">
        <h1 className="detail-category-title">Detail Category</h1>
        {category.imageUrl && (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="detail-category-image"
          />
        )}
        <h2 className="detail-category-name">{category.name}</h2>

        {/* Embed Google Map tanpa API Key */}
        <div className="detail-category-map-container">
          <iframe
            title="category-map"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "12px", marginTop: "1.5rem" }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default DetailCategory;
