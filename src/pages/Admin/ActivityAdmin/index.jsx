import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ActivityAdmin.css";

const ActivityAdmin = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm());
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");

  const headers = {
    apiKey: API_KEY,
    Authorization: `Bearer ${TOKEN}`,
  };

  function initialForm() {
    return {
      title: "",
      description: "",
      price: "",
      price_discount: "",
      rating: "",
      total_reviews: "",
      facilities: "",
      address: "",
      province: "",
      city: "",
      location_maps: "",
      categoryId: "",
      imageFile: null,
    };
  }

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/activities`, { headers });
      console.log("Fetched activities:", res.data); // Log respons
      setActivities(res.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching activities:", err); // Log error
      setError(err.response?.data?.message || "Gagal mengambil data aktivitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "imageFile" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.categoryId) {
      setError("Judul, deskripsi, harga, kategori, dan gambar wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      let imageUrls = [];

      if (form.imageFile) {
        const imgForm = new FormData();
        imgForm.append("file", form.imageFile);

        const imgRes = await axios.post(`${API_URL}/upload-image`, imgForm, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrls = [imgRes.data.url];
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        price_discount: Number(form.price_discount),
        rating: Number(form.rating),
        total_reviews: Number(form.total_reviews),
        facilities: form.facilities,
        address: form.address,
        province: form.province,
        city: form.city,
        location_maps: form.location_maps,
        categoryId: form.categoryId,
        imageUrls,
      };

      if (editMode) {
        await axios.put(`${API_URL}/update-activity/${editingId}`, payload, {
          headers,
        });
        alert("Aktivitas berhasil diupdate");
      } else {
        await axios.post(`${API_URL}/create-activity`, payload, { headers });
        alert("Aktivitas berhasil ditambahkan");
      }

      resetForm();
      fetchActivities();
    } catch (err) {
      console.error("Error saving activity:", err); // Log error
      setError(err.response?.data?.message || "Gagal menyimpan aktivitas");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm());
    setEditMode(false);
    setEditingId(null);
    setError("");
  };

  const handleEdit = (activity) => {
    setForm({
      ...activity,
      price: activity.price,
      price_discount: activity.price_discount,
      rating: activity.rating,
      total_reviews: activity.total_reviews,
      facilities: activity.facilities || "",
      address: activity.address || "",
      province: activity.province || "",
      city: activity.city || "",
      location_maps: activity.location_maps || "",
      categoryId: activity.categoryId,
      imageFile: null, // reset untuk upload gambar baru
    });
    setEditMode(true);
    setEditingId(activity.id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus aktivitas ini?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/delete-activity/${id}`, { headers });
      alert("Aktivitas berhasil dihapus");
      fetchActivities();
    } catch (err) {
      console.error("Error deleting activity:", err); // Log error
      setError(err.response?.data?.message || "Gagal menghapus aktivitas");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="activity-admin">
      <h1>{editMode ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}</h1>

      <form onSubmit={handleSubmit} className="activity-form">
        <input type="text" name="title" placeholder="Judul" value={form.title} onChange={handleInputChange} />
        <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleInputChange} />
        <input type="number" name="price" placeholder="Harga" value={form.price} onChange={handleInputChange} />
        <input type="number" name="price_discount" placeholder="Harga Diskon" value={form.price_discount} onChange={handleInputChange} />
        <input type="number" name="rating" placeholder="Rating" value={form.rating} onChange={handleInputChange} />
        <input type="number" name="total_reviews" placeholder="Total Review" value={form.total_reviews} onChange={handleInputChange} />
        <textarea name="facilities" placeholder="Fasilitas" value={form.facilities} onChange={handleInputChange} />
        <textarea name="address" placeholder="Alamat" value={form.address} onChange={handleInputChange} />
        <input type="text" name="province" placeholder="Provinsi" value={form.province} onChange={handleInputChange} />
        <input type="text" name="city" placeholder="Kota" value={form.city} onChange={handleInputChange} />
        <textarea name="location_maps" placeholder="Embed Maps" value={form.location_maps} onChange={handleInputChange} />
        <input type="text" name="categoryId" placeholder="ID Kategori" value={form.categoryId} onChange={handleInputChange} />
        <input type="file" name="imageFile" accept="image/*" onChange={handleInputChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : editMode ? "Update Aktivitas" : "Tambah Aktivitas"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      <h2>Daftar Aktivitas</h2>
      <div className="activity-list">
        {activities.map((act) => (
          <div key={act.id} className="activity-card">
            {act.imageUrls?.[0] &&
              act.imageUrls[0].startsWith("http") ? (
                <img
                  src={act.imageUrls[0]}    
                  className="activity-image"
                />
              ) : (
              <div className="no-image">No Image</div>
            )}
              <h3 className="activity-item-title">{act.title}</h3>
            <div className="activity-info">
               <h3>{act.title}</h3>
              <p>{act.description?.slice(0, 100)}...</p>
              <p>Harga: Rp {Number(act.price).toLocaleString()}</p>
              <div className="btn-group">
                <button onClick={() => handleEdit(act)}>Edit</button>
                <button onClick={() => handleDelete(act.id)} className="btn-delete">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityAdmin;
