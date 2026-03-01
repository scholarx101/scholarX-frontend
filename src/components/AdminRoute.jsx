import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>লোড হচ্ছে...</p>
      </div>
    );
  }

  // not logged in → go to login, remember where user came from
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // logged in but not admin → go to home (or student dashboard)
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // allowed → render nested routes
  return <Outlet />;
}

export default AdminRoute;
