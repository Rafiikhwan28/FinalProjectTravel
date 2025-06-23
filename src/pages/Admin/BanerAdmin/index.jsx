import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import "./BanerAdmin.css";

const BanerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({ id: null, name: "", imageUrl: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");
  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";

  const headers = {
    apiKey: API_KEY,
    Authorization: `Bearer ${TOKEN}`,
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/banners`, { headers });
      setBanners(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengambil banner");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const uploadImage = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);

      const response = await axios.post(`${BASE_URL}/upload-image`, data, {
        headers: {
          apiKey: API_KEY,
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.result; // ✅ Return URL langsung
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal upload gambar");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formState.name) {
      alert("Nama banner wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formState.imageUrl;

      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) return;
        imageUrl = uploadedUrl;
      }

      const payload = { name: formState.name, imageUrl };

      if (formState.id) {
        await axios.put(`${BASE_URL}/update-banner/${formState.id}`, payload, { headers });
        alert("Banner berhasil diperbarui");
      } else {
        if (!imageUrl) {
          alert("Silakan pilih gambar untuk banner baru");
          return;
        }
        await axios.post(`${BASE_URL}/create-banner`, payload, { headers });
        alert("Banner berhasil dibuat");
      }

      handleCloseDialog();
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus banner ini?")) return;

    try {
      await axios.delete(`${BASE_URL}/delete-banner/${id}`, { headers });
      alert("Banner berhasil dihapus");
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menghapus banner");
    }
  };

  const handleOpenDialog = (banner = { id: null, name: "", imageUrl: "" }) => {
    setFormState(banner);
    setSelectedImage(null);
    setPreviewImage(banner.imageUrl || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormState({ id: null, name: "", imageUrl: "" });
    setSelectedImage(null);
    setPreviewImage(null);
    setIsDialogOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="banner-admin">
      <h1>Kelola Banner</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Tambah Banner
      </Button>

      <div className="banner-list">
        {banners.map((item) => (
          <div key={item.id} className="banner-card">
            <img
              src={item.imageUrl || "https://placehold.co/400x200?text=No+Image"}
              alt={item.name}
              className="banner-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x200?text=No+Image";
              }}
            />
            <h3>{item.name}</h3>
            <div className="btn-group">
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleOpenDialog(item)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{formState.id ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nama Banner"
            fullWidth
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "1rem" }}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : formState.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BanerAdmin;
