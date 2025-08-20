import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginForm from "./LoginForm";
import Clientes from "./Clientes";
import Inventario from "./Inventario";
import Auditoria from "./Auditoria";
import Facturas from "./Facturas";
import MainMenu from "./MainMenu";
import Ventas from "./Ventas";
import Productos from "./Productos";
import Usuarios from "./Usuarios";
import Reportes from "./Reportes";
import { jwtDecode } from "jwt-decode";

function PrivateRoute({ user, roles, children }) {
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/forbidden" />;
  }
  return children ? children : <Outlet />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.sub,
          roles: decoded.roles || [],
        });
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA LOGIN */}
        <Route
          path="/login"
          element={
            !user ? (
              <LoginForm onLogin={setUser} />
            ) : (
              <Navigate to="/ventas" />
            )
          }
        />

        {/* Página de acceso denegado */}
        <Route path="/forbidden" element={<h2>Acceso denegado</h2>} />

        {/* RUTAS PRIVADAS */}
        <Route
          path="/ventas"
          element={
            <PrivateRoute user={user}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Ventas />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute user={user} roles={["admin"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Usuarios />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <PrivateRoute user={user} roles={["admin"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Productos />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute user={user} roles={["admin"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Clientes />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/auditoria"
          element={
            <PrivateRoute user={user} roles={["admin"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Auditoria />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/facturas"
          element={
            <PrivateRoute user={user} roles={["admin", "empleado"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Facturas />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute user={user} roles={["admin", "empleado"]}>
              <>
                <MainMenu user={user} roles={user?.roles || []} onLogout={handleLogout} />
                <Reportes />
              </>
            </PrivateRoute>
          }
        />

        {/* RUTA RAÍZ: Redirige según login */}
        <Route path="/" element={<Navigate to={user ? "/ventas" : "/login"} />} />

        {/* Catch-all: Redirige a "/" */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
