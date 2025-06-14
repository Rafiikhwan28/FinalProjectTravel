// App.js
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

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ListBaner from "./pages/Admin/BanerAdmin";
import Header from "./pages/Admin/HeaderAdmin";
import Sidebar from "./pages/Admin/Slider";
import ActivityAdmin from "./pages/Admin/ActivityAdmin";
import CategoryAdmin from "./pages/Admin/CategoryAdmin";
import PromoAdmin from "./pages/Admin/PromoAdmin";
import UserList from "./pages/Admin/UserList";
// import PaymentMethod from "./component/Pyment";
// import ProfilePage from "./component/Profil";
// import DetailBanner from "./component/Baner/DetailBaner";

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
        <Route path="/promo" element={<Promo/>} />
        <Route path="/detail-promo/:id" element={<DetailPromo/>} />

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
