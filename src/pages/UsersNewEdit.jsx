import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Autocomplete,
} from "@mui/material";
import SelectWithSearch from "../components/SelectWithSearch";
import AccessRequests from "../components/AccessRequests";
import AccessAssignments from "../components/AccessAssignments";
import CustomDialogYesNo from "../components/CustomDialogYesNo";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";

export default function UsersNewEdit() {
    let { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        location: "",
        department: [],
        email: "",
        position: "",
        isActive: true,
        roles: [],
    });
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [disabled, setDisabled] = useState(false); // Remove later, use !id
    const roleOptions = [
        { label: "Viewer", value: "User" },
        { label: "Supervisor", value: "Supervisor" },
        { label: "Manager", value: "Manager" },
        { label: "Human Resources", value: "HumanResources" },
        { label: "Administrator", value: "SystemAdmin" },
    ];

    useEffect(() => {
        fetchUsers();
    }, [id]);

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
                        roles: foundUser.roles || "",
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
        // Validate form
        if (user.username.trim().length < 3) {
            notify("A username must have a minimum of 3 characters.", "error");
            return;
        }
        if (user.fullName.trim().length < 3) {
            notify("Full name must have a minimum of 3 characters.", "error");
            return;
        }
        if (user.department.length === 0) {
            notify("At least one department is required.", "error");
            return;
        }
        if (user.location.length === 0) {
            notify("A location is required.", "error");
            return;
        }
        if (user.position.length === 0) {
            notify("A position is required.", "error");
            return;
        }

        try {
            if (id) {
                // Edit
                await api.put(`/users/${id}`, user);
                notify("User updated successfully.", "success");
            } else {
                // New
                const res = await api.post(`/users`, user);
                // console.log(res);
                setUser(prev => ({ ...prev, _id: res.data.newId }));
                navigate(`/users/${res.data.newId}`);
                notify("User created successfully.", "success");
            }
            fetchUsers();
        } catch (error) {
            const backendMessage = error.response?.data?.message
            console.error("Save failed:", backendMessage);
            notify(`Failed to save changes. ${backendMessage}`, "error");
        }
    }

    async function handleTerminate() {
        try {
            await api.patch(`/users/${id}`);
            notify(`User terminated successfully`, "success");
            fetchUsers();
        } catch (error) {
            notify(`User terminated failed: ${error}`, "error");
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
                        variant="outlined"
                        label="Username"
                        value={user.username}
                        onChange={(e) => handleFieldChange("username", e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Full Name"
                        value={user.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Autocomplete
                        multiple
                        options={roleOptions}
                        getOptionLabel={(option) => option.label}
                        value={roleOptions.filter((opt) => (user.roles || []).includes(opt.value))}
                        onChange={(e, newValue) =>
                            handleFieldChange(
                                "roles",
                                newValue.map((v) => v.value)
                            )
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Roles"
                                placeholder="Select roles…"
                                variant="outlined"
                            />
                        )}
                        size="small"
                        fullWidth
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
                        required
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        value={user.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Position"
                        value={user.position}
                        onChange={(e) => handleFieldChange("position", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {/* Show isActive box only for existing users. All new users are active by default */}
                    {/* {id && (
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
                    )} */}
                    {id && (<Typography>Status: {user.isActive ? "Active" : "Terminated"}</Typography>)}

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
                        {id && user.isActive === false && (<CustomDialogYesNo
                            variant="contained"
                            buttonLabel={"Reactivate"}
                            dialogTitle={"Confirm Reactivation"}
                            dialogContent={`Are you sure you wish to reactivate ${user?.fullName}? Any previous granted access to software must be requested again.`}
                            dialogueYesAction={handleSave}
                        />)}
                        {id && user.isActive === true && (
                            <Button variant="contained" onClick={handleSave}>
                                {id && user.isActive === false ? "Reactivate" : "Save"}
                            </Button>
                        )}
                        {!id && (
                            <Button variant="contained" onClick={handleSave}>
                                Insert
                            </Button>
                        )}
                        <Button variant="outlined" onClick={() => navigate("/users")}>
                            {id ? "Close" : "Cancel"}
                        </Button>
                        {id && user?.isActive && (<CustomDialogYesNo
                            buttonLabel={"Terminate"}
                            dialogTitle={"Confirm Termination"}
                            dialogContent={`Are you sure you wish to terminate ${user?.fullName}? Terminate access requests will be sent to all admins.`}
                            dialogueYesAction={handleTerminate}
                        />)}
                        {/* {id && (<Button variant="outlined" color="error" onClick={handleTerminate}>
                            Terminate
                        </Button>)} */}
                    </div>
                </Paper>
            </div>
            {id && (<div><AccessAssignments id={user._id} fullName={user.fullName} notify={notify} /></div>)}
            {id && (<div><AccessRequests id={user._id} fullName={user.fullName} /></div>)}
        </>
    );
}
