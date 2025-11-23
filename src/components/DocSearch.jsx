import { Typography, TextField } from "@mui/material";




export function DocSearch() {
    return (
        <div>
            <TextField id="doc-search" label="Search Docs" variant="outlined" sx={{ width: "100%" }} />
        </div>
    )
}