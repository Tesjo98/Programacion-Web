import { Navigate } from 'react-router-dom';
import { auth } from './api/firebaseService';
import { useAuthState } from 'react-firebase-hooks/auth'; // Instala esto: npm i react-firebase-hooks

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) return <div>Cargando seguridad...</div>;

    if (!user) {
        // Si no hay usuario, lo manda al login a la fuerza
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;