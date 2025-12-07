import Editor from "../components/Editor"
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Typography,
    Alert,
} from "@mui/material";
import { api } from "../api";
import SelectWithSearch from "../components/SelectWithSearch";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import LoadingSpinnerWithoutContext from "../components/LoadingSpinnerWithoutContext";
import { resolveKeysToUrlsForEdit } from "../utils/wasabi";

export default function DocsNewEdit() {
    const saveLock = useRef(false); // State update was too slow to prevent duplicate new documents if double-clicked
    const { id } = useParams(); // will be undefined for "New"
    const [docId, setDocId] = useState(id);
    // const [doc, setDoc] = useState(null);
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [docIsPublic, setDocIsPublic] = useState(false);
    const [docBody, setDocBody] = useState("");
    const [departments, setDepartments] = useState([]);
    const [docsCategories, setDocsCategories] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [selectedDocsCategoryId, setSelectedDocsCategoryId] = useState(null);
    const [docIsArchived, setDocIsArchived] = useState(false);
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);

    function handleEditorChange(newValue) {
        setDocBody(newValue);
    }

    // Get departments list
    async function fetchDepartments() {
        try {
            setLoading(true);
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) setDepartments(res.data.departments);
            else setDepartments([]);
        } catch (error) {
            setError(`Could not load documents. ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Get categories lsit when department has been selected
    async function fetchDocsCategories() {
        if (selectedDepartmentId !== null) {
            try {
                const res = await api.get("/config/docs-categories", {
                    params: { departmentId: selectedDepartmentId._id, isActive: true }
                });
                if (Array.isArray(res.data.docsCategories)) setDocsCategories(res.data.docsCategories);
                else setDocsCategories([]);
            } catch (error) {
                setError(`Failed to fetch document categories. ${error.message}`);
            }
        }
    }

    // Populate fields if in edit mode/ id is not null
    async function fetchExistingDoc() {
        if (!id) return;
        try {
            setLoading(true);
            const res = await api.get(`/docs/${id}`);
            const rawHtml = res.data.doc.body;
            const resolvedForEditor = await resolveKeysToUrlsForEdit(rawHtml, id);
            // setDoc(res.data.doc);
            setDocTitle(res.data.doc.title ?? "");
            setDocDescription(res.data.doc.description ?? "");
            setDocIsPublic(res.data.doc.isPublic ?? false);
            setDocIsArchived(res.data.doc.isArchived ?? false);
            setSelectedDepartmentId(res.data.doc.department ?? null);
            setSelectedDocsCategoryId(res.data.doc.docsCategory ?? null);
            setDocBody(resolvedForEditor); // editor shows fresh URLs
        } catch (error) {
            setError(`Failed to fetch document. ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // When switching to new document while existing a current one.
        if (!id) {
            // setDoc(null);
            setDocId(null);
            setDocTitle("");
            setDocDescription("");
            setDocIsPublic(false);
            setDocIsArchived(false);
            setSelectedDepartmentId(null);
            setSelectedDocsCategoryId(null);
            setDocBody("");
        }
    }, [id]);


    useEffect(() => {
        fetchDepartments();
        fetchExistingDoc();
    }, []); // On inital load attempt to load existing document in edit mode plus departments list
    // TO DO: check whether department is overwriting edit doc

    useEffect(() => {
        if (selectedDepartmentId) fetchDocsCategories();
    }, [selectedDepartmentId]); // Refetch categories if department is changed.

    function normalizeDocBody(body) {
        if (!body) return body;

        // Wrap document html in div tag
        const container = document.createElement("div");
        container.innerHTML = body;

        // Convert all images to wasabi-key markers
        // Submission note: Section of code required AI use
        const images = container.querySelectorAll("img");
        images.forEach(image => {
            const src = image.getAttribute("src") || "";
            // Only process if path includes /documents/ and ends with .webp - as this is the upload format
            const url = new URL(src, window.location.origin);
            const pathname = url.pathname; // e.g. /documents/<docId>/<file>.webp
            if (pathname.includes("/documents/") && pathname.endsWith(".webp")) {
                // Extract "documents/<docId>/<file>.webp" from pathname
                const idx = pathname.indexOf("documents/");
                const key = pathname.substring(idx); // documents/<docId>/<file>.webp
                image.setAttribute("src", `wasabi-key:${key}`);
            }
        });
        return container.innerHTML;
    }

    async function handleSave(mode) {
        if (saveLock.current) return; // Prevent double click, noticed bug if left to state variable
        saveLock.current = true;

        const normalizedBody = normalizeDocBody(docBody);
        setLoading(true);

        try {
            if (mode === "new") {
                const res = await api.post(`/docs/`, {
                    title: docTitle,
                    description: docDescription,
                    body: normalizedBody,
                    department: selectedDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: selectedDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
                setDocId(res.data.docId);

            } else {
                await api.patch(`/docs/edit/${docId}`, {
                    title: docTitle,
                    description: docDescription,
                    body: normalizedBody,
                    department: selectedDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: selectedDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
            }
            notify("Document saved successfully.", "success");
            fetchExistingDoc();
        } catch (error) {
            notify(`Unable to save document. ${error.response.data.message}`, "error");
        } finally {
            setLoading(false);
            saveLock.current = false;
        }
    }

    if (loading && !docId) {
        return <LoadingSpinnerWithoutContext />;
    }

    if (error) {
        return (
            <div className="page-content">
                <Alert severity="error">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="page-content">
            <PageTitle title={docId ? "Edit Document" : "New Document"} />
            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <Typography variant="h2">{docId ? "Edit Document" : "New Document"}</Typography>
                <div className="field-container">
                    <TextField id="doc-title" label="Document Title" variant="outlined" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} sx={{ mb: 2 }} />
                    <TextField
                        id="docDescription"
                        label="Short Description"
                        value={docDescription}
                        multiline
                        rows={3}
                        onChange={(e) => setDocDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department"
                        labelField="department"
                        value={selectedDepartmentId}
                        onChange={(e, newValue) => {
                            setSelectedDepartmentId(newValue);
                            setSelectedDocsCategoryId(null); // clear category only when user changes
                        }}
                        required
                    />
                    <SelectWithSearch
                        options={docsCategories}
                        label="Category"
                        labelField="category"
                        value={selectedDocsCategoryId ?? null}
                        onChange={(e, newValue) => setSelectedDocsCategoryId(newValue)}
                        required
                    />
                    <FormControlLabel control={<Switch />} label="Show to All Users" checked={docIsPublic} onChange={(e) => setDocIsPublic(e.target.checked)} />
                    <FormControlLabel control={<Switch />} label="Archive" checked={docIsArchived} onChange={(e) => setDocIsArchived(e.target.checked)} sx={{ mb: 2 }} />
                    {!docId && (<Alert sx={{ mb: 2 }} severity="info">Images can be uploaded after saving the document for the first time.</Alert>)}
                </div>
                <Editor key={docId || "new"} value={docBody} onChange={handleEditorChange} docId={docId} />
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={() => handleSave(docId ? "edit" : "new")} disabled={loading}>
                        {docId ? "Update" : "Create"}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(docId ? `/docs/view/${docId}` : -1)}>
                        {docId ? "Close" : "Cancel"}
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
