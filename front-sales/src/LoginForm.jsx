import React, { useState } from "react";
import api from "./api";
import { jwtDecode } from "jwt-decode";
import "./LoginForm.css"; // Asegúrate de tener un archivo CSS para estilos

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { username, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];

      onLogin({
        username: decoded.sub,
        roles,
      });
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <button type="submit" className="login-btn">
          Ingresar
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginForm;
