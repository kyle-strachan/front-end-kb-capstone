import Editor from "../components/Editor"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Paper,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Switch,
    Typography,
} from "@mui/material";
import { api } from "../api";
import SelectWithSearch from "../components/SelectWithSearch";
import { ToastContainer, toast } from 'react-toastify';
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function DocsNewEdit() {
    const { id } = useParams(); // will be undefined for "New"
    const [doc, setDoc] = useState(null);
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [docIsPublic, setDocIsPublic] = useState(false);
    const [docBody, setDocBody] = useState("Starting value");
    const [departments, setDepartments] = useState([]);
    const [newDepartmentId, setNewDepartmentId] = useState(null);
    const [docsCategories, setDocsCategories] = useState([]);
    const [newDocsCategoryId, setDocsCategoryId] = useState(null);
    const [docIsArchived, setDocIsArchived] = useState(false);
    const navigate = useNavigate()
    const [cleanHtml, setCleanHtml] = useState("");

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    function handleEditorChange(newValue) {
        setDocBody(newValue)
    }

    async function fetchDepartments() {
        try {
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) {
                setDepartments(res.data.departments);
            } else {
                setDepartments([]);
            }
        } catch (err) {
            console.error("Failed to fetch departments:", err.message);

        } finally {
            // setLoading(false);
        }
    }

    async function fetchDocsCategories() {
        if (newDepartmentId !== null) {
            try {
                const res = await api.get("/config/docs-categories", {
                    params: { departmentId: newDepartmentId._id }
                });
                // console.log(res);
                if (Array.isArray(res.data.docsCategories)) {
                    setDocsCategories(res.data.docsCategories);
                } else {
                    setDocsCategories([]);
                    // setError(res.data.message || "No document categories found.");
                }
                // console.log(res.data.docsCategories);
            } catch (error) {
                console.error("Failed to fetch document categories:", error.message);
                // setError("Could not load document categories.");
            } finally {
                // setLoading(false);
            }
        }
    }

    async function fetchExistingDoc() {
        // id will be present if in edit mode.
        if (id) {
            // console.log('We are in edit mode');
            // setLoading(true);
            try {
                const res = await api.get(`/docs/${id}`);
                // console.log(res.data.doc);
                setDoc(res.data.doc);
                setCleanHtml(DOMPurify.sanitize(res.data.doc.body));
            } catch (err) {
                console.error("Failed to fetch document:", err.message);
                // setError("Could not load document.");
            } finally {
                // setLoading(false);
            }
        } else {
            // console.log('We are in new mode');
        }
    }


    useEffect(() => {
        fetchDepartments();
        fetchExistingDoc();
    }, []);

    useEffect(() => {
        if (newDepartmentId) {
            fetchDocsCategories();
        }
    }, [newDepartmentId]);

    useEffect(() => {
        // Required to set edit mode values, otherwise update will send null
        if (doc) {
            setDocTitle(doc.title ?? "");
            setDocDescription(doc.description ?? "");
            setDocBody(doc.body ?? "");
            setDocIsPublic(doc.isPublic ?? false);
            setDocIsArchived(doc.isArchived ?? false);
            setNewDepartmentId(doc.department ?? null);
            setDocsCategoryId(doc.docsCategory ?? null);
        }
    }, [doc]);


    async function handleSave(mode) {
        // Validate all fields
        let res = null;

        try {
            if (mode === "new") {
                res = await api.post(`/docs/`, {
                    title: docTitle,
                    description: docDescription,
                    body: docBody,
                    department: newDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: newDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
            } else {
                res = await api.patch(`/docs/edit/${id}`, {
                    title: docTitle,
                    description: docDescription,
                    body: docBody,
                    department: newDepartmentId?._id,
                    isPublic: docIsPublic,
                    docsCategory: newDocsCategoryId?._id,
                    isArchived: docIsArchived,
                });
            }
            fetchExistingDoc();
            notify("Document saved successfully.", "success")
            // console.log(res);
            // console.log(`/docs/${res.data.docId}`);
        } catch (error) {
            console.log('Unable to post new document', error);
        }
    }

    async function handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const res = await api.post(`/docs/${id}/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const imageUrl = res.data.url;

        // Insert markdown or HTML into your editor
        setDocBody(prev => `${prev}\n\n![image](${imageUrl})`);
    }


    if (id && !doc) {
        return <div>Loading…</div>;
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h2>{id ? "Edit Document" : "New Document"}</h2>
                <div className="field-container">
                    <TextField id="doc-title" label="Document Title" variant="outlined" value={id ? doc.title : docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                    <TextField
                        id="docDescription"
                        label="Short Description"
                        value={id ? doc.description : docDescription}
                        multiline
                        rows={3}
                        onChange={(e) => setDocDescription(e.target.value)}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department"
                        labelField="department"
                        value={id ? doc.department : newDepartmentId}
                        onChange={(e, newValue) =>
                            setNewDepartmentId(newValue)
                        }
                        required
                    />
                    <SelectWithSearch
                        options={docsCategories}
                        label="Category"
                        labelField="category"
                        value={id ? doc.docsCategory ?? null : newDocsCategoryId}
                        onChange={(e, newValue) =>
                            setDocsCategoryId(newValue)
                        }
                        required
                    />
                    <FormControlLabel control={<Switch />} label="Show to All Users" value={id ? doc.isPublic : false} onChange={(e) => setDocIsPublic(e.target.checked)} />
                    <FormControlLabel control={<Switch />} label="Archive" value={id ? doc.isArchived : false} onChange={(e) => setDocIsArchived(e.target.checked)} />
                </div>
                <Editor value={id ? doc.body : docBody} onChange={handleEditorChange} />
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={() => handleSave(id ? "edit" : "new")}>
                        {id ? "Update" : "Insert"}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </Paper>
            <Paper>
                <Button variant="contained" component="label">
                    Upload Image
                    <input type="file" hidden onChange={handleUpload} />
                </Button>

            </Paper>
            {/* <pre style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px" }}>
                {docBody}
            </pre> */}
            <ToastContainer />
        </div>
    )
}
