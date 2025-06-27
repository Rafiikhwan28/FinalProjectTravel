import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import "./ProfilePage.css";

const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

 
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      apiKey: API_KEY,
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/user");
        setProfile(data.data);
        setForm({
          name: data.data.name || "",
          phoneNumber: data.data.phoneNumber || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleEditProfile = async () => {
    try {
      const { data } = await axiosInstance.put("/update-profile", form);
      setProfile(data.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePicture) return alert("Please select an image first!");

    try {
      const formData = new FormData();
      formData.append("file", profilePicture);

      const { data: upload } = await axiosInstance.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await axiosInstance.post("/update-profile-picture", {
        profilePictureUrl: upload.url,
      });

      alert("Profile picture updated!");
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image.");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-container">
          <div className="profile-picture-section">
            <img
              src={profile?.profilePictureUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-picture"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="upload-input"
            />
            <button onClick={handleUploadProfilePicture} className="btn upload-btn">
              Upload New Picture
            </button>
          </div>

          {isEditing ? (
            <div className="edit-section">
              <label>
                Name:
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="edit-input"
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="edit-input"
                />
              </label>
              <div className="button-group">
                <button onClick={handleEditProfile} className="btn save-btn">Save</button>
                <button onClick={() => setIsEditing(false)} className="btn cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="info-section">
              <p><strong>Name:</strong> {profile?.name}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phoneNumber || "N/A"}</p>
              <button onClick={() => setIsEditing(true)} className="btn edit-btn">Edit Profile</button>
            </div>
          )}

          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
