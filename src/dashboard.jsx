import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ credenciales, onLogout }) {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); // Para el modal de detalles
  
  // Estado inicial del formulario con TODOS los campos de tu entidad Java
  const initialState = {
    cliente: '',
    proveedor: '',
    valor: '',
    propina: 0,
    pais: '',
    departamento: '',
    ciudad: '',
    nomenclaturaVivienda: '',
    estado: 'PENDIENTE'
  };

  const [nuevoPedido, setNuevoPedido] = useState(initialState);
  
  const API_URL = 'https://pedidoshexagonales.onrender.com/api/v1';
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPedido(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrear = (e) => {
    e.preventDefault();
    // Convertimos a números lo que debe ser número
    const payload = {
        ...nuevoPedido,
        valor: parseFloat(nuevoPedido.valor),
        propina: parseFloat(nuevoPedido.propina)
    };

    axios.post(`${API_URL}/pedidos`, payload, axiosConfig)
      .then(() => {
        alert('Pedido creado exitosamente');
        setNuevoPedido(initialState); // Limpiar form
        cargarPedidos(); // Recargar lista
      })
      .catch(err => {
        console.error(err);
        alert('Error al crear pedido');
      });
  };

  // Función para abrir el modal
  const verDetalles = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setPedidoSeleccionado(null);
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📦 Gestión de Pedidos</h1>
        <button onClick={onLogout} className="btn btn-outline-danger">Cerrar Sesión</button>
      </div>

      <div className="row">
        {/* --- FORMULARIO DE CREACIÓN (IZQUIERDA) --- */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Nuevo Pedido</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCrear}>
                <div className="row g-2">
                  <div className="col-md-6 mb-2">
                    <label className="form-label small">Cliente</label>
                    <input name="cliente" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.cliente} onChange={handleChange} required placeholder="Nombre Cliente"/>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label small">Proveedor</label>
                    <input name="proveedor" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.proveedor} onChange={handleChange} required placeholder="Empresa Prov."/>
                  </div>

                  <div className="col-md-6 mb-2">
                    <label className="form-label small">Valor Base ($)</label>
                    <input name="valor" type="number" className="form-control form-control-sm" 
                      value={nuevoPedido.valor} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label small">Propina ($)</label>
                    <input name="propina" type="number" className="form-control form-control-sm" 
                      value={nuevoPedido.propina} onChange={handleChange} />
                  </div>

                  <div className="col-12"><hr className="my-1"/></div>
                  <h6 className="small text-muted mb-2">Datos de Envío</h6>

                  <div className="col-md-4 mb-2">
                    <input name="pais" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.pais} onChange={handleChange} placeholder="País" required/>
                  </div>
                  <div className="col-md-4 mb-2">
                    <input name="departamento" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.departamento} onChange={handleChange} placeholder="Depto/Estado" required/>
                  </div>
                  <div className="col-md-4 mb-2">
                    <input name="ciudad" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.ciudad} onChange={handleChange} placeholder="Ciudad" required/>
                  </div>
                  <div className="col-12 mb-3">
                    <input name="nomenclaturaVivienda" type="text" className="form-control form-control-sm" 
                      value={nuevoPedido.nomenclaturaVivienda} onChange={handleChange} placeholder="Dirección / Nomenclatura" required/>
                  </div>
                </div>

                <button className="btn btn-primary w-100">Registrar Pedido</button>
              </form>
            </div>
          </div>
        </div>

        {/* --- LISTA DE PEDIDOS (DERECHA) --- */}
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Historial de Pedidos</h5>
            </div>
            <div className="list-group list-group-flush" style={{maxHeight: '600px', overflowY: 'auto'}}>
              {pedidos.length === 0 && <div className="p-3 text-center text-muted">No hay pedidos registrados aún.</div>}
              
              {pedidos.map(p => (
                <div key={p.id} className="list-group-item list-group-item-action p-3">
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">#{p.id} - {p.cliente}</h6>
                      <small className="text-muted">Fecha: {p.fecha ? new Date(p.fecha).toLocaleDateString() : 'N/A'}</small>
                    </div>
                    <div className="text-end">
                        <span className={`badge ${p.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'} mb-1`}>
                          {p.estado}
                        </span>
                        <br/>
                        <button onClick={() => verDetalles(p)} className="btn btn-sm btn-outline-info py-0" style={{fontSize: '0.8rem'}}>
                          Ver Detalles
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE DETALLES (POPUP) --- */}
      {pedidoSeleccionado && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Pedido #{pedidoSeleccionado.id}</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6">
                    <p><strong>Cliente:</strong> {pedidoSeleccionado.cliente}</p>
                    <p><strong>Proveedor:</strong> {pedidoSeleccionado.proveedor || 'No especificado'}</p>
                    <p><strong>Estado:</strong> {pedidoSeleccionado.estado}</p>
                  </div>
                  <div className="col-6 text-end">
                     <p><strong>Fecha Creación:</strong><br/> {pedidoSeleccionado.fecha}</p>
                  </div>
                </div>
                <hr/>
                <h6>📍 Dirección de Envío</h6>
                <p className="mb-1">{pedidoSeleccionado.nomenclaturaVivienda}</p>
                <p className="text-muted small">
                  {pedidoSeleccionado.ciudad}, {pedidoSeleccionado.departamento} ({pedidoSeleccionado.pais})
                </p>
                <hr/>
                <h6>💰 Desglose Económico</h6>
                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${pedidoSeleccionado.valor}</span>
                </div>
                <div className="d-flex justify-content-between">
                    <span>Propina:</span>
                    <span>${pedidoSeleccionado.propina || 0}</span>
                </div>
                <div className="d-flex justify-content-between mt-2 fw-bold fs-5">
                    <span>TOTAL:</span>
                    <span className="text-success">${pedidoSeleccionado.valorTotal}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;