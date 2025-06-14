import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "", role: "" });
  const [editUser, setEditUser] = useState(null); // Untuk menyimpan user yang sedang diedit
  const [newRole, setNewRole] = useState("");
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM";


  const getUserList = async () => {
    try {
      const res = await axios.get(`https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user`, {
        headers: { apiKey, Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // Fungsi Create User
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.phoneNumber || !newUser.role) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-user",
        newUser,
        {
          headers: { apiKey, Authorization: `Bearer ${token}` },
        }
      );
      alert("User created successfully!");
      setNewUser({ name: "", email: "", phoneNumber: "", role: "" });
      getUserList();
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user.");
    }
  };

  // Fungsi Update Role
  const handleUpdateRole = async (userId) => {
    if (!newRole) {
      alert("Please select a role!");
      return;
    }

    try {
      await axios.put(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${userId}`,
        { role: newRole },
        {
          headers: { apiKey, Authorization: `Bearer ${token}` },
        }
      );
      alert("User role updated successfully!");
      getUserList();
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">List User</h1>

      {/* Form to Create User */}
      <div className="create-user-form">
        <h2>Create New User</h2>
        <TextField
          label="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
        />
        <TextField
          label="Phone Number"
          value={newUser.phoneNumber}
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleCreateUser}>
          Create User
        </Button>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img className="user-image" src={user.profilePictureUrl} alt="User" />
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <p className="user-role">{user.role}</p>
              <p className="user-phone">{user.phoneNumber}</p>
              {/* Update User Role */}
              <FormControl fullWidth>
                <InputLabel>Change Role</InputLabel>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdateRole(user.id)}
              >
                Update Role
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
