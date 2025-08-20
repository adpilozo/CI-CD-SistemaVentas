import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./MainMenu.css";

function MainMenu({ user, roles, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const isEmpleado = Array.isArray(roles) && roles.includes("empleado") && !roles.includes("admin");
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  return (
    <header className="mainmenu-header">
      <div className="mainmenu-left">
        <span className="mainmenu-user">
          Bienvenido, <strong>{user?.username}</strong>
        </span>
        <nav className="mainmenu-nav">
          <NavLink to="/ventas">Ventas</NavLink>
          {(isAdmin || isEmpleado) && (
            <NavLink to="/reportes">Reportes</NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/productos">Productos</NavLink>
              <NavLink to="/clientes">Clientes</NavLink>
              <NavLink to="/auditoria">Auditoría</NavLink>
              <NavLink to="/usuarios">Usuarios</NavLink> {/* Nuevo módulo */}
            </>
          )}
        </nav>
      </div>
      <button className="mainmenu-logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </header>
  );
}

export default MainMenu;