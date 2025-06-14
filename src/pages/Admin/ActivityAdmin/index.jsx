import React, { useEffect, useState } from "react";
import axios from "axios";
import './ActivityAdmin.css';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    price: "",
    imageUrls: [],
    categoryId: "",
  });
  const [newPromoImage, setNewPromoImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const API_BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const API_HEADERS = {
    apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  };

  // Fungsi untuk upload gambar
  const handleUploadImage = async () => {
    if (!newPromoImage) {
      setError("Please select an image to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", newPromoImage);

      const response = await axios.post(
        `${API_BASE_URL}/upload-image`,
        formData,
        { headers: { ...API_HEADERS, "Content-Type": "multipart/form-data" } }
      );

      setNewActivity({
        ...newActivity,
        imageUrls: [response.data.url],
      });
      setError(null);
    } catch (err) {
      setError("Failed to upload image.");
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();

    if (!newActivity.imageUrls.length) {
      setError("Please upload an image before adding activity.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/activities`,
        newActivity,
        { headers: API_HEADERS }
      );
      setActivities([...activities, response.data.data]);
      setNewActivity({ title: "", description: "", price: "", imageUrls: [], categoryId: "" });
      setError(null);
    } catch (err) {
      setError("Failed to create activity.");
    }
  };

  const handleEditActivity = async (e) => {
    e.preventDefault();

    if (!newActivity.imageUrls.length) {
      setError("Please upload an image before updating activity.");
      return;
    }

    try {
      const response = await axios.put(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${editingId}`,
        newActivity,
        { 
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          headers: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM` }
      );

      setActivities(
        activities.map((activity) =>
          activity.id === editingId ? response.data.data : activity
        )
      );
      setNewActivity({ title: "", description: "", price: "", imageUrls: [], categoryId: "" });
      setEditMode(false);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update activity.");
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await axios.delete(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`, 
        { 
          headers: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM`,
          apiKey: `24405e01-fbc1-45a5-9f5a-be13afcd757c`
        });
      setActivities(activities.filter((activity) => activity.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete activity.");
    }
  };

  const handleEditClick = (activity) => {
    setEditMode(true);
    setEditingId(activity.id);
    setNewActivity({
      title: activity.title,
      description: activity.description,
      price: activity.price,
      imageUrls: activity.imageUrls,
      categoryId: activity.categoryId,
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/activities`, { headers: API_HEADERS });
        setActivities(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch activities.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="activity-container">
      <h1>{editMode ? "Edit Activity" : "Add Activity"}</h1>

      <form onSubmit={editMode ? handleEditActivity : handleAddActivity} className="activity-form">
        <input
          type="text"
          placeholder="Title"
          value={newActivity.title}
          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newActivity.price}
          onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category ID"
          value={newActivity.categoryId}
          onChange={(e) => setNewActivity({ ...newActivity, categoryId: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewPromoImage(e.target.files[0])}
        />
        <button type="button" onClick={handleUploadImage}>Upload Image</button>
        <button type="submit">{editMode ? "Update Activity" : "Add Activity"}</button>
      </form>

      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card">
            <img
              src={activity.imageUrls[0] || "https://via.placeholder.com/150"}
              alt={activity.title}
              className="activity-image"
            />
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <p><strong>Price:</strong> ${activity.price}</p>
            <button onClick={() => handleEditClick(activity)}>Edit</button>
            <button onClick={() => handleDeleteActivity(activity.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
