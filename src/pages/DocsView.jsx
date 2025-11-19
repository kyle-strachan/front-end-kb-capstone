import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import SelectWithSearch from "../components/SelectWithSearch";
import AccessRequests from "../components/AccessRequests";
import AccessAssignments from "../components/AccessAssignments";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export default function DocsView() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // const [user, setUser] = useState({
    //     username: "",
    //     fullName: "",
    //     location: "",
    //     department: [],
    //     email: "",
    //     position: "",
    //     isActive: true,
    //     permissions: [],
    // });
    // const [departments, setDepartments] = useState([]);
    // const [locations, setLocations] = useState([]);
    // const [disabled, setDisabled] = useState(false);
    const [doc, setDoc] = useState(null);
    const [cleanHtml, setCleanHtml] = useState("");

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

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

    // function handleFieldChange(field, value) {
    //     setUser((prev) => ({ ...prev, [field]: value }));
    // }

    // async function handleSave() {
    //     // Validate form
    //     if (user.username.trim().length < 3) {
    //         notify("A username must have a minimum of 3 characters.", "error");
    //         return;
    //     }
    //     if (user.fullName.trim().length < 3) {
    //         notify("Full name must have a minimum of 3 characters.", "error");
    //         return;
    //     }
    //     if (user.department.length === 0) {
    //         notify("At least one department is required.", "error");
    //         return;
    //     }
    //     if (user.location.length === 0) {
    //         notify("A location is required.", "error");
    //         return;
    //     }
    //     if (user.position.length === 0) {
    //         notify("A position is required.", "error");
    //         return;
    //     }

    //     try {
    //         if (id) {
    //             // Edit
    //             await api.put(`/users/${id}`, user);
    //             notify("User updated successfully.", "success");
    //         } else {
    //             // New
    //             await api.post(`/users`, user);
    //             notify("User created successfully.", "success");
    //         }
    //         setTimeout(() => navigate("/users"), 1200);
    //     } catch (error) {
    //         const backendMessage = error.response?.data?.message
    //         console.error("Save failed:", backendMessage);
    //         notify(`Failed to save changes. ${backendMessage}`, "error");
    //     }
    // }

    // async function handleTerminate() {
    //     try {
    //         await api.patch(`/users/${id}`);
    //         notify(`User terminated successfully`, "success");
    //         fetchSingleDocument();
    //     } catch (error) {
    //         notify(`User terminated failed: ${error}`, "error");
    //     }
    // }

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
                            <Button variant="outlined" onClick={() => navigate(-1)}>
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
                    <Typography sx={{ mb: 2 }}>
                        {parse(cleanHtml)}
                    </Typography>


                </Paper>

            </div>
        </>
    );
}
