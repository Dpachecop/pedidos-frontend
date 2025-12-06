import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  // URL de tu Backend en Render
  const API_URL = 'https://pedidoshexagonales.onrender.com/api/v1';

  // Usuario y contraseña quemados TEMPORALMENTE para probar
  // (Debes usar un usuario que sepas que existe en tu BD, o crear uno nuevo)
 // Credenciales que usaremos
  const auth = {
    username: 'admin@correo.com', 
    password: '123'
  };

  useEffect(() => {
    // Intentamos obtener los pedidos al cargar la página
    axios.get(`${API_URL}/pedidos`, {
      auth: auth // Enviamos credenciales porque tu backend tiene seguridad activada
    })
    .then(response => {
      console.log("Datos recibidos:", response.data);
      setPedidos(response.data);
    })
    .catch(err => {
      console.error("Error conectando al backend:", err);
      setError("No se pudo conectar al servidor. Revisa la consola.");
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">📦 Pedidos Hexagonales</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">Lista de Pedidos (Desde Render)</h5>
          {pedidos.length === 0 ? (
            <p className="text-muted">No hay pedidos o cargando...</p>
          ) : (
            <ul className="list-group">
              {pedidos.map(p => (
                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <strong>Cliente:</strong> {p.cliente} <br/>
                    <small className="text-muted">{p.fecha}</small>
                  </span>
                  <span className="badge bg-primary rounded-pill">{p.estado}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;