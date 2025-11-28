import { Typography, Paper } from "@mui/material";
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderAmenityRequest() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#eaaa00", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#fff6ddff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <BuildOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#eaaa00" }} />

                </div>
                <div>
                    <Typography variant="button" >Maintenance Request</Typography>

                </div>
            </Box>

        </Paper>
    )
}