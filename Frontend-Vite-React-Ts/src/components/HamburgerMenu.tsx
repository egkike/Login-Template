import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
import UserManagementForm from "./UserManagementForm";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const { auth } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        className="text-text-dark dark:text-text-primary focus:outline-none hover:text-primary transition-colors duration-200 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      {isOpen && (
        <div className="absolute top-[40px] sm:top-[50px] right-2.5 bg-white dark:bg-dark-2 rounded-md p-2 shadow-lg animate-fade-in w-40 sm:w-48">
          <ul className="py-1 flex flex-col gap-1">
            <li
              className="px-2 py-1 hover:bg-dark-5 cursor-pointer text-text-dark dark:text-text-primary text-xs sm:text-sm transition-colors duration-200"
              onClick={() => {
                setShowChangePassword(true);
                setIsOpen(false);
              }}
            >
              Cambiar Contraseña
            </li>
            {auth.usuario?.level === 0 && (
              <li
                className="px-2 py-1 hover:bg-dark-5 cursor-pointer text-text-dark dark:text-text-primary text-xs sm:text-sm transition-colors duration-200"
                onClick={() => {
                  setShowUserManagement(true);
                  setIsOpen(false);
                }}
              >
                Administrar Usuarios
              </li>
            )}
          </ul>
        </div>
      )}
      {showChangePassword && (
        <ChangePasswordForm
          onClose={() => setShowChangePassword(false)}
          fromLogin={false}
        />
      )}
      {showUserManagement && (
        <UserManagementForm onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
};

export default HamburgerMenu;
