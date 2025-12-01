import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";
import LoadingSpinnerWithoutContext from "../components/LoadingSpinnerWithoutContext";

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
            return { success: true };
        } catch (error) {
            // Return api response if available
            const apiResponse = error.response?.data?.message || error.response?.data;
            const networkMsg = error.message === "Network Error" ? "Application unavailable, unable to connect." : error.message;
            return { success: false, message: apiResponse || networkMsg || "Application unavailable, unknown error." };
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
            if (err.response?.status === 401) {
                setUser(null); // Not logged in, suppress console error
            } else {
                // console.error(err);
            }
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
            } catch (error) {
                if (error.response?.status === 401) {
                    setUser(null); // not logged in
                } else {
                    // console.error(error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <LoadingSpinnerWithoutContext />; // No context as it hasn't been created yet.

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
