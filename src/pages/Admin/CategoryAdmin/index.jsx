import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import "./CategoryAdmin.css";

const CategoryAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newCategory, setNewCategory] = useState(""); // Nama kategori
    const [newCategoryImage, setNewCategoryImage] = useState(null); // Gambar kategori
    const [editCategory, setEditCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");

    const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM";

    // Fetch categories
    const getCategoryList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
                { headers: { apiKey } }
            );
            setCategories(res.data?.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch categories. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    // Create category
    const handleCreate = async () => {
        if (!newCategory.trim() || !newCategoryImage) {
            alert("Category name and image are required!");
            return;
        }

        if (!newCategoryImage.type.startsWith("image/")) {
            alert("Please upload a valid image file!");
            return;
        }

        const formData = new FormData();
        formData.append("name", newCategory);
        formData.append("imageUrl", newCategoryImage);

        try {
            await axios.post(
                "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-category",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        apiKey,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Category created successfully!");
            setNewCategory("");
            setNewCategoryImage(null);
            getCategoryList();
        } catch (err) {
            console.error("Error creating category:", err);
            alert("Failed to create category. Please try again.");
        }
    };

    // Update category
    const handleUpdate = async (id) => {
        if (!newCategoryName.trim()) {
            alert("Category name cannot be empty!");
            return;
        }

        try {
            await axios.post(
                `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-category/${id}`,
                { name: newCategoryName },
                {
                    headers: {
                        apiKey,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Category updated successfully!");
            setEditCategory(null);
            getCategoryList();
        } catch (err) {
            console.error("Error updating category:", err);
            alert("Failed to update category. Please try again.");
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(
                    `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-category/${id}`,
                    {
                        headers: {
                            apiKey,
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("Category deleted successfully!");
                getCategoryList();
            } catch (err) {
                console.error("Error deleting category:", err);
                alert("Failed to delete category. Please try again.");
            }
        }
    };


    console.log(newCategoryImage);

    return (
        <div className="category-page">
            <h1 className="category-title">Page Category Admin</h1>
            {isLoading ? (
                <p className="loading">Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <ul className="category-list">
                    {categories.map((item) => (
                        <li key={item.id} className="category-item">
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="category-image"
                            />
                            <div className="category-info">
                                {editCategory === item.id ? (
                                    <>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={newCategoryName}
                                            onChange={(e) =>
                                                setNewCategoryName(e.target.value)
                                            }
                                            placeholder="Update category name"
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUpdate(item.id)}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => setEditCategory(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <h3>{item.name}</h3>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setEditCategory(item.id);
                                                setNewCategoryName(item.name);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="create-category">
                <h2>Create New Category</h2>
                <TextField
                    variant="outlined"
                    size="small"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                />
                <input
                    type="file"
                    accept="imageUrl/*"
                    onChange={(e) => {
                        console.log(e.target.files[0])
                        setNewCategoryImage(e.target.files[0])
                    }}
                    style={{ marginTop: "10px" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                    style={{ marginLeft: "10px", marginTop: "10px" }}
                >
                    Create
                </Button>
            </div>
        </div>
    );
};

export default CategoryAdmin;
