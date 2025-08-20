import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Productos.css";

const API_URL = "http://localhost:8082/products";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", stock: "" });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchProductos();
    // eslint-disable-next-line
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProductos(res.data);
      setError("");
    } catch {
      setError("No se pudieron cargar los productos.");
      setProductos([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return;

    const token = getToken();
    const userId = getUserIdFromToken() || 1;

    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/${form.id}`,
          {
            name: form.name,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          }
        );
      } else {
        await axios.post(
          API_URL,
          {
            name: form.name,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          }
        );
      }
      setForm({ id: null, name: "", price: "", stock: "" });
      setEditMode(false);
      setError("");
      fetchProductos();
    } catch {
      setError("No se pudo guardar el producto (verifica tus permisos).");
    }
  };

  const handleEdit = (prod) => {
    setForm({ ...prod });
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", price: "", stock: "" });
    setEditMode(false);
    setError("");
  };

  return (
    <div className="productos-bg">
      <div className="productos-container">
        <h1 className="productos-title">Productos</h1>
        <form onSubmit={handleSubmit} className="productos-form">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Precio"
            required
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            required
          />
          <button type="submit">{editMode ? "Actualizar" : "Agregar"}</button>
          {editMode && (
            <button type="button" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </form>

        {error && <div className="productos-error">{error}</div>}

        <table className="productos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Creado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.stock}</td>
                <td>{prod.createdAt?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => handleEdit(prod)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Productos;