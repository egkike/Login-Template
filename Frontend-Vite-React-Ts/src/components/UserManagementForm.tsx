import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import { useAuth } from "../context/AuthContext";
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

interface UserManagementFormProps {
  onClose: () => void;
}

const UserManagementForm: React.FC<UserManagementFormProps> = ({ onClose }) => {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  const canManageUsers = auth.usuario?.level === 0;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data || []);
        setLoading(false);
      } catch (err: any) {
        const mensaje =
          err.response?.data?.error || err.message || "Error desconocido";
        showToast(mensaje, "error");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await api.delete("/user/delete", { data: { id } });
        setUsers(users.filter((user) => user.id !== id));
        showToast("Usuario eliminado con éxito", "success");
      } catch (err: any) {
        const mensaje =
          err.response?.data?.error || err.message || "Error desconocido";
        showToast(mensaje, "error");
      }
    }
    setUserToDelete(null);
  };

  const handleDeleteClick = (user: Usuario) => {
    if (!canManageUsers) {
      showToast("No tienes permisos para eliminar usuarios.", "warning");
      return;
    }
    if (user.active === 1) {
      showToast("No se puede eliminar un usuario activo.", "warning");
    } else {
      setUserToDelete(user.id);
    }
  };

  const handleAddClick = () => {
    if (!canManageUsers) {
      showToast("No tienes permisos para agregar usuarios.", "warning");
      return;
    }
    setShowAddUser(true);
  };

  const handleAddUser = (newUser: Usuario) => {
    setUsers([...users, newUser]);
    setShowAddUser(false);
  };

  const handleUpdateUser = (updatedUser: Usuario) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setUserToEdit(null);
  };

  const handleEditClick = (user: Usuario) => {
    if (!canManageUsers) {
      showToast("No tienes permisos para editar usuarios.", "warning");
      return;
    }
    setUserToEdit(user);
  };

  if (loading)
    return (
      <div className="text-center text-text-dark dark:text-white">
        Cargando usuarios...
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen">
      <div className="relative bg-white dark:bg-dark-1 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-text-dark dark:text-text-primary mb-4 text-center">
          Administrar Usuarios
        </h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddClick}
            disabled={!canManageUsers}
            className={`flex items-center py-2.5 px-5 text-text-dark bg-primary rounded-[25px] border-2 border-primary uppercase tracking-wider transition-all duration-500 ${
              canManageUsers
                ? "hover:bg-transparent hover:text-primary"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <FaPlus className="mr-2" /> Nuevo
          </button>
        </div>
        {users.length === 0 ? (
          <p className="text-text-dark dark:text-white text-center">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-background dark:bg-dark-2 rounded-[10px] shadow">
              <thead>
                <tr className="bg-gray-200 dark:bg-dark-1 text-text-dark dark:text-text-primary">
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Fullname</th>
                  <th className="py-2 px-4 text-left">Level</th>
                  <th className="py-2 px-4 text-left">Active</th>
                  <th className="py-2 px-4 text-left">Creado</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-300 dark:border-dark-5 text-text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-dark-5 transition-colors duration-200"
                  >
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.fullname}</td>
                    <td className="py-2 px-4">{user.level}</td>
                    <td className="py-2 px-4">
                      {user.active === 1 ? (
                        <span className="text-success">Activo</span>
                      ) : (
                        <span className="text-error">Inactivo</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(user.createdate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleEditClick(user)}
                        disabled={!canManageUsers}
                        className={`text-primary mr-2 transition-colors duration-200 ${
                          canManageUsers
                            ? "hover:text-sidebar-hover"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={!canManageUsers}
                        className={`text-error transition-colors duration-200 ${
                          canManageUsers
                            ? "hover:text-red-700"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="py-2.5 px-5 text-text-dark bg-gray rounded-[25px] border-2 border-gray uppercase tracking-wider hover:bg-transparent hover:text-gray transition-all duration-500"
          >
            Cerrar
          </button>
        </div>
        {showAddUser && (
          <AddUserForm
            onClose={() => setShowAddUser(false)}
            onAddUser={handleAddUser}
          />
        )}
        {userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-1 p-6 rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              <p className="text-text-dark dark:text-white mb-4 text-center">
                ¿Confirmar eliminación del usuario?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="py-2.5 px-5 text-text-dark bg-gray rounded-[25px] border-2 border-gray uppercase tracking-wider hover:bg-transparent hover:text-gray transition-all duration-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(userToDelete)}
                  className="py-2.5 px-5 text-text-dark bg-error rounded-[25px] border-2 border-error uppercase tracking-wider hover:bg-transparent hover:text-error transition-all duration-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
        {userToEdit && (
          <EditUserForm
            user={userToEdit}
            onClose={() => setUserToEdit(null)}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementForm;
