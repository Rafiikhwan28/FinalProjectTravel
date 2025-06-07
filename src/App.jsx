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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
