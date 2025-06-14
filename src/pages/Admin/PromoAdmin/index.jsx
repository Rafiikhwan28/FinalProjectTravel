import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const PromoAdmin = () => {
    const [promo, setPromo] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newPromo, setNewPromo] = useState({
        title: "",
        description: "",
    });
    const [newPromoImage, setNewPromoImage] = useState(null);
    const [editPromo, setEditPromo] = useState(null); // ID promo yang sedang di-edit

    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM";

    // Fetch promo list
    const getPromoList = async () => {
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
                { headers: { apiKey } }
            );
            setPromo(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch promotions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getPromoList();
    }, []);

    // Handle Create
    const handleCreatePromo = async () => {
        if (!newPromo.title || !newPromo.description || !newPromoImage) {
            alert("All fields are required!");
            return;
        }
    
        if (!newPromoImage.type.startsWith("image/")) {
            alert("Please upload a valid image file!");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", newPromo.title);
        formData.append("description", newPromo.description);
        formData.append("image", newPromoImage); // Gunakan key "image" jika API memintanya
    
        try {
            console.log("Sending FormData...", formData.get("title"), formData.get("description"), formData.get("imageUrl"));
    
            const response = await axios.post(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-promo",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        apiKey,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            alert("Promo created successfully!");
            console.log("Server Response:", response.data);
            setNewPromo({ title: "", description: "" });
            setNewPromoImage(null);
            getPromoList();
        } catch (err) {
            console.error("Error creating promo:", err);
            alert("Failed to create promo. Please try again.");
        }
    };
    

    // Handle Update
    const handleUpdatePromo = async (id) => {
        if (!newPromo.title || !newPromo.description) {
            alert("All fields are required!");
            return;
        }

        try {
            await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-promo/${id}`,
                { title: newPromo.title, description: newPromo.description },
                {
                    headers: {
                        apiKey,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Promo updated successfully!");
            setEditPromo(null);
            setNewPromo({ title: "", description: "" });
            getPromoList();
        } catch (err) {
            console.error("Error updating promo:", err);
            alert("Failed to update promo. Please try again.");
        }
    };

    // Handle Delete
    const handleDeletePromo = async (id) => {
        if (window.confirm("Are you sure you want to delete this promo?")) {
            try {
                await axios.delete(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-promo/${id}`,
                    {
                        headers: {
                            apiKey,
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("Promo deleted successfully!");
                getPromoList();
            } catch (err) {
                console.error("Error deleting promo:", err);
                alert("Failed to delete promo. Please try again.");
            }
        }
    };

    return (
        <div className="promo-page">
            <h1 className="promo-title">Page Promo Admin</h1>

            {/* Form for Creating/Updating Promo */}
            <div className="promo-form">
                <h2>{editPromo ? "Edit Promo" : "Create New Promo"}</h2>
                <input
                    type="text"
                    placeholder="Promo Title"
                    value={newPromo.title}
                    onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                />
                <textarea
                    placeholder="Promo Description"
                    value={newPromo.description}
                    onChange={(e) =>
                        setNewPromo({ ...newPromo, description: e.target.value })
                    }
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewPromoImage(e.target.files[0])}
                />
                <button
                    onClick={() => (editPromo ? handleUpdatePromo(editPromo) : handleCreatePromo())}
                >
                    {editPromo ? "Update Promo" : "Create Promo"}
                </button>
                {editPromo && (
                    <Button variant="contained" onClick={() => setEditPromo(null)}>Cancel</Button>
                )}
            </div>

            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="promo-grid">
                    {promo.map((item) => (
                        <div key={item.id} className="promo-item">
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="promo-image"
                            />
                            <h3 className="promo-item-title">{item.title}</h3>
                            <p>{item.description}</p>
                            <Button  variant="contained" onClick={() => setEditPromo(item.id)}>Edit</Button>
                            <Button variant="outlined" onClick={() => handleDeletePromo(item.id)}>Delete</Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromoAdmin;
