import { useState, FormEvent } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface AddUserFormProps {
  onClose: () => void;
  onAddUser: (user: any) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, onAddUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { showToast } = useToast();

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/user/create", {
        username,
        email,
        password,
        fullname,
      });
      onAddUser(response.data);
      showToast("Usuario creado con éxito", "success");
      onClose();
    } catch (err: any) {
      const mensaje =
        err.response?.data?.error || err.message || "Error desconocido";
      showToast(mensaje, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen">
      <div className="relative h-[500px] w-[400px] bg-white dark:bg-dark-1 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] text-center">
        <form
          onSubmit={manejarSubmit}
          className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 p-10 bg-background dark:bg-dark-2 rounded-[10px] flex flex-col justify-center items-center"
        >
          <h2 className="mb-7 text-text-dark dark:text-text-primary text-2xl font-bold">
            Agregar Nuevo Usuario
          </h2>
          <div className="w-full flex items-center mb-5">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
              placeholder="Ingresa el username"
            />
          </div>
          <div className="w-full flex items-center mb-5">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
              placeholder="Ingresa el email"
            />
          </div>
          <div className="w-full flex items-center mb-5 relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300 pr-8"
              placeholder="Ingresa la contraseña"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-2 text-gray dark:text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {mostrarPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <div className="w-full flex items-center mb-6">
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
              placeholder="Ingresa el nombre completo"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-text-dark bg-gray rounded-[25px] border-2 border-gray uppercase tracking-wider hover:bg-transparent hover:text-gray transition-all duration-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 text-text-dark bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider hover:bg-transparent hover:text-primary transition-all duration-500"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
