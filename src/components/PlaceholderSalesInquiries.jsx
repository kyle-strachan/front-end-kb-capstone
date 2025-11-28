import { Typography, Paper } from "@mui/material";
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderSalesInquiries() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#00B388", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#d8faf2ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <ContactPhoneOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#00B388" }} />

                </div>
                <div>
                    <Typography variant="button" >Sales Inquiry</Typography>
                </div>
            </Box>

        </Paper>
    )
}