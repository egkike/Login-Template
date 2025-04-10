// src/components/ChangePasswordForm.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ChangePasswordFormProps {
  onClose: () => void;
  fromLogin?: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onClose,
  fromLogin = false,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { auth, updateUsuario, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.usuario?.id) {
      showToast(
        "No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.",
        "error"
      );
      return;
    }

    try {
      const response = await api.patch("/user/chgpass", {
        id: auth.usuario.id,
        password: newPassword,
      });
      const usuarioData = response.data.usuario;
      updateUsuario(usuarioData);
      showToast("Contraseña cambiada con éxito", "success");
      if (fromLogin) {
        await logout();
      } else {
        onClose();
      }
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error || err.message || "Error desconocido";
      showToast(mensaje, "error");
    }
  };

  const manejarCierre = () => {
    if (fromLogin) {
      logout();
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        fromLogin
          ? "bg-background dark:bg-dark-gradient min-h-screen p-4"
          : "bg-black bg-opacity-50"
      }`}
    >
      <div className="relative w-full max-w-[400px] h-auto min-h-[400px] sm:h-[500px] bg-white dark:bg-dark-1 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] text-center">
        <form
          onSubmit={manejarSubmit}
          className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 p-6 sm:p-10 bg-background dark:bg-dark-2 rounded-[10px] flex flex-col justify-center items-center"
        >
          <h2 className="mb-5 sm:mb-7 text-text-dark dark:text-text-primary text-xl sm:text-2xl font-bold">
            Cambiar Contraseña
          </h2>
          <div className="w-full flex items-center mb-4 sm:mb-6 relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300 pr-8 text-sm sm:text-base"
              placeholder="Ingresa tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-2 text-gray dark:text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {mostrarPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="flex justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={manejarCierre}
              className="py-2 px-4 sm:py-2.5 sm:px-5 text-text-dark bg-gray rounded-[25px] border-2 border-gray uppercase tracking-wider hover:bg-transparent hover:text-gray transition-all duration-500 text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 sm:py-2.5 sm:px-5 text-text-dark bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all duration-500 text-sm sm:text-base"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
