import Editor from "../components/Editor"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function DocsNewEdit() {
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [docIsPublic, setDocIsPublic] = useState(false);
    const [docBody, setDocBody] = useState("Starting value");
    const [departments, setDepartments] = useState([]);
    const [newDepartmentId, setNewDepartmentId] = useState(null);
    const [docsCategories, setDocsCategories] = useState([]);
    const [newDocsCategoryId, setDocsCategoryId] = useState(null);
    const navigate = useNavigate()

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
                console.log(res);
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

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (newDepartmentId) {
            fetchDocsCategories();
        }
    }, [newDepartmentId]);

    async function handleSave() {
        try {
            const res = await api.post("/docs/", {
                title: docTitle,
                description: docDescription,
                body: docBody,
                department: newDepartmentId?._id,
                isPublic: docIsPublic,
                docsCategory: newDocsCategoryId?._id,
            });
            setDocTitle("");
            setDocDescription("");
            setDocBody("");
            notify("Document successfully created", "success")
            console.log(res);
            console.log(`/docs/${res.data.docId}`);
            // navigate(`/docs/${res.data.docId}`);
        } catch (error) {
            console.log('Unable to post new document', error);
        }
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h2>New Document</h2>
                <div className="field-container">
                    <TextField id="doc-title" label="Document Title" variant="outlined" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
                    <TextField
                        id="docDescription"
                        label="Short Description"
                        value={docDescription}
                        multiline
                        rows={3}
                        defaultValue=""
                        onChange={(e) => setDocDescription(e.target.value)}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department"
                        labelField="department"
                        value={newDepartmentId}
                        onChange={(e, newValue) =>
                            setNewDepartmentId(newValue)
                        }
                        required
                    />
                    <SelectWithSearch
                        options={docsCategories}
                        label="Category"
                        labelField="category"
                        value={newDocsCategoryId}
                        onChange={(e, newValue) =>
                            setDocsCategoryId(newValue)
                        }
                        required
                    />
                    <FormControlLabel control={<Switch />} label="Show to All Users" onChange={(e) => setDocIsPublic(e.target.checked)} />
                </div>
                <Editor value={docBody} onChange={handleEditorChange} />
                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleSave}>
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </Paper>
            {/* <pre style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px" }}>
                {docBody}
            </pre> */}
            <ToastContainer />
        </div>
    )
}
