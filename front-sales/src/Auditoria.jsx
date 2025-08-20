import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Auditoria.css";

const API_URL = "http://localhost:8082/product-changes";

function Auditoria() {
  const [changes, setChanges] = useState([]);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchChanges();
    // eslint-disable-next-line
  }, []);

  const fetchChanges = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setChanges(res.data);
      setError("");
    } catch {
      setError("No se pudieron cargar los cambios de productos.");
      setChanges([]);
    }
  };

  return (
    <div className="auditoria-bg">
      <div className="auditoria-container">
        <h1 className="auditoria-title">Auditoría de Cambios en Productos</h1>

        {error && <div className="auditoria-error">{error}</div>}

        <table className="auditoria-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Producto</th>
              <th>Tipo de Cambio</th>
              <th>Valor Anterior</th>
              <th>Valor Nuevo</th>
              <th>Cambiado Por (ID)</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.id}>
                <td>{change.id}</td>
                <td>{change.productId}</td>
                <td>{change.changeType}</td>
                <td>{change.oldValue !== null ? change.oldValue : "-"}</td>
                <td>{change.newValue !== null ? change.newValue : "-"}</td>
                <td>{change.changedBy}</td>
                <td>{change.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Auditoria;
