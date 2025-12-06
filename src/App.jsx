import { useState } from 'react';
import Login from './login';
import Dashboard from './dashboard';

function App() {
  const [credenciales, setCredenciales] = useState(null);

  const handleLogin = (datosUsuario) => {
    setCredenciales(datosUsuario);
  };

  const handleLogout = () => {
    setCredenciales(null);
  };

  // Renderizado Condicional:
  // Si NO tenemos credenciales -> Mostramos Login
  // Si SÍ tenemos credenciales -> Mostramos Dashboard
  if (!credenciales) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return <Dashboard credenciales={credenciales} onLogout={handleLogout} />;
}

export default App;