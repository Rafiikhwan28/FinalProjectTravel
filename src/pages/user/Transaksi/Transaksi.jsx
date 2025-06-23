import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  CircularProgress,
  Button,
  Grid,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [proofFile, setProofFile] = useState(null);
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
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-transactions`, { headers });
      setTransactions(response.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memuat transaksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (id) => {
    navigate(`/transaksi/${id}`);
  };

  const handleUploadDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenUpload(true);
  };

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };

  const submitProofPayment = async () => {
    if (!proofFile || !selectedTransaction) return;
    const formData = new FormData();
    formData.append("proof", proofFile);

    try {
      await axios.post(`${BASE_URL}/upload-proof/${selectedTransaction.id}`, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Bukti pembayaran berhasil diupload.");
      fetchTransactions();
      setOpenUpload(false);
      setProofFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal upload bukti pembayaran.");
    }
  };

  const cancelTransaction = async (id) => {
    if (!window.confirm("Yakin batalkan transaksi ini?")) return;

    try {
      await axios.post(`${BASE_URL}/cancel-transaction/${id}`, {}, { headers });
      alert("Transaksi berhasil dibatalkan.");
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan transaksi.");
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
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant="h4" mb={3}>
          Riwayat Transaksi
        </Typography>

        {transactions.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography>Tidak ada transaksi ditemukan.</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {transactions.map((transaction) => (
              <Grid item xs={12} md={6} lg={4} key={transaction.id}>
                <Card elevation={4} sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={transaction.transaction_items[0]?.imageUrls[0] || "/default-image.jpg"}
                    alt={transaction.transaction_items[0]?.title || "Produk"}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {transaction.transaction_items[0]?.title || "Produk"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Invoice: {transaction.invoiceId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tanggal: {new Date(transaction.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Metode: {transaction.payment_method?.name}
                    </Typography>
                    <Typography variant="h6" mt={1}>
                      Rp {transaction.totalAmount.toLocaleString()}
                    </Typography>
                    <Chip
                      label={transaction.status.toUpperCase()}
                      color={getStatusColor(transaction.status)}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <Grid container spacing={1} sx={{ px: 2, pb: 2 }}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleDetail(transaction.id)}
                      >
                        Detail
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton color="success" onClick={() => handleUploadDialog(transaction)}>
                        <UploadFileIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton color="error" onClick={() => cancelTransaction(transaction.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      {/* Dialog Upload Bukti */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>Batal</Button>
          <Button onClick={submitProofPayment} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Transaksi;
