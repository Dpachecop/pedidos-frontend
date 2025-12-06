import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // URL del backend
    const API_URL = 'https://pedidoshexagonales.onrender.com/api/v1/auth/login';

    axios.post(API_URL, {
      correo: correo,
      password: password
    })
    .then(response => {
      // Si el login es correcto, el backend devuelve 200 OK
      // Guardamos las credenciales para usarlas en las siguientes peticiones
      const credenciales = { username: correo, password: password };
      onLoginSuccess(credenciales);
    })
    .catch(err => {
      console.error(err);
      setError('Credenciales incorrectas o error de conexión');
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input 
              type="email" 
              className="form-control" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;