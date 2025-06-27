import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
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





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/activity" element={<Activity/>} />
        <Route path="/detail-activity/:id" element={<DetailActivity/>} />
        <Route path="/category" element={<Category/>} />
        <Route path="/detail-category/:id" element={<DetailCategory/>} />
        <Route path="/detail-category/:id/activities" element={<ActivityByCategory />} />
        <Route path="/promo" element={<Promo/>} />
        <Route path="/detail-promo/:id" element={<DetailPromo/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/transaksi" element={<Transaksi/>} />
        <Route path="/transaksi/:id" element={<DetailTransaksi />} />
        <Route path="/footer" element={<Footer/>} />


        <Route path="/header-admin" element={<Header/>}/>
        <Route path="/slider-admin" element={<Sidebar/>}/>
        <Route path="/activity-admin" element={<ActivityAdmin/>}/>
        <Route path="/category-admin" element={<CategoryAdmin/>}/>
        <Route path="/listBaner-admin" element={<ListBaner/>}/>
        <Route path="/promo-admin" element={<PromoAdmin/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/userlist" element={<UserList/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
