/* eslint-disable react-refresh/only-export-components */
// controla quién está logueado, guarda la sesión, la recupera al recargar y decide cuándo redirigir
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// asegura que se sepa a donde mandar las peticiones
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // inicializo hook de navegacion
  const navigate = useNavigate();
  // inicializa los estados, sino asigna null
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null);
  const [user, setUser] = useState(() => {
    const userGuardado = localStorage.getItem('user');
    if (userGuardado) {
      try {
        return JSON.parse(userGuardado);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // borra los datos del usuario 
  const limpiarSesion = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setToken(null);
    setUserType(null);
    setUser(null);
  }, []);

  // efecto de verificacion de sesion
  useEffect(() => {
    const verificarSesion = async () => {
      // traemos la informacion
      const tokenGuardado = localStorage.getItem('token');
      const tipoGuardado = localStorage.getItem('userType');

      // si no hay sesion guardada
      if (!tokenGuardado || !tipoGuardado) {
        setIsLoading(false);
        return;
      }

      // define a que url se conectará, dependiendo del usuario
      const endpoint = tipoGuardado === 'admin' ? '/api/admin/metricas' : '/api/client/perfil';

      try {
        const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${tokenGuardado}` },
        });

        // verifica que sea cliente
        if (tipoGuardado === 'client' && res.data?.cliente) {
          // actualiza el estado del usuario
          const usuarioActualizado = { ...res.data.cliente, type: 'client' };
          setUser(usuarioActualizado);
          localStorage.setItem('user', JSON.stringify(usuarioActualizado));
        }
      } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
          limpiarSesion();
        }
      } finally {
        setIsLoading(false);
      }
    };
    verificarSesion();
  }, [limpiarSesion]);

  // login Cliente
  const loginClient = async (email, password) => {
    try {
      // manda el mail y contraseña al endpoint para validar
      const res = await axios.post(`${API_URL}/api/auth/client/login`, { email, password });
      const { token: nuevoToken, refreshToken, cliente, user: userData } = res.data;
      // armo objeto usuario
      const usuarioObj = cliente || userData || { email };
      // guardo el token de acceso, de actualizacion, y datos del usuario en el localstorage
      localStorage.setItem('token', nuevoToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userType', 'client');
      localStorage.setItem('user', JSON.stringify(usuarioObj));
      setToken(nuevoToken);
      setUserType('client');
      setUser(usuarioObj);
      // redirige al dashboard
      navigate('/cliente/dashboard');
      return usuarioObj;
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'Error al iniciar sesión como cliente';
      throw new Error(msg, { cause: error });
    }
  };

  // login Admin
  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin/login`, { email, password });
      const { token: nuevoToken, refreshToken, usuario, admin: adminData, user: userData } = res.data;
      const usuarioObj = usuario || adminData || userData || res.data;

      localStorage.setItem('token', nuevoToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('user', JSON.stringify(usuarioObj));

      setToken(nuevoToken);
      setUserType('admin');
      setUser(usuarioObj);
      navigate('/admin/dashboard');

      return usuarioObj;
    } catch (error) {
      const msg = error.response?.data?.mensaje || error.message || 'Error al iniciar sesión';
      throw new Error(msg, { cause: error });
    }
  };

  // renovar Token
  const renovarToken = useCallback(async () => {
    try {
      const refreshTokenGuardado = localStorage.getItem('refreshToken');
      if (!refreshTokenGuardado) return null;

      const res = await axios.post(`${API_URL}/api/auth/refresh`, {
        refreshToken: refreshTokenGuardado,
      });

      const nuevoAccessToken = res.data.token;
      localStorage.setItem('token', nuevoAccessToken);
      setToken(nuevoAccessToken);
      return nuevoAccessToken;
    } catch {
      limpiarSesion();
      return null;
    }
  }, [limpiarSesion]);

  // logout
  const logout = useCallback(async (destino = '/') => {
    // lee antes de limpiar
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedType = localStorage.getItem('userType');

    try {
      if (storedRefreshToken) {
        await axios.post(`${API_URL}/api/auth/logout`, {
          refreshToken: storedRefreshToken,
          type: storedType,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      limpiarSesion();
      navigate(destino);
    }
  }, [limpiarSesion, navigate]);

  const value = {
    user,
    token,
    userType,
    isLoading,
    loginClient,
    loginAdmin,
    renovarToken,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-200">
          <p className="text-sm font-medium">Verificando sesión...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}