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
import TransferList from "../components/SystemsTransferList";

export default function AccessRequestNew() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [systemApp, setSystemApp] = useState({
        system: "",
        isActive: true,
    });
    const [systemApplications, setSystemApplications] = useState([]);
    const [selectedSystems, setSelectedSystems] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [request, setRequest] = useState({
        userId: [],
        systemIds: [],
        requestNote: "",
    });


    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function fetchUsers() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/users/");
            if (res.data.users) {
                setUsers(res.data.users);
            } else {
                setUsers([]);
                setError(res.data.message || "No users found.");
            }
        } catch (err) {
            console.error("Failed to fetch users:", err.message);
            setError("Could not load users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchSystemApplications() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/system-applications");
            if (res.data.systemApplications) {
                setSystemApplications(res.data.systemApplications);
            } else {
                setSystemApplications([]);
                setError(res.data.message || "No system applications found.");
            }
        } catch (err) {
            console.error("Failed to fetch system applications:", err.message);
            setError("Could not load system applications.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSystemApplications();
    }, []);

    function handleFieldChange(field, value) {
        setSystemApp((prev) => ({ ...prev, [field]: value }));
    }

    async function handleRequest() {
        try {
            if (id) {
                // Edit
                await api.put(`/config/system-applications/${id}`, systemApp);
                notify("System application updated successfully.", "success");
            } else {
                // New
                await api.post(`/config/system-applications`, systemApp);
                notify("System application created successfully.", "success");
            }
            // navigate("/system-applications");
            setTimeout(() => navigate("/system-applications"), 1200);
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Module failure.</p>

    return (
        <div style={{ margin: "0 auto", padding: "1rem" }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {id ? "Edit System Application" : "New System Application"}
                </Typography>


                <SelectWithSearch
                    options={users}
                    label="Select User"
                    labelField="fullName"
                    multiple
                    value={users.filter((u) => systemApp.userId?.includes(u._id))}
                    onChange={(e, newValue) =>
                        handleFieldChange(
                            "userId",
                            newValue.map((v) => v._id)
                        )
                    }

                />

                <Typography>Request Systems</Typography>
                <TransferList systems={systemApplications} selected={selectedSystems} onChange={setSelectedSystems} />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Request Notes"
                    value={request.requestNote}
                    onChange={(e) =>
                        setRequest((prev) => ({
                            ...prev,
                            requestNote: e.target.value,
                        }))
                    }
                    sx={{ mt: 2 }}
                />


                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleRequest}>
                        Request
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </Paper>
            <ToastContainer />

        </div>
    );
}
