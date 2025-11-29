import Editor from "../components/Editor"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Switch,
} from "@mui/material";
import { api } from "../api";
import SelectWithSearch from "../components/SelectWithSearch";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";

export default function DocsNewEdit() {
    const { id } = useParams(); // will be undefined for "New"
    const [docId, setDocId] = useState(id);
    const [doc, setDoc] = useState(null);
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [docIsPublic, setDocIsPublic] = useState(false);
    const [docBody, setDocBody] = useState("");
    const [departments, setDepartments] = useState([]);
    const [newDepartmentId, setNewDepartmentId] = useState(null);
    const [docsCategories, setDocsCategories] = useState([]);
    const [newDocsCategoryId, setDocsCategoryId] = useState(null);
    const [docIsArchived, setDocIsArchived] = useState(false);
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);

    function handleEditorChange(newValue) {
        setDocBody(newValue);
    }

    async function fetchDepartments() {
        try {
            setLoading(true);
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) setDepartments(res.data.departments);
            else setDepartments([]);
        } catch (error) {
            setError("Could not load documents.", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchDocsCategories() {
        if (newDepartmentId !== null) {
            try {
                const res = await api.get("/config/docs-categories", {
                    params: { departmentId: newDepartmentId._id }
                });
                if (Array.isArray(res.data.docsCategories)) setDocsCategories(res.data.docsCategories);
                else setDocsCategories([]);
            } catch (error) {
                console.error("Failed to fetch document categories:", error.message);
            }
        }
    }

    // Resolve keys to fresh signed URLs so the editor shows images while editing
    async function resolveKeysToUrlsForEdit(html) {
        if (!html) return "";
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

    async function fetchExistingDoc() {
        if (!id) return;
        try {
            const res = await api.get(`/docs/${id}`);
            const rawHtml = res.data.doc.body;
            const resolvedForEditor = await resolveKeysToUrlsForEdit(rawHtml);
            setDoc(res.data.doc);
            setDocTitle(res.data.doc.title ?? "");
            setDocDescription(res.data.doc.description ?? "");
            setDocIsPublic(res.data.doc.isPublic ?? false);
            setDocIsArchived(res.data.doc.isArchived ?? false);
            setNewDepartmentId(res.data.doc.department ?? null);
            setDocsCategoryId(res.data.doc.docsCategory ?? null);
            setDocBody(resolvedForEditor); // editor shows fresh URLs
        } catch (err) {
            console.error("Failed to fetch document:", err.message);
        }
    }

    useEffect(() => {
        fetchDepartments();
        fetchExistingDoc();
    }, []);

    useEffect(() => {
        if (newDepartmentId) fetchDocsCategories();
    }, [newDepartmentId]);

    // SAFER: DOM-based normalization (no regex in JSX)
    function normalizeDocBody(body) {
        if (!body) return body;

        const container = document.createElement("div");
        container.innerHTML = body;

        // Convert all <img src="...documents/.../file.webp?..."> to wasabi-key markers
        const imgs = container.querySelectorAll("img");
        imgs.forEach(img => {
            const src = img.getAttribute("src") || "";
            // Only process if path includes /documents/ and ends with .webp (ignore query params)
            const url = new URL(src, window.location.origin);
            const pathname = url.pathname; // e.g. /documents/<docId>/<file>.webp
            if (pathname.includes("/documents/") && pathname.endsWith(".webp")) {
                // Extract "documents/<docId>/<file>.webp" from pathname
                const idx = pathname.indexOf("documents/");
                const key = pathname.substring(idx); // documents/<docId>/<file>.webp
                img.setAttribute("src", `wasabi-key:${key}`);
            }
        });

        return container.innerHTML;
    }

    async function handleSave(mode) {
        const normalizedBody = normalizeDocBody(docBody);

        try {
            if (mode === "new") {
                const res = await api.post(`/docs/`, {
                    title: docTitle,
                    description: docDescription,
                    body: normalizedBody,
                    department: newDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: newDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
                console.log(res);
                console.log(res.data.docId);
                setDocId(res.data.docId);

            } else {
                await api.patch(`/docs/edit/${id}`, {
                    title: docTitle,
                    description: docDescription,
                    body: normalizedBody,
                    department: newDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: newDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
            }
            notify("Document saved successfully.", "success");
            fetchExistingDoc();
        } catch (error) {
            console.log('Unable to save document', error);
        }
    }

    if (id && !doc) {
        return <div>Loading…</div>;
    }

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <PageTitle title={docId ? "Edit Document" : "New Document"} />
            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h2>{docId ? "Edit Document" : "New Document"}</h2>
                <div className="field-container">
                    <TextField id="doc-title" label="Document Title" variant="outlined" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                    <TextField
                        id="docDescription"
                        label="Short Description"
                        value={docDescription}
                        multiline
                        rows={3}
                        onChange={(e) => setDocDescription(e.target.value)}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department"
                        labelField="department"
                        value={newDepartmentId}
                        onChange={(e, newValue) => {
                            setNewDepartmentId(newValue);
                            setDocsCategoryId(null); // clear category only when user changes
                        }}
                        required
                    />
                    <SelectWithSearch
                        options={docsCategories}
                        label="Category"
                        labelField="category"
                        value={newDocsCategoryId ?? null}
                        onChange={(e, newValue) => setDocsCategoryId(newValue)}
                        required
                    />
                    <FormControlLabel control={<Switch />} label="Show to All Users" checked={docIsPublic} onChange={(e) => setDocIsPublic(e.target.checked)} />
                    <FormControlLabel control={<Switch />} label="Archive" checked={docIsArchived} onChange={(e) => setDocIsArchived(e.target.checked)} />
                </div>
                <Editor key={docId || "new"} value={docBody} onChange={handleEditorChange} docId={docId} />
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={() => handleSave(id ? "edit" : "new")}>
                        {docId ? "Update" : "Insert"}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(docId ? `/docs/view/${docId}` : -1)}>
                        {docId ? "Close" : "Cancel"}
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
