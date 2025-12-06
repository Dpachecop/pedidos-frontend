import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ credenciales, onLogout }) {
  const [pedidos, setPedidos] = useState([]);
  const [nuevoPedido, setNuevoPedido] = useState({ cliente: '', valor: '', estado: 'PENDIENTE' });
  
  const API_URL = 'https://pedidoshexagonales.onrender.com/api/v1';
  
  // Configuración de cabeceras para autenticación básica
  const axiosConfig = {
    auth: credenciales
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = () => {
    axios.get(`${API_URL}/pedidos`, axiosConfig)
      .then(res => setPedidos(res.data))
      .catch(err => console.error("Error cargando pedidos", err));
  };

  const handleCrear = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/pedidos`, nuevoPedido, axiosConfig)
      .then(() => {
        alert('Pedido creado!');
        setNuevoPedido({ cliente: '', valor: '', estado: 'PENDIENTE' }); // Limpiar form
        cargarPedidos(); // Recargar lista
      })
      .catch(err => alert('Error al crear pedido'));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Pedidos</h1>
        <button onClick={onLogout} className="btn btn-outline-danger">Cerrar Sesión</button>
      </div>

      <div className="row">
        {/* Formulario de Creación */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">Nuevo Pedido</div>
            <div className="card-body">
              <form onSubmit={handleCrear}>
                <div className="mb-2">
                  <label>Cliente</label>
                  <input type="text" className="form-control" 
                    value={nuevoPedido.cliente}
                    onChange={e => setNuevoPedido({...nuevoPedido, cliente: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label>Valor ($)</label>
                  <input type="number" className="form-control" 
                    value={nuevoPedido.valor}
                    onChange={e => setNuevoPedido({...nuevoPedido, valor: e.target.value})} required />
                </div>
                <button className="btn btn-success w-100 mt-2">Guardar Pedido</button>
              </form>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Últimos Pedidos</div>
            <ul className="list-group list-group-flush">
              {pedidos.length === 0 ? <li className="list-group-item">No hay pedidos registrados.</li> : null}
              {pedidos.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>#{p.id} - {p.cliente}</strong>
                    <br/>
                    <small className="text-muted">Estado: {p.estado}</small>
                  </div>
                  <span className="badge bg-primary rounded-pill align-self-center">
                    ${p.valorTotal || p.valor}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;