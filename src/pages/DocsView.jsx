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
import { useLoading } from "../context/LoadingContext";

export default function DocsView() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [doc, setDoc] = useState(null);
    const [cleanHtml, setCleanHtml] = useState("");

    useEffect(() => {
        fetchSingleDoc();
    }, []);

    async function resolveKeysToUrls(html) {
        const regex = /wasabi-key:([^"]+)/g;
        let replaced = html;
        let match;

        while ((match = regex.exec(html)) !== null) {
            const key = match[1];
            const res = await api.get(`/docs/${id}/sign-url`, { params: { key } });
            replaced = replaced.replace(`wasabi-key:${key}`, res.data.url);
        }

        return replaced;
    }

    async function fetchSingleDoc() {
        setLoading(true);
        try {
            const res = await api.get(`/docs/${id}`);
            const rawHtml = res.data.doc.body;
            const resolvedHtml = await resolveKeysToUrls(rawHtml);
            setDoc(res.data.doc);
            setCleanHtml(DOMPurify.sanitize(resolvedHtml));
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
