import { useAuth } from "../context/AuthContext";
import { FaUser } from "react-icons/fa";

interface NavbarProps {
  appName?: string;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  appName = "Mi App",
  isSidebarOpen,
}) => {
  const { auth, logout } = useAuth();

  return (
    <nav
      className={`fixed top-0 ${
        isSidebarOpen ? "left-[200px]" : "left-[60px]"
      } right-0 bg-white dark:bg-dark-1 p-4 flex justify-between items-center shadow-md z-40 transition-left duration-500 ease-in-out`}
    >
      <h1 className="text-xl font-bold text-text-dark dark:text-text-primary ml-2">
        {appName}
      </h1>
      <div className="flex items-center gap-4 mr-14">
        <div className="flex items-center gap-2">
          <FaUser className="text-text-dark dark:text-text-primary w-5 h-5" />
          <span className="text-text-dark dark:text-text-primary text-sm sm:text-base">
            {auth.usuario?.fullname}
          </span>
        </div>
        <button
          onClick={logout}
          className="text-text-dark bg-primary rounded-[20px] py-1.5 px-3 sm:px-4 hover:bg-transparent hover:text-primary transition-all duration-500 ease-in-out text-xs sm:text-sm uppercase tracking-wider"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
