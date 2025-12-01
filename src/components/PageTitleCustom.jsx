import { Paper, Typography } from "@mui/material"

export default function PageTitleCustom({ title }) {
    return (
        <Paper sx={{ mb: 0, p: "5px 12px", backgroundColor: "#6e92a1ff", color: "#FFF", width: "100%" }}>
            <Typography variant="h1">{title}</Typography>
        </Paper>
    )
}