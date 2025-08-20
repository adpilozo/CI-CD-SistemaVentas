import React, { useState } from "react";
import axios from "axios";
import "./Reportes.css";

const API_URL = "http://localhost:8084/sales/report/daily";
// Fechas mínimas y máximas permitidas en formato YYYY-MM-DD
const MIN_DATE = "2020-01-01";
const MAX_DATE = "2030-01-01";

function Reportes() {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const handleDownload = async () => {
    // Validación adicional en JS por si acaso
    if (!date) {
      setError("Por favor selecciona una fecha.");
      return;
    }
    if (date < MIN_DATE || date > MAX_DATE) {
      setError("La fecha debe estar entre 01/01/2020 y 01/01/2030.");
      return;
    }
    setError("");
    try {
      const res = await axios.get(`${API_URL}?date=${date}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_ventas_${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError("Error al descargar el reporte.");
    }
  };

  return (
    <div className="reportes-bg">
      <div className="reportes-container">
        <h1 className="reportes-title">Reporte Diario de Ventas</h1>
        <form className="reportes-form" onSubmit={e => { e.preventDefault(); handleDownload(); }}>
          <input
            type="date"
            value={date}
            min={MIN_DATE}
            max={MAX_DATE}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="reportes-btn" type="submit">
            Descargar Reporte PDF
          </button>
        </form>
        {error && <div className="reportes-error">{error}</div>}
      </div>
    </div>
  );
}

export default Reportes;
