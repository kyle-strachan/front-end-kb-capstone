import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper } from "@mui/material";
import { api } from "../api";


export default function DocSearch() {

    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (q.trim()) {
            navigate(`/docs/search?q=${encodeURIComponent(q)}&page=1&limit=10`);
        }
    };


    return (
        <Paper sx={{ p: 2 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", gap: 2 }}
            >
                <TextField
                    fullWidth
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search docs..."
                    variant="outlined"
                />
                <Button type="submit" variant="contained">
                    Search
                </Button>
            </Box>
        </Paper>
        // <Paper
        //     component="form"
        //     sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
        // >
        //     {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
        //         <MenuIcon />
        //     </IconButton> */}
        //     <InputBase
        //         sx={{ ml: 1, flex: 1 }}
        //         placeholder="Search Documents"
        //         inputProps={{ 'aria-label': 'search all documents' }}
        //         onSubmit={() => handleSearch}
        //     />
        //     <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        //         <SearchIcon />
        //     </IconButton>
        //     {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
        //     {/* <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        //         <DirectionsIcon />
        //     </IconButton> */}
        // </Paper>
    );
}
