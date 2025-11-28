import { Typography, Paper } from "@mui/material";
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderAmenityOrder() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#24135F", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#e7e2f8ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <CardGiftcardOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#24135F" }} />

                </div>
                <div>
                    <Typography variant="button" >Amenity Order</Typography>

                </div>
            </Box>

        </Paper>
    )
}