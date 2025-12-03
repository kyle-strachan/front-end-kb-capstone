import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import { useLoading } from "../context/LoadingContext";
import { MINIMUM_PASSWORD_LENGTH, MINIMUM_USERNAME_LENGTH } from "../utils/constants";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { loading, setLoading } = useLoading();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Only basic password validation exposed on front-end
        if (username.length < MINIMUM_USERNAME_LENGTH || password.length < MINIMUM_PASSWORD_LENGTH) {
            setLoading(false);
            return setError("Invalid credentials, please try again.");
        }

        const response = await login(username.trim(), password.trim());

        if (response.success) {
            setError("");
            navigate("/dashboard");
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

    return (
        <div className="login-screen">
            <Paper
                sx={{ width: 300, padding: "32px 24px", textAlign: "center" }}
            >
                <div className="login-logo" >
                    <img src="/logo-black-sq.svg" width="35px" />
                </div>
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

                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 1 }}
                            disabled={loading}
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
        </div>
    );
}
