import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './DetailActivity.css';
import Navbar from "../../../components/Navbar";

const DetailActivity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getActivityDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
        {
          headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
        }
      );

      if (res.data?.data) {
        setActivity(res.data.data);
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("Activity not found. Please check the ID.");
      } else {
        setError("Failed to load activity details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getActivityDetail();
  }, [getActivityDetail]);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="detail-activity-page">
        {activity && (
          <div className="detail-grid">
            {/* Kiri: konten detail */}
            <div className="left-content">
              <h1 className="detail-title">{activity.title}</h1>

              <div className="detail-image-container">
                {activity.imageUrls?.length > 0 ? (
                  activity.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${activity.title} - ${index + 1}`}
                      className="detail-image"
                    />
                  ))
                ) : (
                  <p className="no-image">No images available</p>
                )}
              </div>

              <div className="detail-info">
                <h2>Description</h2>
                <p>{activity.description || "No description available."}</p>

                <div className="price-rating">
                  <p><strong>Price:</strong> Rp {activity.price?.toLocaleString()}</p>
                  {activity.price_discount && activity.price_discount > activity.price && (
                    <p><strong>Discounted Price:</strong> <s>Rp {activity.price_discount?.toLocaleString()}</s></p>
                  )}
                  <p><strong>Rating:</strong> ⭐ {activity.rating} ({activity.total_reviews} reviews)</p>
                </div>

                <h2>Facilities</h2>
                {activity.facilities ? (
                  <div dangerouslySetInnerHTML={{ __html: activity.facilities }} />
                ) : (
                  <p>No facilities listed.</p>
                )}

                <h2>Address</h2>
                <p>{activity.address}</p>
                <p>{activity.city}, {activity.province}</p>
              </div>
              <button className="cta-button">Pesan Sekarang</button>
            </div>

            {/* Kanan: map */}
            <div className="right-map">
              <div className="map-wrapper">
                <h2>Location Map</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: activity.location_maps || "<p>Location not available.</p>",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailActivity;
