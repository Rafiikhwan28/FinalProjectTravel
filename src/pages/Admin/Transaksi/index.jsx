import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransaksiAllUser.css";

const TransaksiAllUser = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusUpdates, setStatusUpdates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions";
  const API_HEADERS = {
    apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_URL, { headers: API_HEADERS });
      setTransactions(res.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getFilteredTransactions = () => {
    if (filterStatus === "all") return transactions;
    return transactions.filter((t) => t.status.toLowerCase() === filterStatus);
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleUpdateStatus = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return alert("Pilih status terlebih dahulu.");

    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${id}`,
        { status: newStatus },
        { headers: API_HEADERS }
      );
      alert("Status transaksi berhasil diperbarui!");
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui status transaksi.");
    }
  };

  const filteredTransactions = getFilteredTransactions();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="transaksi-container">
      <h2>All User Transactions</h2>

      {/* Filter */}
      <div className="filter-container">
        <label>Filter Status: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">Semua</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="success">Success</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <table className="transaksi-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>User ID</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Total</th>
            <th>Order Date</th>
            <th>Items</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                Tidak ada transaksi ditemukan.
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.invoiceId}</td>
                <td>{transaction.userId}</td>
                <td>{transaction.payment_method?.name || "N/A"}</td>
                <td>{transaction.status}</td>
                <td>Rp {transaction.totalAmount.toLocaleString()}</td>
                <td>{new Date(transaction.orderDate).toLocaleDateString()}</td>
                <td>
                  <ul className="item-list">
                    {transaction.transaction_items.map((item) => (
                      <li key={item.id} className="item">
                        {item.imageUrls?.[0] && item.imageUrls[0].startsWith("http") ? (
                          <img
                          src={item.imageUrls[0] ? item.imageUrls : "https://placehold.co/150x150/png?text=No+Image"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/150x150/png?text=No+Image";
                          }}
                        />
                        ):(
                          <div className="no-image">No image</div>
                        )}
                        
                        <div>
                          <p>{item.title}</p>
                          <small>
                            {item.quantity} x Rp {item.price.toLocaleString()}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <select
                    value={statusUpdates[transaction.id] || transaction.status}
                    onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="success">Success</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button
                    className="update-button"
                    onClick={() => handleUpdateStatus(transaction.id)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransaksiAllUser;
