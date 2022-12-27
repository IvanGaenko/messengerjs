import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ redirectPath = '/', children }) => {
  const { accessToken } = useSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
