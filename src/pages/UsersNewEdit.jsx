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

export default function UsersNewEdit() {
    const { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        location: "",
        department: [],
        email: "",
        position: "",
        isActive: true,
        permissions: [],
    });
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [disabled, setDisabled] = useState(false); // Remove later, use !id


    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            // fetch categories and users in parallel
            const [departmentRes, userRes, locationRes] = await Promise.all([
                api.get("/config/departments"),
                api.get("/users"),
                api.get("/config/locations"),
            ]);

            // setUser(userRes.data.users || []);
            setDepartments(departmentRes.data.departments || []);
            setLocations(locationRes.data.locations || []);

            if (id) {
                // Edit mode: fetch this users's current data
                const foundUser = userRes.data.users.find((a) => a._id === id);
                if (foundUser) {
                    setUser({
                        _id: foundUser._id,
                        username: foundUser.username || "",
                        fullName: foundUser.fullName || "",
                        location: foundUser.location || "",
                        // department: Array.isArray(foundUser.department) ? foundUser.department : [],
                        department: Array.isArray(foundUser.department)
                            ? foundUser.department
                            : foundUser.department
                                ? [foundUser.department]
                                : [],
                        email: foundUser.email || "",
                        position: foundUser.position || "",
                        isActive: foundUser.isActive ?? true,
                        permissions: Array.isArray(foundUser.permissions) ? foundUser.permissions : [],

                    });
                    setDisabled(true);
                } else {
                    notify("User not found.", "error");
                    navigate("/users");
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
        setUser((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        try {
            if (id) {
                // Edit
                await api.put(`/users/${id}`, user);
                notify("User updated successfully.", "success");
            } else {
                // New
                await api.post(`/users`, user);
                notify("User created successfully.", "success");
            }
            setTimeout(() => navigate("/users"), 1200);
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div style={{ margin: "0 auto", padding: "1rem" }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {id ? "Edit User" : "New User"}
                    </Typography>
                    <TextField
                        fullWidth
                        disabled={disabled}
                        variant="standard"
                        label="Username"
                        value={user.username}
                        onChange={(e) => handleFieldChange("username", e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Full Name"
                        value={user.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department (provide Doc access to)"
                        labelField="department"
                        multiple
                        value={departments.filter((c) => (user.department || []).includes(c._id))}
                        onChange={(e, newValue) =>
                            handleFieldChange(
                                "department",
                                Array.isArray(newValue) ? newValue.map((v) => v._id) : []
                            )
                        }
                    />

                    <SelectWithSearch
                        options={locations}
                        label="Location"
                        labelField="location"
                        value={locations.find((c) => c._id === user.location) || null}
                        onChange={(e, newValue) =>
                            handleFieldChange("location", newValue ? newValue._id : "")
                        }
                    />


                    <TextField
                        fullWidth
                        variant="standard"
                        label="Email"
                        value={user.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="standard"
                        label="Position"
                        value={user.position}
                        onChange={(e) => handleFieldChange("position", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {/* Show isActive box only for existing users. All new users are active by default */}
                    {id && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={user.isActive}
                                    onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                                />
                            }
                            label="Active"
                            sx={{ mt: 2 }}
                        />
                    )}

                    {/* Show password box for new users only */}
                    {!id && (
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Temporary Password"
                            type="password"
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    )}

                    <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>


                </Paper>
                <ToastContainer />

            </div>
            <div>
                <AccessAssignments id={user._id} fullName={user.fullName} />
            </div>
            <div>
                <AccessRequests id={user._id} fullName={user.fullName} />
            </div>
        </>
    );
}
