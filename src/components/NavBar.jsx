import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/departments">Departments</Link> |{" "}
            <Link to="/department-categories">Department Categories</Link> |{" "}
            <Link to="/account">Account</Link> |{" "}

            <button onClick={logout}>Logout</button>
        </nav>
    );
}
