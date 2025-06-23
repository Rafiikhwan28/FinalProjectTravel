import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import "./Home.css";
import { Link } from "react-router-dom";
import { TextField, Button, Box, InputAdornment, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../../components/Footer";

const Home = () => {
  const [banner, setBanner] = useState([]);
  const [promo, setPromo] = useState([]);
  const [category, setCategory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const placeholderImage = "https://placehold.co/600x400?text=No+Image";

  const promoSliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const activitySliderRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannerRes, promoRes, categoryRes, activityRes] = await Promise.all([
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners", { headers: { apiKey } }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", { headers: { apiKey } }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories", { headers: { apiKey } }),
        axios.get("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities", { headers: { apiKey } }),
      ]);

      setBanner(bannerRes.data.data || []);
      setPromo(promoRes.data.data || []);
      setCategory(categoryRes.data.data || []);
      setActivity(activityRes.data.data || []);
      setFilteredActivities(activityRes.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSearch = () => {
    let filtered = [...activity];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory);
    }

    setFilteredActivities(filtered);
  };

  return (
    <div className="home-page">
      <Navbar />

      {/* ✅ BANNER + SEARCH */}
      {banner.length > 0 && (
        <header
          className="home-header"
          style={{
            backgroundImage: `url(${banner[0]?.imageUrl || placeholderImage})`,
          }}
        >
          <div className="header-content">
            <h1>{banner[0]?.name}</h1>
            <p>{banner[0]?.description}</p>

            {/* ✅ Search + Filter */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "center",
                marginTop: "1.5rem",
              }}
            >
              <TextField
                placeholder="Cari aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ backgroundColor: "#fff", borderRadius: 1, minWidth: 220 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 180, backgroundColor: "#fff", borderRadius: 1 }}>
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Kategori"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">Semua Kategori</MenuItem>
                  {category.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: 2, paddingX: 3 }}
                onClick={handleSearch}
              >
                Cari Sekarang
              </Button>
            </Box>
          </div>
        </header>
      )}

      {/* ✅ HASIL SEARCH */}
      <section className="section activity-section">
        <div className="section-header">
          <h2>Hasil Pencarian Aktivitas</h2>
        </div>
        <div className="activity-grid">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((item) => (
              <Link to={`/detail-activity/${item.id}`} key={item.id} className="activity-card">
                <img src={item.imageUrls?.[0] || placeholderImage} alt={item.title} />
                <div className="activity-info">
                  <h3>{item.title}</h3>
                  <p>{item.description?.slice(0, 60)}...</p>
                </div>
              </Link>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%", color: "#666" }}>Tidak ada aktivitas ditemukan.</p>
          )}
        </div>
      </section>

      {/* ✅ PROMO */}
      <section className="section promo-section">
        <div className="section-header">
          <h2>Promo Menarik</h2>
          <Link to="/promo" className="see-all-link">Lihat Semua</Link>
        </div>
        <div className="slider-wrapper">
          <button onClick={() => scrollSlider(promoSliderRef, "left")} className="slider-btn">❮</button>
          <div className="slider-container" ref={promoSliderRef}>
            {promo.map((item) => (
              <Link to={`/detail-promo/${item.id}`} key={item.id} className="slider-item">
                <img src={item.imageUrl || placeholderImage} alt={item.title} />
                <div className="slider-info">
                  <h3>{item.title}</h3>
                  <p>{item.description?.slice(0, 60)}...</p>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollSlider(promoSliderRef, "right")} className="slider-btn">❯</button>
        </div>
      </section>

      {/* ✅ CATEGORY */}
      <section className="section category-section">
        <div className="section-header">
          <h2>Jelajahi Berdasarkan Kategori</h2>
          <Link to="/category" className="see-all-link">Lihat Semua</Link>
        </div>
        <div className="slider-wrapper">
          <button onClick={() => scrollSlider(categorySliderRef, "left")} className="slider-btn">❮</button>
          <div className="slider-container" ref={categorySliderRef}>
            {category.map((item) => (
              <Link to={`/detail-category/${item.id}`} key={item.id} className="slider-item">
                <img src={item.imageUrl || placeholderImage} alt={item.name} />
                <div className="slider-info">
                  <h3>{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollSlider(categorySliderRef, "right")} className="slider-btn">❯</button>
        </div>
      </section>

      {/* ✅ ACTIVITY */}
      <section className="section activity-section">
        <div className="section-header">
          <h2>Aktivitas Seru</h2>
          <Link to="/activity" className="see-all-link">Lihat Semua</Link>
        </div>
        <div className="slider-wrapper">
          <button onClick={() => scrollSlider(activitySliderRef, "left")} className="slider-btn">❮</button>
          <div className="slider-container" ref={activitySliderRef}>
            {activity.map((item) => (
              <Link to={`/detail-activity/${item.id}`} key={item.id} className="slider-item">
                <img src={item.imageUrls?.[0] || placeholderImage} alt={item.title} />
                <div className="slider-info">
                  <h3>{item.title}</h3>
                  <p>{item.description?.slice(0, 60)}...</p>
                </div>
              </Link>
            ))}
          </div>
          <button onClick={() => scrollSlider(activitySliderRef, "right")} className="slider-btn">❯</button>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default Home;
