import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ChangePasswordForm from "./components/ChangePasswordForm";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/main" element={<MainPage />} />
    <Route
      path="/change-password"
      element={<ChangePasswordForm onClose={() => {}} fromLogin={true} />}
    />
    {/* Agrega nuevas rutas aquí para futuros proyectos */}
  </Routes>
);

export default AppRoutes;
