import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Pagination,
} from "@mui/material";
import { api } from "../api";
// import DOMPurify from "dompurify";

export default function DocsSearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!q) return;
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(
                    `/docs/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
                );
                setResults(res.data.results);
                setTotal(res.data.total);
            } catch (err) {
                console.error("Search failed:", err);
                setError("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [q, page, limit]);

    const handlePageChange = (event, value) => {
        setSearchParams({ q, page: value, limit });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Results for "{q}"
            </Typography>

            {loading && <CircularProgress />}
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {!loading && !error && (
                <List>
                    {results.map((doc) => (
                        <ListItem key={doc._id} alignItems="flex-start" sx={{ width: "100%", flexGrow: 1 }}>
                            <div className="docs-search-result" >
                                <a href={`/docs/view/${doc?._id}`}>
                                    <ListItemText
                                        primary={<Typography variant="h6">{doc.title}</Typography>}
                                        secondary={
                                            <>
                                                {/* <Typography variant="body2" color="text.secondary"> */}
                                                {doc.snippet}
                                                {/* </Typography> */}
                                                <Typography variant="caption" color="text.secondary">
                                                    Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </a>
                            </div>
                        </ListItem>
                    ))}
                </List>
            )}

            {total > limit && (
                <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={handlePageChange}
                    sx={{ mt: 2 }}
                />
            )}
        </Box>
    );
}
