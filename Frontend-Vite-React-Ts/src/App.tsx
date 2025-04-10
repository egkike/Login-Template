import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext"; 
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auth } = useAuth();
  const location = useLocation();

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const shouldShowNavigation =
    auth.isAuthenticated &&
    !auth.isLoggingOut &&
    !(
      location.pathname === "/change-password" &&
      auth.usuario?.active === 0 &&
      location.state?.fromLogin
    );

  return (
    <>
      {shouldShowNavigation && (
        <>
          <Sidebar onToggle={handleSidebarToggle} />
          <Navbar isSidebarOpen={isSidebarOpen} />
        </>
      )}
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
