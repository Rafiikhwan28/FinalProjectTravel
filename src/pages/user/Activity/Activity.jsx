import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import SearchIcon from "@mui/icons-material/Search"; // Tambahkan ini
import "./Activity.css";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  useEffect(() => {
    getCategories();
    getActivities();
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        { headers: { apiKey: API_KEY } }
      );
      if (res.data?.data) setCategories(res.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

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
        setSearchResults(res.data.data); // Default tampil semua
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError("Failed to fetch activities.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    getActivities(categoryId);
  };

  const handleSearch = () => {
    const filtered = activities
      .filter((activity) =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((activity) => {
        if (budget) return activity.price <= Number(budget);
        return true;
      });
    setSearchResults(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="activity-page">
        <h1 className="activity-title">Explore Activities</h1>

        {/* FILTER */}
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search activity..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <SearchIcon sx={{ fontSize: "1.2rem", marginRight: "0.3rem" }} />
            Search
          </button>
          <input
            type="number"
            placeholder="Max budget (Rp)"
            className="budget-input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
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
            {searchResults.length === 0 ? (
              <p className="no-data">No activities found.</p>
            ) : (
              searchResults.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <Link to={`/detail-activity/${activity.id}`} className="activity-link">
                    {activity.imageUrls?.[0]?.startsWith("http") ? (
                      <img
                        src={activity.imageUrls[0]}
                        alt={activity.title}
                        className="activity-image"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                    <h3 className="activity-item-title">{activity.title}</h3>
                    <p className="activity-price">Rp {activity.price.toLocaleString()}</p>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Activity;
