import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";

export default function DocSearch() {

    const [query, setQuery] = useState(""); // Holds search query
    const navigate = useNavigate();

    // Submit only passes query to result display page, can therefore reuse component across app.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/docs/search?q=${encodeURIComponent(query)}&page=1&limit=10`);
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%", mb: "1rem" }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Documents"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputProps={{ 'aria-label': 'search all documents' }}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
