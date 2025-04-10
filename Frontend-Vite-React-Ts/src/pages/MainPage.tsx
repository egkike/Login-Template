import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu";
import { useAuth } from "../context/AuthContext";
import jwtLogo from "../assets/jwt.svg";

interface MainPageProps {
  welcomeText?: string;
  appName?: string;
  showNavbar?: boolean;
}

const MainPage: React.FC<MainPageProps> = ({
  welcomeText = "Bienvenido",
  appName = "Mi App",
  showNavbar = true,
}) => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  if (!auth.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-gradient flex flex-col sm:flex-row transition-colors duration-300">
      <div
        className="flex-1 flex flex-col items-center justify-center p-4 sm:p-0"
        style={{
          marginLeft: window.innerWidth >= 640 ? "60px" : "0",
          marginBottom: window.innerWidth < 640 ? "64px" : "0",
          marginTop: window.innerWidth < 640 ? "64px" : "0",
        }}
      >
        <HamburgerMenu />
        <div
          className={`
            bg-white dark:bg-dark-2 p-4 sm:p-6 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)]
            w-full max-w-md animate-fade-in text-center
            transition-all duration-300 ease-in-out
            hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:border-2 hover:border-primary
          `}
        >
          <img
            src={jwtLogo}
            alt="Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 animate-spin-slow"
          />
          <h1 className="text-xl sm:text-3xl font-bold text-text-dark dark:text-text-primary mb-4">
            Página Principal
          </h1>
          <div className="text-text-dark dark:text-white text-sm sm:text-base">
            {welcomeText}, {auth.usuario?.username || auth.usuario?.email} (
            {auth.usuario?.fullname})
          </div>
        </div>
        <footer className="mt-4 sm:mt-6 text-center text-text-dark dark:text-white text-xs sm:text-sm">
          <p>
            © {new Date().getFullYear()} {appName} - Todos los derechos
            reservados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
