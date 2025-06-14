import React, { useEffect, useState } from "react";
import axios from "axios";
import './TransaksiAllUser.css'

const TransaksiAllUser = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions"; // Ganti dengan URL API yang sesuai
  const API_HEADERS = {
    apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c", // Ganti dengan API key Anda
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhbnRlbmdtYWtzaW1hbEB5b3BtYWlsLmNvbSIsInVzZXJJZCI6IjU4ZTY2MGQyLWJmODQtNDE4NC1iMmM5LWI4NTI1Njk3OWIwOSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDYzMDc0NH0.NqE5Not8iNEy1kyak7eJbNzK9ExFnMTfRZDYOjY01KM" // Ganti dengan token yang sesuai
  };

  // Mengambil data transaksi dari API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}`, { headers: API_HEADERS });
        setTransactions(response.data.data); // Sesuaikan dengan struktur data API Anda
        setError(null);
      } catch (err) {
        setError("Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All User Transactions</h2>
      <p>View all transactions made by users.</p>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>User ID</th>
            <th>Payment Method</th>
            <th>Invoice ID</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Order Date</th>
            <th>Transaction Items</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.userId}</td>
              <td>
                {transaction.payment_method ? transaction.payment_method.name : "N/A"}
              </td>
              <td>{transaction.invoiceId}</td>
              <td>{transaction.status}</td>
              <td>{transaction.totalAmount}</td>
              <td>{new Date(transaction.orderDate).toLocaleDateString()}</td>
              <td>
                <ul>
                  {transaction.transaction_items.map((item) => (
                    <li key={item.id}>
                      <img
                        src={item.imageUrls[0] || "https://via.placeholder.com/150"}
                        alt={item.title}
                        style={{ width: "50px", height: "50px" }}
                      />
                      <p>{item.title}</p>
                      <p>{item.quantity} x ${item.price}</p>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransaksiAllUser;
