import Editor from "../components/Editor"
import { useState, useEffect } from "react";
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



export default function DocsNewEdit(id) {
    const [docTitle, setDocTitle] = useState("");
    const [docDescription, setDocDescription] = useState("");
    const [docIsPublic, setDocIsPublic] = useState(false);
    const [docBody, setDocBody] = useState("Starting value");
    const [departments, setDepartments] = useState([]);
    const [isNewDoc, setIsNewDoc] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDepartmentId, setNewDepartmentId] = useState(null);
    const [docsCategories, setDocsCategories] = useState([]);
    const [newDocsCategoryId, setDocsCategoryId] = useState(null);




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
                setError(res.data.message || "No departments found.");
            }
        } catch (err) {
            console.error("Failed to fetch departments:", err.message);
            setError("Could not load departments.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchDocsCategories() {
        if (newDepartmentId !== null) {
            try {
                console.log("Request URL:", `/config/docs-categories?departmentId=${newDepartmentId}`);
                const res = await api.get("/config/docs-categories", {
                    params: { departmentId: newDepartmentId._id }
                });
                if (Array.isArray(res.data.docsCategories)) {
                    setDocsCategories(res.data.docsCategories);
                } else {
                    setDocsCategories([]);
                    setError(res.data.message || "No document categories found.");
                }
                // console.log(res.data.docsCategories);
            } catch (error) {
                console.error("Failed to fetch document categories:", error.message);
                setError("Could not load document categories.");
            } finally {
                setLoading(false);
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
        if (isNewDoc) {
            try {
                const res = await api.post("/docs/", {
                    title: docTitle,
                    description: docDescription,
                    body: docBody,
                    department: newDepartmentId,
                    isPublic: docIsPublic,
                    // departmentCategory: "",
                })
            } catch (error) {
                console.log('Unable to post new document', error);
            }
        }

    }

    return (
        <div>
            <Paper>
                <h1>Docs New Edit</h1>
                <TextField id="doc-title" label="Document Title" variant="outlined" onChange={(e) => setDocTitle(e.target.value)} />
                <TextField
                    id="doc-description"
                    label="Short Description"
                    multiline
                    rows={3}
                    defaultValue=""
                    onChange={(e) => setDocDescription(e.target.value)}
                />
                <FormControlLabel control={<Switch />} label="Show to All Users" onChange={(e) => setDocIsPublic(e.target.checked)} />
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
                    labelField="docsCategories"
                    value={newDocsCategoryId}
                    onChange={(e, newValue) =>
                        setDocsCategoryId(newValue)
                    }
                    required
                />
                <Editor value={docBody} onChange={handleEditorChange} />
                <Button variant="contained" onClick={handleSave}>
                    Submit
                </Button>
            </Paper>
            <pre style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px" }}>
                {docBody}
            </pre>
        </div>
    )
}
