import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Navbar from "../../../components/Navbar";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();

  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
    apiKey: API_KEY,
  };

  useEffect(() => {
    if (!token) {
      alert("Anda belum login.");
      navigate("/login");
      return;
    }
    fetchCartItems();
    fetchPaymentMethods();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/carts`, { headers });
      setCartItems(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memuat keranjang.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/payment-methods`, { headers });
      setPaymentMethods(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memuat metode pembayaran.");
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete-cart/${id}`, { headers });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus produk.");
    }
  };

  const handleQuantityChange = async (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      await axios.patch(`${BASE_URL}/update-cart/${item.id}`, { quantity: newQuantity }, { headers });
      setCartItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQuantity } : i))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui jumlah.");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.activity.price || 0) * (item.quantity || 1), 0);
  };

  const handleCreateTransaction = async () => {
    if (!selectedPaymentMethod) return alert("Silakan pilih metode pembayaran.");
    if (selectedItems.length === 0) return alert("Pilih minimal 1 produk untuk checkout.");

    setCheckingOut(true);
    try {
      await axios.post(
        `${BASE_URL}/create-transaction`,
        {
          paymentMethodId: selectedPaymentMethod,
          cartIds: selectedItems,
        },
        { headers }
      );

      alert("Checkout berhasil! Lihat transaksi Anda.");
      navigate("/transaksi"); // ← arahkan ke halaman transaksi user

      await fetchCartItems();
      setSelectedItems([]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <Typography variant="h4" mb={3}>
          Keranjang Belanja
        </Typography>

        {cartItems.length === 0 ? (
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            Keranjang Anda kosong.
          </Paper>
        ) : (
          cartItems.map((item) => (
            <Paper
              key={item.id}
              elevation={3}
              sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
            >
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <Avatar
                src={item.activity.imageUrls[0]}
                alt={item.activity.title}
                sx={{ width: 80, height: 80, mr: 2 }}
                variant="rounded"
              />
              <div style={{ flex: 1 }}>
                <Typography variant="h6">{item.activity.title}</Typography>
                <Typography color="text.secondary">
                  Rp {item.activity.price.toLocaleString()} x {item.quantity} = Rp{" "}
                  {(item.activity.price * item.quantity).toLocaleString()}
                </Typography>
              </div>
              <IconButton onClick={() => handleQuantityChange(item, -1)}>
                <RemoveIcon />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton onClick={() => handleQuantityChange(item, 1)}>
                <AddIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleRemoveFromCart(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}

        {cartItems.length > 0 && (
          <Paper
            elevation={4}
            sx={{ p: 3, mt: 3, background: "#1976d2", color: "#fff", borderRadius: 2 }}
          >
            <Typography variant="h6">
              Total Harga: Rp {calculateTotal().toLocaleString()}
            </Typography>

            <FormControl fullWidth sx={{ mt: 2, background: "#fff", borderRadius: 1 }}>
              <InputLabel>Metode Pembayaran</InputLabel>
              <Select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                label="Metode Pembayaran"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              onClick={handleCreateTransaction}
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 2, backgroundColor: "#fff", color: "#1976d2", fontWeight: "bold" }}
              disabled={checkingOut}
            >
              {checkingOut ? "Memproses..." : "Checkout"}
            </Button>
          </Paper>
        )}
      </div>
    </>
  );
};

export default Cart;
