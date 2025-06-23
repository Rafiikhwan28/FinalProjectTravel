import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import Navbar from "../../../components/Navbar";

const DetailTransaksi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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
    fetchTransactionDetail();
  }, []);

  const fetchTransactionDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction/${id}`, {
        headers,
      });
      setTransaction(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memuat detail transaksi.");
      navigate("/transaksi");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "success":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleUploadProof = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("proofPayment", file);

    try {
      setUploading(true);
      const response = await axios.post(`${BASE_URL}/update-transaction-proof-payment/${id}`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      // Ambil proofPaymentUrl dari response API
      const { proofPaymentUrl } = response.data.data;

      // Update transaction.proofPaymentUrl secara lokal
      setTransaction((prev) => ({
        ...prev,
        proofPaymentUrl,
      }));

      alert("Bukti pembayaran berhasil diupload.");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal upload bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelTransaction = async () => {
    if (!window.confirm("Yakin ingin membatalkan transaksi ini?")) return;
    try {
      setCancelling(true);
      await axios.delete(`${BASE_URL}/cancel-transaction/${id}`, { headers });
      alert("Transaksi berhasil dibatalkan.");
      fetchTransactionDetail();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan transaksi.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!transaction) return null;

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, maxWidth: "1000px", mx: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Detail Transaksi
        </Typography>

        <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Invoice: {transaction.invoiceId}
          </Typography>
          <Typography>Total: <strong>Rp {transaction.totalAmount.toLocaleString()}</strong></Typography>
          <Typography>Tanggal: {new Date(transaction.orderDate).toLocaleDateString()}</Typography>
          <Typography>Metode Pembayaran: <strong>{transaction.payment_method?.name}</strong></Typography>
          <Typography>VA Number: <strong>{transaction.payment_method?.virtual_account_number}</strong></Typography>

          <Chip
            label={transaction.status.toUpperCase()}
            color={getStatusColor(transaction.status)}
            sx={{ mt: 2 }}
          />

          {transaction.proofPaymentUrl && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" mb={1}>
                Bukti Pembayaran:
              </Typography>
              <a href={transaction.proofPaymentUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={transaction.proofPaymentUrl}
                  alt="Bukti Pembayaran"
                  style={{ width: "100%", maxWidth: "400px", borderRadius: 8 }}
                />
              </a>
            </Box>
          )}

          {transaction.status === "pending" && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                component="label"
                color="primary"
                disabled={uploading}
                sx={{ mr: 2 }}
              >
                {uploading ? "Uploading..." : "Upload Bukti Pembayaran"}
                <input type="file" hidden accept="image/*" onChange={handleUploadProof} />
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelTransaction}
                disabled={cancelling}
              >
                {cancelling ? "Membatalkan..." : "Batalkan Transaksi"}
              </Button>
            </Box>
          )}
        </Paper>

        <Typography variant="h5" gutterBottom>
          Produk dalam Transaksi
        </Typography>

        <Grid container spacing={2}>
          {transaction.transaction_items?.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrls[0]}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {item.description?.slice(0, 100)}...
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>Harga: Rp {item.price.toLocaleString()}</Typography>
                  <Typography>Qty: {item.quantity}</Typography>
                  <Typography fontWeight="bold" color="primary">
                    Subtotal: Rp {(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/transaksi")}
          sx={{ mt: 4 }}
        >
          Kembali ke Riwayat Transaksi
        </Button>
      </Box>
    </>
  );
};

export default DetailTransaksi;
