import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  Checkbox,
  Box,
  FormControlLabel,
  Grid,
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
      setSelectedItems([]);
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

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
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
      navigate("/transaksi");
      await fetchCartItems();
      setSelectedItems([]);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "auto" }}>
        <Typography variant="h4" fontWeight={700} color="#1e3a8a" mb={3} textAlign="center">
          Keranjang Belanja
        </Typography>

        {cartItems.length === 0 ? (
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            Keranjang Anda kosong.
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* LEFT: Produk */}
            <Grid item xs={12} md={7}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={
                      selectedItems.length > 0 && selectedItems.length < cartItems.length
                    }
                  />
                }
                label="Pilih Semua"
                sx={{ mb: 2 }}
              />

              {cartItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    mb: 2,
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  <Avatar
                    src={item.activity.imageUrls[0]}
                    alt={item.activity.title}
                    sx={{ width: 80, height: 80, mr: 2, borderRadius: 2 }}
                    variant="rounded"
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="#2563eb" fontWeight={600}>
                      {item.activity.title}
                    </Typography>
                    <Typography color="text.secondary" mt={0.5}>
                      Rp {item.activity.price.toLocaleString()} x {item.quantity} = Rp{" "}
                      {(item.activity.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
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
                  </Box>
                </Paper>
              ))}
            </Grid>

            {/* RIGHT: Metode Pembayaran + Checkout */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  background: "#f1f5f9",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Pilih Metode Pembayaran
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                  {paymentMethods.map((method) => (
                    <Paper
                      key={method.id}
                      elevation={selectedPaymentMethod === method.id ? 6 : 2}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      sx={{
                        p: 1,
                        width: "48%",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        border:
                          selectedPaymentMethod === method.id
                            ? "2px solid #2563eb"
                            : "1px solid #ccc",
                        borderRadius: 2,
                        backgroundColor:
                          selectedPaymentMethod === method.id ? "#e0f2fe" : "#fff",
                      }}
                    >
                      <Avatar
                        src={method.imageUrl}
                        alt={method.name}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                      <Typography variant="body2" fontWeight={500}>
                        {method.name}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                <Typography variant="h6" mb={2}>
                  Total: <b>Rp {calculateTotal().toLocaleString()}</b>
                </Typography>

                <Button
                  onClick={handleCreateTransaction}
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={checkingOut}
                >
                  {checkingOut ? "Memproses..." : "Bayar Sekarang"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Cart;
