import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8082/sales";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setFacturas(res.data);
      setError("");
    } catch (error) {
      setError("No se pudieron cargar las facturas.");
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}/invoice`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "blob", // importante para archivos binarios
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `factura_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Error al descargar la factura.");
    }
  };

  return (
    <div>
      <h1>Facturas</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.saleDate?.slice(0, 10)}</td>
              <td>${factura.totalAmount.toFixed(2)}</td>
              <td>
                <button onClick={() => downloadInvoice(factura.id)}>Descargar PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Facturas;