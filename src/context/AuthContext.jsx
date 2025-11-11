import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (username, password) => {
        try {
            const res = await api.post("/auth/login", { username, password });
            setUser(res.data.user);
            return true;
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed:", err.message);
        } finally {
            setUser(null);
        }
    };

    // Auto-login check on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me"); // your backend /me route
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
