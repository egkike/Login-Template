import { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm: React.FC = () => {
  const [modo, setModo] = useState<"username" | "email">("username");
  const [credenciales, setCredenciales] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredenciales((prev) => ({ ...prev, [name]: value }));
  };

  const manejarModoCambio = (nuevoModo: "username" | "email") => {
    setModo(nuevoModo);
    setCredenciales((prev) => ({
      ...prev,
      username: nuevoModo === "username" ? prev.username : "",
      email: nuevoModo === "email" ? prev.email : "",
      password: prev.password,
    }));
  };

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { username, email, password } = credenciales;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (modo === "email" && !emailRegex.test(email)) {
      showToast("Ingresa un email válido", "error");
      return;
    }
    if (modo === "username" && !username) {
      showToast("Ingresa un username", "error");
      return;
    }

    try {
      const result = await login(username, email, password);
      if (!result.success) {
        showToast(result.message || "Error desconocido", "error");
      } else {
        showToast("Inicio de sesión exitoso", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Error desconocido", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background dark:bg-dark-gradient p-4">
      <div className="relative w-full max-w-[400px] h-auto min-h-[400px] sm:h-[500px] mx-4 sm:m-[70px] bg-white dark:bg-dark-1 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] text-center">
        <form
          onSubmit={manejarSubmit}
          className="absolute top-1/2 left-1/2 w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 p-6 sm:p-10 bg-background dark:bg-dark-2 rounded-[10px] flex flex-col justify-center items-center"
        >
          <h2 className="mb-5 sm:mb-7 text-text-dark dark:text-text-primary text-xl sm:text-2xl font-bold">
            Inicio de Sesión
          </h2>
          <div className="flex justify-center gap-4 mb-4 sm:mb-5">
            <label className="flex items-center text-text-dark dark:text-text-primary text-sm sm:text-base">
              <input
                type="radio"
                name="modo"
                value="username"
                checked={modo === "username"}
                onChange={() => manejarModoCambio("username")}
                className="mr-2 accent-primary"
              />
              Username
            </label>
            <label className="flex items-center text-text-dark dark:text-text-primary text-sm sm:text-base">
              <input
                type="radio"
                name="modo"
                value="email"
                checked={modo === "email"}
                onChange={() => manejarModoCambio("email")}
                className="mr-2 accent-primary"
              />
              Email
            </label>
          </div>
          <div className="w-full flex items-center mb-4 sm:mb-5">
            <input
              type={modo === "username" ? "text" : "email"}
              id={modo}
              name={modo}
              value={
                modo === "username" ? credenciales.username : credenciales.email
              }
              onChange={manejarCambio}
              className="w-full p-2 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300 text-sm sm:text-base"
              placeholder={
                modo === "username" ? "Ingresa tu username" : "Ingresa tu email"
              }
            />
          </div>
          <div className="w-full flex items-center mb-4 sm:mb-6 relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              id="password"
              name="password"
              value={credenciales.password}
              onChange={manejarCambio}
              className="w-full p-2 text-text-dark dark:text-text-primary bg-transparent border-b border-light-border focus:border-b-primary outline-none transition-colors duration-300 pr-8 text-sm sm:text-base"
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-2 text-gray dark:text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {mostrarPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full sm:w-4/5 mx-auto flex justify-center items-center py-2 px-4 sm:py-2.5 sm:px-[125px] text-text-dark bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider hover:bg-transparent hover:text-primary hover:ring-2 hover:ring-primary hover:ring-opacity-50 transition-all duration-500 text-sm sm:text-base"
          >
            Iniciar Sesión
          </button>
          <div className="mt-4 sm:mt-6 text-center">
            <Link
              to="/change-password"
              className="text-primary hover:underline text-sm sm:text-base"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
