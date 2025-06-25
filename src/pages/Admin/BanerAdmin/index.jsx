import { useEffect, useState } from "react";
import axios from "axios";
import "./BanerAdmin.css";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";

const BanerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({ id: null, name: "", imageUrl: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const TOKEN = localStorage.getItem("access_token");

  const headers = {
    apiKey: API_KEY,
    Authorization: `Bearer ${TOKEN}`,
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/banners`, { headers });
      setBanners(response.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengambil data banner");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${BASE_URL}/upload-image`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.url; // ✅ Sesuai dengan struktur response API
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal upload gambar");
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name) {
      alert("Nama banner wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formState.imageUrl;

      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          setIsLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const payload = { name: formState.name, imageUrl };

      if (formState.id) {
        await axios.post(`${BASE_URL}/update-banner/${formState.id}`, payload, { headers });
        alert("Banner berhasil diperbarui");
      } else {
        if (!imageUrl) {
          alert("Silakan upload gambar untuk banner baru");
          setIsLoading(false);
          return;
        }
        await axios.post(`${BASE_URL}/create-banner`, payload, { headers });
        alert("Banner berhasil ditambahkan");
      }

      handleCloseDialog();
      fetchBanners();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan banner");
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
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus banner");
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

  return (
    <div className="banner-admin">
      <h1>Kelola Banner</h1>
      <button className="btn-primary" onClick={() => handleOpenDialog()}>
        Tambah Banner
      </button>

      <div className="banner-list">
        {banners.map((item) => (
          <div key={item.id} className="banner-card">
            <img
              src={item.imageUrl || "https://placehold.co/400x200?text=No+Image"}
              alt={item.name}
              className="banner-image"
            />
            <h3>{item.name}</h3>
            <div className="btn-group">
              <button className="btn-outline" onClick={() => handleOpenDialog(item)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => handleDelete(item.id)}>
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{formState.id ? "Edit Banner" : "Tambah Banner"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Nama Banner</label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
              />

              <label>Upload Gambar</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {previewImage && (
                <img src={previewImage} alt="Preview" className="preview-image" />
              )}

              <div className="modal-buttons">
                <button type="button" onClick={handleCloseDialog} className="btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : formState.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanerAdmin;
