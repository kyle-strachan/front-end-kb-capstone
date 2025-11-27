import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Attempt to load from local storage
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

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
            // Clear stored user on logout
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    // Allows passwordMustChange to be updated when a user first logs in and clears the redirect condition - called from Account.jsx
    const refreshUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch (err) {
            console.error("Failed to refresh user:", err.message);
        }
    };

    // Persist user to storage after loading is done
    useEffect(() => {
        if (loading) return; // Must wait until user is loaded

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user, loading]);

    // Auto-login check
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data.user); // refresh from server if provided
            } catch {
                // LocalStorage keeps the last known user during refresh, fallthrough if auto-login fails
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

export const useAuth = () => useContext(AuthContext);
