import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import SelectWithSearch from "../components/SelectWithSearch";
import ApplicationsTransferList from "../components/ApplicationsTransferList";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";

export default function AccessRequestNew() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [systemApplications, setSystemApplications] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [requestNote, setRequestNote] = useState("");

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    // Required to populate user list
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

    // Required to populate system apps
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

    async function handleSubmit() {
        // setLoading(true);
        try {
            if (!selectedUser) {
                notify("Request not submitted. No user selected.", "error");
                return;
            }

            const request = {
                userId: selectedUser._id,
                applicationId: selectedApplications,
                requestNote,
            }

            const response = await api.post(`/uac/access-requests`, request);
            if (response.data.results.created.length === 0) {
                notify("No successful requests. Duplicate requests or requests where the user already has access are ignored. Review user's assignments in Configuration > Users.", "error");
                return;
            }
            if (response.data.results.alreadyRequested.length > 0 || response.data.results.alreadyActive.length > 0) {
                notify("Some duplicate requests or requests where the user already has access were ignored. Review user's assignments in Configuration > Users.", "error");
                return;
            }
            notify("All requests submitted successfully.", "success");
            return;
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        } finally {
            // Reset form
            setSelectedUser(null);
            setSelectedApplications([]);
            setRequestNote("");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Module failure.</p>

    return (
        <div style={{ margin: "0 auto", padding: "1rem" }}>
            <PageTitle title="New Access Request" />
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Request Application Access
                </Typography>

                <SelectWithSearch
                    options={users}
                    label="Select User"
                    labelField="fullName"
                    value={selectedUser}
                    onChange={(event, val) => {
                        setSelectedUser(val)
                    }}
                />

                <Typography>Request Systems</Typography>
                <ApplicationsTransferList systems={systemApplications} selected={selectedApplications} onChange={setSelectedApplications} />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Request Notes"
                    value={requestNote}
                    onChange={(e) =>
                        setRequestNote(e.target.value)
                    }
                    sx={{ mt: 2 }}
                />


                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Request
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                        Close
                    </Button>
                </div>
            </Paper>
            <ToastContainer />

        </div>
    );
}
