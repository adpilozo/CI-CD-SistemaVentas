import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Clientes.css";

const API_URL = "http://localhost:8081/clientes";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    identificationNumber: "",
  });
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
    fetchClientes();
    // eslint-disable-next-line
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClientes(res.data);
      setError("");
    } catch {
      setError("No se pudieron cargar los clientes.");
      setClientes([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === VALIDACIÓN DE CAMPOS ===
  const validateForm = () => {
    // Nombre: solo letras y espacios, mínimo 3
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(form.name.trim())) {
      setError("El nombre debe tener al menos 3 letras y solo puede contener letras y espacios.");
      return false;
    }
    // Email: formato básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    // Teléfono: solo números, 9-15 dígitos
    if (!/^\d{9,15}$/.test(form.phone.trim())) {
      setError("El teléfono debe tener solo números (9-15 dígitos).");
      return false;
    }
    // Dirección: mínimo 5 caracteres
    if (form.address.trim().length < 5) {
      setError("La dirección debe tener al menos 5 caracteres.");
      return false;
    }
    // Número de identificación: solo números, exactamente 10 dígitos
    if (!/^\d{10}$/.test(form.identificationNumber.trim())) {
      setError("El número de identificación debe tener exactamente 10 dígitos numéricos.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const userId = getUserIdFromToken();

    if (!validateForm()) return;

    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/${form.id}`,
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            identificationNumber: form.identificationNumber.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              UserId: userId,
            },
          }
        );
      } else {
        await axios.post(
          API_URL,
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            identificationNumber: form.identificationNumber.trim(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              UserId: userId,
            },
          }
        );
      }
      setForm({ id: null, name: "", email: "", phone: "", address: "", identificationNumber: "" });
      setEditMode(false);
      setError("");
      fetchClientes();
    } catch {
      setError("No se pudo guardar el cliente (verifica tus permisos o si el email/identificación ya existe).");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;

    const token = getToken();
    const userId = getUserIdFromToken();

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          UserId: userId,
        },
      });
      fetchClientes();
      setError("");
    } catch {
      setError("No se pudo eliminar el cliente (verifica tus permisos).");
    }
  };

  const handleEdit = (cliente) => {
    setForm({ ...cliente });
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", email: "", phone: "", address: "", identificationNumber: "" });
    setEditMode(false);
    setError("");
  };

  return (
    <div className="clientes-bg">
      <div className="clientes-container">
        <h1 className="clientes-title">Clientes</h1>

        <form onSubmit={handleSubmit} className="clientes-form">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
          <input
            name="identificationNumber"
            value={form.identificationNumber}
            onChange={handleChange}
            placeholder="Número de identificación (10 dígitos)"
            required
            maxLength={10}
            pattern="\d{10}"
            title="Debe tener exactamente 10 dígitos numéricos"
          />
          <button type="submit">{editMode ? "Actualizar" : "Agregar"}</button>
          {editMode && (
            <button type="button" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </form>

        {error && <div className="clientes-error">{error}</div>}

        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Número Identificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.name}</td>
                <td>{cliente.email}</td>
                <td>{cliente.phone}</td>
                <td>{cliente.address}</td>
                <td>{cliente.identificationNumber}</td>
                <td>
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clientes;
