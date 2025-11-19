import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    Button,
    Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function DocsView() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doc, setDoc] = useState(null);
    const [cleanHtml, setCleanHtml] = useState("");

    useEffect(() => {
        fetchSingleDoc();
    }, []);

    async function fetchSingleDoc() {
        setLoading(true);
        try {
            const res = await api.get(`/docs/${id}`);
            // console.log(res.data.doc);
            setDoc(res.data.doc);
            setCleanHtml(DOMPurify.sanitize(res.data.doc.body));
        } catch (err) {
            console.error("Failed to fetch document:", err.message);
            // setError("Could not load document.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div style={{ margin: "0 auto", padding: "1rem" }}>
                <Paper sx={{ p: 3 }}>
                    <div className="space-between-container">
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            {doc.title}
                        </Typography>
                        <div className="cta-btn-container">
                            <Button variant="outlined" onClick={() => navigate(`/docs/edit/${doc._id}`)}>
                                Edit
                            </Button>
                            <Button variant="contained" onClick={() => navigate(-1)}>
                                Close
                            </Button>
                        </div>
                    </div>

                    <Typography sx={{ mb: 2 }}>
                        {doc.description}
                    </Typography>
                    {parse(cleanHtml)}
                </Paper>
            </div>
        </>
    );
}
