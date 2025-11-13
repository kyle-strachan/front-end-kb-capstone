import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username.trim(), password.trim());
        if (success) navigate("/dashboard");
        else alert("Invalid credentials");
    };

    return (
        <div className="login-screen">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
