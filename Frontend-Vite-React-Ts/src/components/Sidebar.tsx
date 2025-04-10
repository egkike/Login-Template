import { useState } from "react";
import { FaInfoCircle, FaAddressBook } from "react-icons/fa";

interface SidebarProps {
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
    onToggle(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    onToggle(false);
  };

  return (
    <div
      className={`
        fixed z-30
        sm:top-0 sm:left-0 sm:h-full sm:w-[60px] sm:hover:w-[200px] sm:flex sm:flex-col sm:items-center
        bottom-0 left-0 w-full h-16 flex flex-row justify-center items-center
        bg-sidebar dark:bg-sidebar transition-width duration-500 ease-in-out
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hidden sm:flex items-center justify-center py-2">
        <h2 className="text-lg font-bold text-text-dark dark:text-white">
          {isOpen ? "Menú" : "M"}
        </h2>
      </div>
      <ul
        className={`
          sm:mt-2 sm:flex sm:flex-col sm:gap-4 sm:w-full
          flex flex-row gap-2 w-auto h-full items-center
        `}
      >
        <li
          className={`
            sm:py-1 sm:px-2 sm:border-b-2 sm:border-sidebar-hover sm:rounded-md sm:hover:bg-sidebar-hover
            p-1 flex items-center justify-center sm:transition-colors sm:duration-300 cursor-pointer hover:bg-sidebar-hover dark:hover:bg-sidebar-hover transition-colors duration-200
          `}
        >
          <FaInfoCircle className="text-text-dark dark:text-white w-6 h-6" />
          {isOpen && (
            <span className="hidden sm:inline ml-2 text-text-dark dark:text-white">
              Acerca de
            </span>
          )}
        </li>
        <li
          className={`
            sm:py-1 sm:px-2 sm:border-b-2 sm:border-sidebar-hover sm:rounded-md sm:hover:bg-sidebar-hover
            p-1 flex items-center justify-center sm:transition-colors sm:duration-300 cursor-pointer hover:bg-sidebar-hover dark:hover:bg-sidebar-hover transition-colors duration-200
          `}
        >
          <FaAddressBook className="text-text-dark dark:text-white w-6 h-6" />
          {isOpen && (
            <span className="hidden sm:inline ml-2 text-text-dark dark:text-white">
              Contactos
            </span>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
