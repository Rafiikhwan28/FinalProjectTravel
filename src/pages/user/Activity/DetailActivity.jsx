import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './DetailActivity.css';
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const DetailActivity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");

  const getActivityDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/activity/${id}`, {
        headers: { apiKey: API_KEY },
      });
      if (res.data?.data) {
        setActivity(res.data.data);
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat detail aktivitas.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getActivityDetail();
  }, [getActivityDetail]);

  const handleAddToCart = async () => {
    if (!TOKEN) return alert("Silakan login terlebih dahulu!");

    try {
      setAddingToCart(true);
      await axios.post(
        `${API_URL}/add-cart`,
        { activityId: activity.id, quantity: 1 },
        {
          headers: {
            apiKey: API_KEY,
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      alert("Berhasil ditambahkan ke keranjang!");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menambahkan ke keranjang.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Navbar />
      <main className="detail-activity-page">
        <section className="detail-grid">
          <article className="left-content">
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
                <p className="no-image">Gambar tidak tersedia.</p>
              )}
            </div>

            <div className="detail-info">
              <h2>Deskripsi</h2>
              <p>{activity.description || "Tidak ada deskripsi."}</p>

              <div className="price-rating">
                <p className="badge primary">💸 Harga: Rp {activity.price?.toLocaleString()}</p>
                {activity.price_discount && activity.price_discount > activity.price && (
                  <p className="badge danger">🎉 Diskon: Rp {activity.price_discount?.toLocaleString()}</p>
                )}
                <p className="badge success">⭐ {activity.rating} | {activity.total_reviews} Ulasan</p>
              </div>

              <h2>Fasilitas</h2>
              {activity.facilities ? (
                <div dangerouslySetInnerHTML={{ __html: activity.facilities }} />
              ) : (
                <p>Tidak ada fasilitas yang tercantum.</p>
              )}

              <h2>Alamat</h2>
              <address>
                <p>{activity.address}</p>
                <p>{activity.city}, {activity.province}</p>
              </address>

              <button className="cta-button" onClick={handleAddToCart} disabled={addingToCart}>
                {addingToCart ? <div className="loading-spinner"></div> : "🛒 Pesan Sekarang"}
              </button>
            </div>
          </article>

          <aside className="right-map">
            <h2>Lokasi</h2>
            <div
              className="map-frame"
              dangerouslySetInnerHTML={{
                __html: activity.location_maps || "<p>Lokasi tidak tersedia.</p>",
              }}
            />
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DetailActivity;
