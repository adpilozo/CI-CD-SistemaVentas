// Header.jsx
import React from "react";
import "./Header.css";

function Header({ user, onLogout }) {
  return (
    <header className="header-main">
      <div className="header-left">
        <span className="header-user">Bienvenido, <strong>{user}</strong></span>
        <nav className="header-nav">
          <a href="/ventas">Ventas</a>
          <a href="/facturas">Facturas</a>
          <a href="/productos">Productos</a>
          <a href="/clientes">Clientes</a>
          <a href="/auditoria">Auditoría</a>
          <a href="/reportes">Reportes</a>
        </nav>
      </div>
      <button className="header-logout" onClick={onLogout}>Cerrar sesión</button>
    </header>
  );
}

export default Header;