import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const UnProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useSelector((state: any) => state.auth);

    // allow only if user is not loggedin
    if (!user) {
        return <>{children}</>;
    } else {

        // redirect logged-in use to dashboard
        return <Navigate to="/dashboard" replace />;
    }
};

export default UnProtectedRoute;
