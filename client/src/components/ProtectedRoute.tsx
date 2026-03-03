import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, forceAuth = true }: { children: ReactNode; forceAuth?: boolean }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (forceAuth && !user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
