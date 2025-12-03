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
import { useAuth } from "../context/AuthContext";
import Alert from '@mui/material/Alert';
import "./DocsView.css";
import { resolveWasabiKeys } from "../services/wasabi.js";
import PageTitleCustom from "../components/PageTitleCustom.jsx"

export default function DocsView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [error, setError] = useState();
    const [doc, setDoc] = useState(null);
    const [cleanHtml, setCleanHtml] = useState("");
    const { user } = useAuth();

    // Get single document
    async function fetchSingleDoc() {
        setLoading(true);
        setError(false);
        try {
            const res = await api.get(`/docs/${id}`);
            const rawHtml = res.data.doc.body;
            // Replace placeholder Wasabi reference with signed URL
            const resolvedHtml = await resolveWasabiKeys(rawHtml);
            setDoc(res.data.doc);
            // Sanitize body contents
            setCleanHtml(DOMPurify.sanitize(resolvedHtml));
        } catch {
            setError("Cannot load document.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSingleDoc();
        // id (of document) is stable, only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div className="page-content">
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <PageTitleCustom title={doc?.title} />
                {user?.uiFlags?.enableDocs && (
                    <Button variant="contained" onClick={() => navigate(`/docs/edit/${doc._id}`)}>
                        Edit
                    </Button>
                )}
            </div>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography sx={{ mb: 2 }}>
                    {doc?.description}
                </Typography>
            </Paper>
            <Paper sx={{ p: 3 }}>
                <div className="doc-body">
                    {cleanHtml ? parse(cleanHtml) : null}
                </div>
                <Typography variant="caption" sx={{ lineHeight: "10px" }}>{doc?.department?.department} &gt; {doc?.docsCategory?.category}<br /></Typography>
                <Typography variant="caption" sx={{ lineHeight: "10px" }}>Last updated by: {doc?.lastModifiedBy?.fullName} on {new Date(doc?.lastModifiedAt).toDateString()}</Typography>
            </Paper>
        </div>
    );
}
