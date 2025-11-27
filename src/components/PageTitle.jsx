import { Paper, Typography } from "@mui/material";

export default function PageTitle({ title }) {
    return (
        <Paper sx={{ mb: 4, p: "5px 12px", backgroundColor: "#82a3b1ff", color: "#FFF" }}>

            <Typography variant="h5">{title}</Typography>
        </Paper>
    )
}