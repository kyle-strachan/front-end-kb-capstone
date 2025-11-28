import { Paper, Typography } from "@mui/material";

export default function PageTitle({ title }) {
    return (
        <Paper sx={{ mb: 4, p: "5px 12px", backgroundColor: "#6e92a1ff", color: "#FFF" }}>

            <Typography variant="h1">{title}</Typography>
        </Paper>
    )
}