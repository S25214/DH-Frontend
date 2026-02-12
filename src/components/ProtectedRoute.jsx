import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * Protected Route component that requires authentication
 */
export const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
