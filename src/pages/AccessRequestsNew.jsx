import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    Button,
    Typography,
} from "@mui/material";
import SelectWithSearch from "../components/SelectWithSearch";
import ApplicationsTransferList from "../components/ApplicationsTransferList";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import Alert from '@mui/material/Alert';

export default function AccessRequestNew() {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [systemApplications, setSystemApplications] = useState([]);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [requestNote, setRequestNote] = useState("");

    // Required to populate user list
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const [usersRes, appsRes] = await Promise.all([
                    api.get("/users/active"),
                    api.get("/config/system-applications?active=true"),
                ]);

                // Users
                if (usersRes.data.users) {
                    setUsers(usersRes.data.users);
                } else {
                    setUsers([]);
                    setError(usersRes.data.message || "No users found.");
                }

                // System Apps
                if (appsRes.data.systemApplications) {
                    setSystemApplications(appsRes.data.systemApplications);
                } else {
                    setSystemApplications([]);
                    setError(appsRes.data.message || "No system applications found.");
                }

            } catch {
                setError("Failed to load required data.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []); // Data fetch only on load

    async function handleSubmit() {
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

            if (request.applicationId.length === 0) {
                notify("Request not submitted. At least one system must be selected.", "error");
                return;
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
            notify(error.message || "Failed to save changes.", "error");
        } finally {
            // Reset form
            setSelectedUser(null);
            setSelectedApplications([]);
            setRequestNote("");
        }
    }

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div style={{ margin: "0 auto", padding: "1rem" }}>
            <PageTitle title="New Access Request" />
            <Paper sx={{ p: 3 }}>
                <Typography variant="h2">Request Application Access</Typography>

                <SelectWithSearch
                    options={users}
                    label="Select User"
                    labelField="fullName"
                    value={selectedUser}
                    onChange={(event, val) => {
                        setSelectedUser(val)
                    }}
                />

                <ApplicationsTransferList systems={systemApplications} selected={selectedApplications} onChange={setSelectedApplications} sx={{ mt: 10 }} />

                {/* Notes on requests are supported in DB and backend but not yet implemented into UI. Hidden for now */}
                {/* <TextField
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
                /> */}

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Request
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                        Close
                    </Button>
                </div>
            </Paper>
        </div>
    );
}
