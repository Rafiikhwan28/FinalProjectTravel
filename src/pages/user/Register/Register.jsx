import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    role: "",
    profilePictureUrl: "",
    phoneNumber: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.passwordRepeat || !form.role) {
      setError("Semua field wajib diisi kecuali profile picture");
      return;
    }
    if (form.password !== form.passwordRepeat) {
      setError("Password dan Repeat Password tidak sama");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        passwordRepeat: form.passwordRepeat,
        role: form.role,
        profilePictureUrl: form.profilePictureUrl,
        phoneNumber: form.phoneNumber,
      };

      const res = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register",
        payload,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
      setForm({
        name: "",
        email: "",
        password: "",
        passwordRepeat: "",
        role: "",
        profilePictureUrl: "",
        phoneNumber: "",
      });

      setIsRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
    }
  };

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, navigate]);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form">
          <h1 className="logo">Buat Akun Baru</h1>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              value={form.name}
              name="name"
              onChange={handleChange}
              placeholder="Nama Lengkap"
              required
            />
            <input
              className="input-field"
              type="email"
              value={form.email}
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              className="input-field"
              type="password"
              value={form.password}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <input
              className="input-field"
              type="password"
              value={form.passwordRepeat}
              name="passwordRepeat"
              onChange={handleChange}
              placeholder="Ulangi Password"
              required
            />
            <select
              className="input-field"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              >
              <option value="">Pilih Peran</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <input
              className="input-field"
              type="text"
              value={form.profilePictureUrl}
              name="profilePictureUrl"
              onChange={handleChange}
              placeholder="URL Foto Profil (opsional)"
            />
            <input
              className="input-field"
              type="text"
              value={form.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              placeholder="Nomor Telepon (opsional)"
            />
            <button className="submit-button" type="submit">Daftar</button>
            <p className="redirect-login">Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
          </form>
        </div>
        <div className="register-banner">
          <img src="https://source.unsplash.com/600x800/?travel,nature" alt="Travel Banner" />
        </div>
      </div>
    </div>
  );
};

export default Register;
