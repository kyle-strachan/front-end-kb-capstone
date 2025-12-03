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
    Paper,
} from "@mui/material";
import { api } from "../api";
import { useLoading } from "../context/LoadingContext";
import DocSearchBox from "../components/DocSearchBox";
import DocTree from "../components/DocTree";

export default function DocsSearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(
                    `/docs/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
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
    }, [query, page, limit]);

    const handlePageChange = (event, value) => {
        setSearchParams({ q: query, page: value, limit });
    };

    return (
        <>
            <div style={{ maxWidth: "1280px", height: "vh", margin: "0 auto", padding: "1rem" }}>
                <DocSearchBox placeholder={query === "" ? "Search Documents" : query} />
                <div className="dashboard-two-column">
                    <div className="dashboard-left-column">
                        <Paper style={{ width: "100%", marginBottom: "1rem" }}>
                            <DocTree />
                        </Paper>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
                        <Box sx={{ p: 0 }}>
                            <Typography variant="h6" gutterBottom>
                                {results.length !== 0 && (`Results for ${query}`)}
                                {results.length === 0 && query !== "" && (`No results found for "${query}". Try whole words. `)}
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
                                        <ListItem key={doc._id} alignItems="flex-start" sx={{ p: 0 }} >
                                            <Paper className="docs-search-result" sx={{ width: "100%", flexGrow: 1, pt: 1, pb: 1, pl: 2, pr: 2, mb: 1 }}>
                                                <div className="docs-search-result" >
                                                    <a href={`/docs/view/${doc?._id}`}>
                                                        <ListItemText
                                                            primary={<Typography variant="h6">{doc.title}</Typography>}
                                                            secondary={
                                                                <>
                                                                    <Typography variant="body2" component="span">
                                                                        {doc?.description}
                                                                    </Typography>
                                                                    <Typography variant="body2" component="span">
                                                                        {doc?.department?.department} &gt; {doc?.docsCategory?.category}
                                                                    </Typography>
                                                                </>
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                            </Paper>
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
                    </div>
                </div>
            </div>




        </>
    );
}
