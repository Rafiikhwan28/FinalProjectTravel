import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/user/Login/Login";
import Register from "./pages/user/Register/Register";
import Home from "./pages/user/Home/Home";
import Activity from "./pages/user/Activity/Activity";
import DetailActivity from "./pages/user/Activity/DetailActivity";
import Category from "./pages/user/Category/Category";
import DetailCategory from "./pages/user/Category/DetailCategory";
import Promo from "./pages/user/Promo/Promo";
import DetailPromo from "./pages/user/Promo/DetailPromo";
import Cart from "./pages/user/Cart/Cart";
import ProfilePage from "./pages/user/Profil/Profil";
import ActivityByCategory from "./pages/user/Activity/ActivityByCategoryId";
import Transaksi from "./pages/user/Transaksi/Transaksi.jsx";
import DetailTransaksi from "./pages/user/Transaksi/DetailTransaksi.jsx";
import Footer from "./components/Footer.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListBaner from "./pages/Admin/BanerAdmin";
import Header from "./pages/Admin/HeaderAdmin";
import Sidebar from "./pages/Admin/Slider";
import ActivityAdmin from "./pages/Admin/ActivityAdmin";
import CategoryAdmin from "./pages/Admin/CategoryAdmin";
import PromoAdmin from "./pages/Admin/PromoAdmin";
import UserList from "./pages/Admin/UserList";

import ProtectedRoute from "./components/ProtectedRoute"; // 🟢 Tambahkan ini

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes (protected) */}
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-activity/:id"
          element={
            <ProtectedRoute>
              <DetailActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-category/:id"
          element={
            <ProtectedRoute>
              <DetailCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-category/:id/activities"
          element={
            <ProtectedRoute>
              <ActivityByCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promo"
          element={
            <ProtectedRoute>
              <Promo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-promo/:id"
          element={
            <ProtectedRoute>
              <DetailPromo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <Transaksi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transaksi/:id"
          element={
            <ProtectedRoute>
              <DetailTransaksi />
            </ProtectedRoute>
          }
        />

        <Route path="/footer" element={<Footer />} />

        {/* Admin routes (protected juga) */}
        <Route
          path="/header-admin"
          element={
            <ProtectedRoute>
              <Header />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slider-admin"
          element={
            <ProtectedRoute>
              <Sidebar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-admin"
          element={
            <ProtectedRoute>
              <ActivityAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category-admin"
          element={
            <ProtectedRoute>
              <CategoryAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listBaner-admin"
          element={
            <ProtectedRoute>
              <ListBaner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/promo-admin"
          element={
            <ProtectedRoute>
              <PromoAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userlist"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
