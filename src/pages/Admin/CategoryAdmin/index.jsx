import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./CategoryAdmin.css";

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);

  const [editMode, setEditMode] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const TOKEN = localStorage.getItem("access_token");

  const headers = {
    apiKey: API_KEY,
    Authorization: `Bearer ${TOKEN}`,
  };

  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/categories`, { headers });
      setCategories(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat kategori");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim() || !newCategoryImage) {
      alert("Nama dan gambar kategori wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("imageUrl", newCategoryImage);

    try {
      await axios.post(`${BASE_URL}/create-category`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      alert("Kategori berhasil dibuat");
      setNewCategory("");
      setNewCategoryImage(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuat kategori");
    }
  };

  const handleEdit = (category) => {
    setEditMode(category.id);
    setEditCategoryName(category.name);
    setEditCategoryImage(null);
  };

  const handleUpdate = async (id) => {
    if (!editCategoryName.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    try {
      let imageUrl = null;

      if (editCategoryImage) {
        const imgForm = new FormData();
        imgForm.append("file", editCategoryImage);

        const uploadRes = await axios.post(`${BASE_URL}/upload-image`, imgForm, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.result;
      }

      const payload = { name: editCategoryName };
      if (imageUrl) payload.imageUrl = imageUrl;

      await axios.post(`${BASE_URL}/update-category/${id}`, payload, {
        headers,
      });

      alert("Kategori berhasil diperbarui");
      setEditMode(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui kategori");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete-category/${id}`, { headers });
      alert("Kategori berhasil dihapus");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kategori");
    }
  };

  return (
    <div className="category-admin">
      <h1>Kelola Kategori</h1>

      <div className="create-category">
        <h2>Tambah Kategori Baru</h2>
        <TextField
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          label="Nama Kategori"
          size="small"
          fullWidth
          sx={{ mb: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCategoryImage(e.target.files[0])}
        />
        <Button variant="contained" onClick={handleCreate} sx={{ mt: 1 }}>
          Tambah
        </Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="category-list">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <img
                src={cat.imageUrl || "https://via.placeholder.com/150"}
                alt={cat.name}
                className="category-img"
              />
              {editMode === cat.id ? (
                <div className="category-edit-form">
                  <TextField
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  />
                  <div className="btn-group">
                    <Button
                      variant="contained"
                      onClick={() => handleUpdate(cat.id)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Simpan
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setEditMode(null)}
                      sx={{ mt: 1 }}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="category-info">
                  <h3>{cat.name}</h3>
                  <div className="btn-group">
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(cat)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryAdmin;
