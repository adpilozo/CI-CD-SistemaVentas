import React, { useState } from "react";
import api from "./api";
import "./Usuarios.css";

function Usuarios() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("empleado");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await api.post("/auth/register", {
        username,
        password,
        role,
        createdAt: new Date().toISOString().split("T")[0],
      });
      setSuccess("Usuario registrado exitosamente.");
      setUsername("");
      setPassword("");
      setRole("empleado");
    } catch (err) {
      setError("No se pudo registrar el usuario (nombre duplicado u error de servidor).");
    }
  };

  return (
    <div className="usuarios-bg">
      <div className="usuarios-container">
        <h2>Registrar Nuevo Usuario</h2>
        <form className="usuarios-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="empleado">Empleado</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Registrar</button>
        </form>
        {success && <p className="usuarios-success">{success}</p>}
        {error && <p className="usuarios-error">{error}</p>}
      </div>
    </div>
  );
}

export default Usuarios;
