import { Typography, Paper } from "@mui/material";
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderItRequest() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#646469", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#dadae2ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <DevicesOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#646469" }} />

                </div>
                <div>
                    <Typography variant="button" >IT Request</Typography>

                </div>
            </Box>

        </Paper>
    )
}