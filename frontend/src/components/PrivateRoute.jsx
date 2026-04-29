import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PrivateRoute = ({ children }) => {
    const { user } = useAuthStore();
    const isAuthenticated = !!user;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
