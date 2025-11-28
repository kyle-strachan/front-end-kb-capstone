import { Typography, Paper } from "@mui/material";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderWebsiteRequest() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#4E87A0", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#daeff8ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <LanguageOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#4E87A0" }} />

                </div>
                <div>
                    <Typography variant="button" >Website Request</Typography>

                </div>
            </Box>

        </Paper>
    )
}