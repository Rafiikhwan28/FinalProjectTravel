import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./Activity.css";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  // Fetch all categories
  const getCategories = async () => {
    try {
      const res = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        {
          headers: { apiKey: API_KEY },
        }
      );
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch all or filtered activities
  const getActivities = async (categoryId = "all") => {
    setIsLoading(true);
    setError(null);
    try {
      const url =
        categoryId === "all"
          ? "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities"
          : `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities-by-category/${categoryId}`;

      const res = await axios.get(url, {
        headers: { apiKey: API_KEY },
      });

      if (res.data?.data) {
        setActivities(res.data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch activities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getActivities();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    getActivities(categoryId);
  };

  return (
    <>
      <Navbar />
      <div className="activity-page">
        <h1 className="activity-title">Explore Activities</h1>

        {/* Filter kategori */}
        <div className="category-filter">
          <button
            className={`category-btn ${selectedCategoryId === "all" ? "active" : ""}`}
            onClick={() => handleCategoryChange("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategoryId === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="activity-grid">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <Link to={`/detail-activity/${activity.id}`} className="activity-link">
                  {activity.imageUrls?.[0] &&
                  activity.imageUrls[0].startsWith("http") ? (
                    <img
                      src={activity.imageUrls[0]}
                      alt={activity.title}
                      className="activity-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  <h3 className="activity-item-title">{activity.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Activity;
