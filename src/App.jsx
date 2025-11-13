import { createRoutesFromElements, Route, useRoutes, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
// import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DepartmentCategories from "./pages/DepartmentCategories";
import Account from "./pages/Account";
import Departments from "./pages/Departments";
import Locations from "./pages/Locations";
import SystemApplications from "./pages/SystemApplications";
import SystemApplicationsNewEdit from "./pages/SystemApplicationsNewEdit";
import SystemCategories from "./pages/SystemCategories";
import Users from "./pages/Users";
import UsersNewEdit from "./pages/UsersNewEdit";
import Footer from "./components/Footer";
import NavBarExtended from "./components/NavBarExtended";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <LayoutProtected />
  );
}

function LayoutProtected() {
  return (
    <div className="App">
      <div className="content-wrapper">
        <NavBarExtended />
        {/* <Navbar /> */}
        <div className="p-4">
          <Outlet />
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </div >
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
        <Route path="/locations" element={<Locations />} />
        <Route path="/system-applications/new" element={<SystemApplicationsNewEdit />} />
        <Route path="/system-applications/:id" element={<SystemApplicationsNewEdit />} />
        <Route path="/system-applications" element={<SystemApplications />} />
        <Route path="/system-categories" element={<SystemCategories />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/new" element={<UsersNewEdit />} />
        <Route path="/users/:id" element={<UsersNewEdit />} />

        <Route path="/account" element={<Account />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>
    </>
  );
  return useRoutes(routes);
}

export default function App() {
  return (
    <AppRoutes />
  )
}
