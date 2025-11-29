import { Box, CircularProgress } from "@mui/material";
import { useLoading } from "../context/LoadingContext";

export default function CircularIndeterminate() {
    const { loading } = useLoading();
    if (!loading) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // background: "rgba(255, 255, 255, 0.6)", // Removed as fast loads caused blinking
                zIndex: 999
            }}
        >
            <CircularProgress />
        </Box>
    );
}
