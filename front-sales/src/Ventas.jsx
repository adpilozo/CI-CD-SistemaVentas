import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Ventas.css";

const PRODUCTS_API = "http://localhost:8082/products";
const SALES_API = "http://localhost:8084/sales";
const CLIENTS_API = "http://localhost:8081/clientes";

function Ventas() {
  const [productos, setProductos] = useState([]);
  const [ventaActiva, setVentaActiva] = useState(false);
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clienteError, setClienteError] = useState("");
  const [itemsSeleccionados, setItemsSeleccionados] = useState({});
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const getToken = () => localStorage.getItem("token");

  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get(PRODUCTS_API, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProductos(res.data);
      setError("");
    } catch {
      setError("No se pudieron cargar los productos.");
    }
  };

  const buscarCliente = async () => {
    setCliente(null);
    setClienteError("");

    if (!identificationNumber) return;

    try {
      const res = await axios.get(
        `${CLIENTS_API}/identification/${identificationNumber}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setCliente(res.data);
      setClienteError("");
    } catch {
      setCliente(null);
      setClienteError(
        "No hay persona registrada con ese número de identificación."
      );
    }
  };

  const toggleVenta = () => {
    setVentaActiva(!ventaActiva);
    setIdentificationNumber("");
    setCliente(null);
    setClienteError("");
    setItemsSeleccionados({});
    setError("");
    setExito("");
    setBusqueda("");
  };

  const aumentarCantidad = (id) => {
    setItemsSeleccionados((prev) => {
      const currentQty = prev[id] || 0;
      const producto = productos.find((p) => p.id === id);
      if (!producto) return prev;
      if (currentQty >= producto.stock) return prev;
      return { ...prev, [id]: currentQty + 1 };
    });
  };

  const disminuirCantidad = (id) => {
    setItemsSeleccionados((prev) => {
      const currentQty = prev[id] || 0;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: currentQty - 1 };
    });
  };

  const handleSubmit = async () => {
    setError("");
    setExito("");

    if (!cliente) {
      setError("Debes buscar y seleccionar un cliente válido antes de generar la venta.");
      return;
    }
    if (Object.keys(itemsSeleccionados).length === 0) {
      setError("Selecciona al menos un producto.");
      return;
    }

    const userId = getUserIdFromToken();

    const payload = {
      sale: {
        userId: userId,
        customerId: cliente.id,
      },
      items: Object.entries(itemsSeleccionados).map(([productId, quantity]) => {
        const prod = productos.find((p) => p.id === parseInt(productId));
        return {
          productId: parseInt(productId),
          quantity,
          price: prod.price,
        };
      }),
    };

    try {
      const response = await axios.post(SALES_API, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const ventaCreada = response.data;
      const ventaId = ventaCreada.id;

      // ✅ Llamada simple: el backend imprime la factura en consola
      await axios.get(`${SALES_API}/${ventaId}/invoice`);

      setExito("Venta creada correctamente.");
      toggleVenta();
    } catch {
      setError("Error al crear la venta.");
    }
  };

  const productosFiltrados = productos.filter((prod) =>
    prod.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalVenta = Object.entries(itemsSeleccionados).reduce(
    (total, [productId, qty]) => {
      const producto = productos.find((p) => p.id === parseInt(productId));
      if (!producto) return total;
      return total + producto.price * qty;
    },
    0
  );

  return (
    <div className="ventas-bg">
      <div className="ventas-container">
        <h1 className="ventas-title">Ventas</h1>
        <button onClick={toggleVenta} className="ventas-btn-principal">
          {ventaActiva ? "Cancelar Venta" : "NUEVA VENTA"}
        </button>

        {ventaActiva && (
          <div className="ventas-panel">
            <label className="ventas-label">
              Número de identificación:
              <input
                type="text"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                className="ventas-input"
              />
              <button onClick={buscarCliente} className="ventas-btn-buscar">
                Buscar
              </button>
            </label>

            {clienteError && <p className="ventas-error">{clienteError}</p>}
            {cliente && (
              <div className="ventas-cliente">
                Cliente: {cliente.name} — {cliente.email}
              </div>
            )}

            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="ventas-input-buscar"
            />

            <div className="ventas-productos-grid">
              {productosFiltrados.length === 0 ? (
                <p>No se encontraron productos.</p>
              ) : (
                productosFiltrados.map((prod) => {
                  const cantidad = itemsSeleccionados[prod.id] || 0;
                  const agotado = prod.stock === 0;
                  return (
                    <div key={prod.id} className="ventas-card-producto">
                      <div>
                        <h3 className="ventas-prod-nombre">{prod.name}</h3>
                        <p className="ventas-prod-precio">
                          ${prod.price.toFixed(2)}
                        </p>
                        <p className={`ventas-prod-stock ${agotado ? "agotado" : ""}`}>
                          {agotado ? "Sin stock" : `Stock: ${prod.stock}`}
                        </p>
                      </div>

                      <div className="ventas-cantidad-control">
                        <button
                          onClick={() => disminuirCantidad(prod.id)}
                          disabled={cantidad === 0}
                          className="ventas-btn-cantidad"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={cantidad}
                          min={0}
                          max={prod.stock}
                          readOnly
                          className="ventas-input-cantidad"
                        />
                        <button
                          onClick={() => aumentarCantidad(prod.id)}
                          disabled={cantidad >= prod.stock}
                          className="ventas-btn-cantidad"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="ventas-total">
              Total: ${totalVenta.toFixed(2)}
            </div>

            <button onClick={handleSubmit} className="ventas-btn-venta">
              Generar Venta
            </button>

            {error && <div className="ventas-error">{error}</div>}
            {exito && <div className="ventas-exito">{exito}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ventas;
