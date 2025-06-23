import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./ActivityByCategory.css";

const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const ActivityByCategory = () => {
  const { id } = useParams();
  const [activities, setActivities] = useState([]);
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const resCategory = await axios.get(`${API_URL}/category/${id}`, {
          headers: { apiKey: API_KEY },
        });
        setCategory(resCategory.data.data);

        const resActivities = await axios.get(`${API_URL}/activities-by-category/${id}`, {
          headers: { apiKey: API_KEY },
        });
        setActivities(resActivities.data.data);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data aktivitas.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div className="activity-by-category-container">
        <h1 className="page-title">Activities for Category: {category.name}</h1>

        <div className="activity-grid">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="activity-card">
                <img
                  src={activity.imageUrls[0]}
                  alt={activity.title}
                  className="activity-image"
                />
                <div className="activity-content">
                  <h2 className="activity-title">{activity.title}</h2>
                  <p className="activity-description">
                    {activity.description.length > 80
                      ? activity.description.substring(0, 80) + "..."
                      : activity.description}
                  </p>
                  <p className="activity-price">Rp {activity.price.toLocaleString()}</p>
                  <Link to={`/detail-activity/${activity.id}`} className="activity-link">
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activity-text">Tidak ada aktivitas dalam kategori ini.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityByCategory;
