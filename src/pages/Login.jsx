import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box
} from "@mui/material";
import { useLoading } from "../context/LoadingContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loading, setLoading } = useLoading();
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
            <Paper
                variant="elevation"
                sx={{ width: 300, padding: "32px 24px", textAlign: "center" }}
            >
                {/* Padlock Icon */}
                {/* <LockOutlinedIcon sx={{ fontSize: 40, mb: 1 }} /> */}
                <img src="/logo-black-sq.svg" width="40px" />

                {/* Title */}
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    LobbyLock
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
        </div>
    );
}
