import { useState, FormEvent } from "react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

interface Usuario {
  id: string;
  username: string;
  email: string;
  fullname: string;
  level: number;
  active: number;
  createdate: string;
}

interface EditUserFormProps {
  user: Usuario;
  onClose: () => void;
  onUpdateUser: (user: Usuario) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onClose,
  onUpdateUser,
}) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [level, setLevel] = useState(user.level);
  const [active, setActive] = useState(user.active);
  const { showToast } = useToast();

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.patch("/user/update", {
        id: user.id,
        fullname,
        level,
        active,
      });
      onUpdateUser(response.data);
      showToast("Usuario actualizado con éxito", "success");
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
            Editar Usuario
          </h2>
          <div className="w-full flex items-center mb-5">
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
              placeholder="Ingresa el nombre completo"
            />
          </div>
          <div className="w-full flex items-center mb-5">
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
            >
              <option
                value={0}
                className="bg-background dark:bg-dark-2 text-text-dark dark:text-white"
              >
                Admin (0)
              </option>
              <option
                value={1}
                className="bg-background dark:bg-dark-2 text-text-dark dark:text-white"
              >
                Usuario (1)
              </option>
            </select>
          </div>
          <div className="w-full flex items-center mb-6">
            <select
              id="active"
              value={active}
              onChange={(e) => setActive(Number(e.target.value))}
              className="w-full p-2.5 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300"
            >
              <option
                value={1}
                className="bg-background dark:bg-dark-2 text-text-dark dark:text-white"
              >
                Activo (1)
              </option>
              <option
                value={0}
                className="bg-background dark:bg-dark-2 text-text-dark dark:text-white"
              >
                Inactivo (0)
              </option>
            </select>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
