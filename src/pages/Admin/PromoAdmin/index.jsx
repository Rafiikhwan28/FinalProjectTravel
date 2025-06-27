import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./PromoAdmin.css";

const PromoAdmin = () => {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    terms_condition: "",
    promo_code: "",
    promo_discount_price: "",
    minimum_claim_price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editMode, setEditMode] = useState(null);

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");
  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";

  const headers = {
    apiKey: API_KEY,
    Authorization: `Bearer ${TOKEN}`,
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/promos`, { headers });
      setPromos(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch promos");
    } finally {
      setIsLoading(false);
    }
  };

  
  const uploadImage = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await axios.post(`${BASE_URL}/upload-image`, data, { headers });
      return res.data.result;
    } catch (err) {
      alert(err.response?.data?.message || "Gagal upload gambar");
      return null;
    }
  };

  const handleCreateOrUpdate = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.promo_code ||
      !form.promo_discount_price ||
      !form.minimum_claim_price
    ) {
      alert("Semua input wajib diisi");
      return;
    }

    try {
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) return;
      }

      const payload = {
        ...form,
        promo_discount_price: Number(form.promo_discount_price),
        minimum_claim_price: Number(form.minimum_claim_price),
        ...(imageUrl && { imageUrl }),
      };

      if (editMode) {
        await axios.post(`${BASE_URL}/update-promo/${editMode}`, payload, { headers });
        alert("Promo berhasil diperbarui");
      } else {
        if (!imageUrl) {
          alert("Gambar wajib diunggah untuk promo baru");
          return;
        }
        await axios.post(`${BASE_URL}/create-promo`, payload, { headers });
        alert("Promo berhasil dibuat");
      }

      resetForm();
      fetchPromos();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan promo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus promo ini?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete-promo/${id}`, { headers });
      alert("Promo berhasil dihapus");
      fetchPromos();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus promo");
    }
  };

  const handleEdit = (promo) => {
    setForm({
      title: promo.title,
      description: promo.description,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setEditMode(promo.id);
    setImageFile(null);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setImageFile(null);
    setEditMode(null);
  };

  return (
    <div className="promo-admin">
      <h1>Kelola Promo</h1>

      <div className="promo-form">
        <h2>{editMode ? "Edit Promo" : "Tambah Promo Baru"}</h2>

        <TextField
          label="Judul"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Deskripsi"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Syarat & Ketentuan"
          multiline
          rows={3}
          value={form.terms_condition}
          onChange={(e) => setForm({ ...form, terms_condition: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Kode Promo"
          value={form.promo_code}
          onChange={(e) => setForm({ ...form, promo_code: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Potongan Harga (Rp)"
          type="number"
          value={form.promo_discount_price}
          onChange={(e) => setForm({ ...form, promo_discount_price: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Minimal Transaksi (Rp)"
          type="number"
          value={form.minimum_claim_price}
          onChange={(e) => setForm({ ...form, minimum_claim_price: e.target.value })}
          fullWidth
          sx={{ mb: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="promo-file-input"
        />

        <div className="btn-group">
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editMode ? "Update Promo" : "Create Promo"}
          </Button>
          {editMode && (
            <Button variant="outlined" color="error" onClick={resetForm}>
              Batal
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="promo-list">
          {promos.map((promo) => (
            <div key={promo.id} className="promo-card">
              <img
                src={promo.imageUrl || "https://placehold.co/300x200?text=No+Image"}
                alt={promo.title}
                className="promo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x200?text=No+Image";
                }}
              />
              <div className="promo-info">
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                <p><strong>Kode Promo:</strong> {promo.promo_code}</p>
                <p><strong>Diskon:</strong> Rp {promo.promo_discount_price.toLocaleString()}</p>
                <p><strong>Min. Transaksi:</strong> Rp {promo.minimum_claim_price.toLocaleString()}</p>
                <div className="btn-group">
                  <Button variant="contained" onClick={() => handleEdit(promo)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(promo.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoAdmin;
