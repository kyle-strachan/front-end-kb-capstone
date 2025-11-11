import { createRoutesFromElements, Route, useRoutes, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DepartmentCategories from "./pages/DepartmentCategories";
import Account from "./pages/Account";
import Departments from "./pages/Departments";

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <LayoutProtected />;
}

function LayoutProtected() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}

function AppRoutes() {
  const routes = createRoutesFromElements(
    <>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected group */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/department-categories" element={<DepartmentCategories />} />
        <Route path="/account" element={<Account />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </>
  );

  return useRoutes(routes);
}

export default function App() {
  return <AppRoutes />;
}
