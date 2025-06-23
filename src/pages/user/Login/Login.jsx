import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleLogin = () => {
    const payload = { email: email, password:password };

    axios
      .post("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/login", payload, {
        headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
      })
      .then((res) => {
        const token = res.data.token;
        const userDetails = res.data.data;
        const userRole = res.data.data.role;

        localStorage.setItem("access_token", token);
        localStorage.setItem("user_details", JSON.stringify(userDetails));

        setSuccess(true);
        setError("");

        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-left">
          <h2 className="login-title">Welcome Back 👋</h2>
          <p className="login-subtitle">Masuk ke akun HappyTraveling kamu!</p>
          {success && <p className="success-message">Login successful</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="login-form">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleChangeEmail}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChangePassword}
              className="login-input"
            />
            <button onClick={handleLogin} className="login-btn">Login</button>
            <p className="redirect-register">
                Belum punya akun? <a href="/register">Daftar sekarang</a>
            </p>
          </div>
        </div>

        <div className="login-right">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Travel Banner"
            className="login-banner"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
