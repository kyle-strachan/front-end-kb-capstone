import { Box, CircularProgress } from "@mui/material";

export default function LoadingSpinnerWithoutContext() {

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