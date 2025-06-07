import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = "/fallback-image.png"; // Tempatkan file ini di folder public/

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );

        const data = response?.data;

        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setError("Data format tidak valid dari API.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal memuat data kategori. Silakan coba lagi nanti.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h1 className="category-title">Explore Categories</h1>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <Link to={`/detail-category/${category.id}`} className="category-link">
                <img
                  src={category.imageUrl || fallbackImage}
                  alt={category.name || "Unnamed Category"}
                  className="category-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <p className="category-name">{category.name || "Unnamed Category"}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Category;
