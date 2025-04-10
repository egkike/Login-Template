import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Usuario {
  id: string;
  username: string;
  email: string;
  fullname: string;
  level: number;
  active: number;
  createdate: string;
}

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
}

interface AuthContextType {
  auth: AuthState;
  login: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  verificarSesion: () => Promise<void>;
  updateUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthState>({
    usuario: null,
    isAuthenticated: false,
    isLoggingOut: false,
  });
  const navigate = useNavigate();

  const login = async (username: string, email: string, password: string) => {
    try {
      const datos = { username, email, password };
      const response = await api.post("/login", datos);
      const usuarioDataRaw = response.data.usuario || response.data;
      if (!usuarioDataRaw || !usuarioDataRaw.id) {
        throw new Error("El backend no devolvió un ID de usuario válido");
      }

      const usuarioData: Usuario = {
        id: usuarioDataRaw.id,
        username: usuarioDataRaw.username || "",
        email: usuarioDataRaw.email || "",
        fullname: usuarioDataRaw.fullname || "",
        level: usuarioDataRaw.level ?? 1,
        active: usuarioDataRaw.active ?? 0,
        createdate: usuarioDataRaw.createdate || new Date().toISOString(),
      };

      setAuth({
        usuario: usuarioData,
        isAuthenticated: true,
        isLoggingOut: false,
      });

      if (usuarioData.active === 0) {
        navigate("/change-password", { state: { fromLogin: true } });
      } else {
        navigate("/main");
      }

      return { success: true };
    } catch (error: any) {
      const mensaje =
        error.response?.data?.error || error.message || "Error desconocido";
      return { success: false, message: mensaje };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      // Actualizamos el estado primero
      setAuth({ usuario: null, isAuthenticated: false, isLoggingOut: true });
      // Luego navegamos
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(
        "Error al cerrar sesión:",
        error.response?.data?.error || error.message
      );
      setAuth({ usuario: null, isAuthenticated: false, isLoggingOut: true });
      navigate("/", { replace: true });
    }
  };

  const verificarSesion = async () => {
    if (auth.isLoggingOut) return;
    try {
      const response = await api.get("/session");
      const usuarioDataRaw = response.data.tokenData || response.data;
      if (usuarioDataRaw) {
        const usuarioData: Usuario = {
          id: usuarioDataRaw.id,
          username: usuarioDataRaw.username || "",
          email: usuarioDataRaw.email || "",
          fullname: usuarioDataRaw.fullname || "",
          level: usuarioDataRaw.level ?? 1,
          active: usuarioDataRaw.active ?? 0,
          createdate: usuarioDataRaw.createdate || new Date().toISOString(),
        };
        setAuth({
          usuario: usuarioData,
          isAuthenticated: true,
          isLoggingOut: false,
        });
        if (usuarioData.active === 0) {
          navigate("/change-password", { state: { fromLogin: true } });
        } else if (window.location.pathname === "/") {
          navigate("/main");
        }
      } else {
        setAuth({ usuario: null, isAuthenticated: false, isLoggingOut: false });
      }
    } catch (error: any) {
      setAuth({ usuario: null, isAuthenticated: false, isLoggingOut: false });
      console.error(
        "Error al verificar sesión:",
        error.response?.data?.error || error.message
      );
    }
  };

  const updateUsuario = (usuario: Usuario) => {
    setAuth((prev) => ({ ...prev, usuario }));
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, verificarSesion, updateUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
