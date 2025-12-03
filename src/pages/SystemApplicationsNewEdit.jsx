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
import SelectWithSearch from "../components/SelectWithSearch";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import Alert from '@mui/material/Alert';
import { MINIMUM_SYSTEM_LENGTH } from "../utils/constants";

export default function SystemApplicationsNewEdit() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [systemApp, setSystemApp] = useState({
        system: "",
        category: "",
        isActive: true,
        adminUser: [],
        sendEmail: false,
        description: "",
    });
    const [systemCategories, setSystemCategories] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        try {
            setLoading(true);
            // Fetch categories and active users
            const [appRes, userRes] = await Promise.all([
                api.get("/config/system-applications"),
                api.get("/users/active"),
            ]);

            setSystemCategories(appRes.data.systemCategories || []);
            setUsers(userRes.data.users || []);

            if (id) {
                // Edit mode: fetch this app's current data
                const foundApp = appRes.data.systemApplications.find((a) => a._id === id);
                if (foundApp) {
                    setSystemApp({
                        system: foundApp.system || "",
                        category: foundApp.category || "",
                        isActive: foundApp.isActive ?? true,
                        adminUser: Array.isArray(foundApp.adminUser) ? foundApp.adminUser : [],
                        sendEmail: foundApp.sendEmail ?? false,
                        description: foundApp.description || "",
                    });
                } else {
                    notify("System Application not found.", "error");
                    navigate("/system-applications");
                }
            }
        } catch (error) {
            console.error("Failed to load data:", error.message);
            notify("Failed to load required data.", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleFieldChange(field, value) {
        setSystemApp((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
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
            navigate("/system-applications");
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    return (
        <div style={{ margin: "0 auto", padding: "1rem" }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {id ? "Edit System Application" : "New System Application"}
                </Typography>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="System Name"
                    value={systemApp.system}
                    onChange={(e) => handleFieldChange("system", e.target.value)}
                    sx={{ mt: 2, mb: 2 }}
                    helperText={
                        systemApp.system.length < MINIMUM_SYSTEM_LENGTH
                            ? `Must be at least ${MINIMUM_SYSTEM_LENGTH} characters.`
                            : ""
                    }
                />

                <SelectWithSearch
                    options={systemCategories}
                    label="Category"
                    labelField="category"
                    value={
                        systemCategories.find((c) => c._id === systemApp.category) || null
                    }
                    onChange={(e, newValue) =>
                        handleFieldChange("category", newValue ? newValue._id : "")
                    }
                />

                <Alert severity="info">A system must be active to allow new user requests. Marking a system inactive will not remove access to existing users.</Alert>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={systemApp.isActive}
                            onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                        />
                    }
                    label="Active"
                    sx={{ mt: 1, mb: 2 }}
                />

                <SelectWithSearch
                    options={users}
                    label="Admin Users"
                    labelField="fullName"
                    multiple
                    value={users.filter((u) => systemApp.adminUser.includes(u._id))}
                    onChange={(e, newValue) =>
                        handleFieldChange(
                            "adminUser",
                            newValue.map((v) => v._id)
                        )
                    }
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={systemApp.sendEmail}
                            onChange={(e) => handleFieldChange("sendEmail", e.target.checked)}
                        />
                    }
                    label="Send Email to admin users for new requests?"
                    sx={{ mt: 2 }}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    label="Description"
                    value={systemApp.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    sx={{ mt: 2 }}
                />

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                    <Button variant="contained" onClick={handleSave} disabled={(systemApp.system.length < MINIMUM_SYSTEM_LENGTH) || systemApp.category === "" || systemApp.adminUser.length === 0}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/system-applications")}>
                        Close
                    </Button>
                </div>
            </Paper >
        </div >
    );
}
