import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import "./UserList.css";

const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const apiHeaders = {
    apiKey,
    Authorization: `Bearer ${token}`,
  };

  const getUserList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
        { headers: apiHeaders }
      );
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal mengambil data user.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleUpdateRole = async (userId) => {
    const newRole = roleUpdates[userId];
    if (!newRole) return alert("Pilih role terlebih dahulu!");

    try {
      await axios.put(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${userId}`,
        { role: newRole.toLowerCase() },
        { headers: apiHeaders }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole.toLowerCase() } : user
        )
      );

      setRoleUpdates((prev) => ({ ...prev, [userId]: "" }));
      alert("Role berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal update role.");
    }
  };

  return (
    <div className="userlist-container">
      <Typography variant="h4" gutterBottom className="title">
        Daftar Pengguna
      </Typography>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} className="user-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telepon</TableCell>
                <TableCell>Role Saat Ini</TableCell>
                <TableCell>Ganti Role</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar
                      alt={user.name}
                      src={
                        user.profilePictureUrl &&
                        user.profilePictureUrl.startsWith("http")
                          ? user.profilePictureUrl
                          : "https://placehold.co/150x150/png?text=No+Image"
                      }
                      sx={{ width: 56, height: 56 }}
                      imgProps={{
                        onError: (e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/150x150/png?text=No+Image";
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <strong>{user.role.toUpperCase()}</strong>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ganti Role</InputLabel>
                      <Select
                        value={roleUpdates[user.id] || ""}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <MenuItem value="" disabled>
                          Pilih Role
                        </MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateRole(user.id)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UserList;
