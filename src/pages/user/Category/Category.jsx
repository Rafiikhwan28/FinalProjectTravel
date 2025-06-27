import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Category.css";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = "/fallback-image.png";

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

      const data = response?.data?.data || [];
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Gagal memuat kategori. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) return <p className="loading">Sedang memuat kategori...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="category-page">
        <h1 className="category-title">Kategori Destinasi</h1>

        {categories.length === 0 ? (
          <p className="no-data">Belum ada kategori tersedia.</p>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <Link to={`/detail-category/${category.id}`} className="category-link">
                  <img
                    src={category.imageUrl || fallbackImage}
                    alt={category.name || "Kategori"}
                    className="category-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                  <h3 className="category-item-title">{category.name || "Kategori"}</h3>
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

export default Category;
