import { useAuth } from '../context/AuthContext'; // Asegúrate que la ruta sea correcta

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Usamos el estado real de Firebase

    if (loading) return <div>Cargando sesión...</div>;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};