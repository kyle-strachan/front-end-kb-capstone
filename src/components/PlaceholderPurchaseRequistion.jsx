import { Typography, Paper } from "@mui/material";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import Box from '@mui/material/Box';


export default function PlaceholderPurchaseRequest() {

    return (
        <Paper sx={{ width: "100%" }}>

            <Box sx={{ backgroundColor: "#E03C31", height: "5px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} />
            <Box sx={{ backgroundColor: "#fde5e3ff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", pt: 1, pb: 3, borderRadius: "4px" }}>
                <div>
                    <ReceiptLongOutlinedIcon fontSize="large" sx={{ mt: 2, mb: 2, color: "#E03C31" }} />

                </div>
                <div>
                    <Typography variant="button" >Purchase Requisition</Typography>

                </div>
            </Box>

        </Paper>
    )
}