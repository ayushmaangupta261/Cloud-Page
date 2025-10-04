import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSelector((state: any) => state.auth); 

  // allow only if user is loggedin
  if (user) {
    return <>{children}</>;
  } else {

    // redirect un-authorized to login/signup
    return <Navigate to="/authPage" replace />;
  }
};

export default ProtectedRoute;
