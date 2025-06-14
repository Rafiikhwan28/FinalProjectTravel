import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import './BanerAdmin.css';

const BanerAdmin = () => {
    const [Baner, setBaner] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formState, setFormState] = useState({
        id: null,
        name: "",
        imageUrl: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);

    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const apiUrl = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners";

    // Mengambil daftar banner
    const getBanerList = () => {
        axios
            .get(apiUrl, { headers: { apiKey } })
            .then((res) => setBaner(res.data.data))
            .catch((err) => console.log(err.response));
    };

    // Upload gambar dan dapatkan URL
    const uploadImage = async () => {
        if (!selectedImage) {
            alert("Please select an image to upload!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedImage);

            const response = await axios.post(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
                formData,
                {
                    headers: {
                        apiKey,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return response.data.url; // URL gambar dari API
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Image upload failed!");
            return null;
        }
    };

    // Menangani create/update banner
    const handleSubmit = async () => {
        let imageUrl = formState.imageUrl;

        // Jika ada gambar yang dipilih, unggah dulu
        if (selectedImage) {
            imageUrl = await uploadImage();
            if (!imageUrl) return; // Gagal upload, tidak lanjut
        }

        const method = formState.id ? "put" : "post";
        const url = formState.id ? `${apiUrl}/${formState.id}` : apiUrl;

        axios[method](
            url,
            { ...formState, imageUrl },
            { headers: { apiKey } }
        )
            .then(() => {
                getBanerList();
                handleCloseDialog();
            })
            .catch((err) => console.log(err.response));
    };

    // Menghapus banner
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            axios
                .delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${id}`, {
                    headers: {
                        apiKey,
                        Authorization: `Bearer <YourToken>`,
                    },
                })
                .then(() => getBanerList())
                .catch((err) => console.log(err.response));
        }
    };

    // Membuka dialog untuk create/edit
    const handleOpenDialog = (baner = { id: null, name: "", imageUrl: "" }) => {
        setFormState(baner);
        setSelectedImage(null); // Reset gambar yang dipilih
        setIsDialogOpen(true);
    };

    // Menutup dialog
    const handleCloseDialog = () => {
        setFormState({ id: null, name: "", imageUrl: "" });
        setSelectedImage(null); // Reset gambar yang dipilih
        setIsDialogOpen(false);
    };

    useEffect(() => {
        getBanerList();
    }, []);

    return (
        <div>
            <h1>Banner Admin</h1>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Create Banner
            </Button>

            <div className="banner-list">
                {Baner.map((item) => (
                    <div key={item.id} className="banner-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <p>{item.name}</p>
                        <Button
                            variant="contained"
                            color="primary"
                            className="edit"
                            onClick={() => handleOpenDialog(item)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className="delete"
                            onClick={() => handleDelete(item.id)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{formState.id ? "Edit Banner" : "Create Banner"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        style={{ marginTop: "15px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BanerAdmin;
