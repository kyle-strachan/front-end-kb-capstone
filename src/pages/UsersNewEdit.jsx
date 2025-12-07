import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    TextField,
    Button,
    Typography,
    Autocomplete,
    Alert,
} from "@mui/material";
import SelectWithSearch from "../components/SelectWithSearch";
import AccessRequests from "../components/AccessRequests";
import AccessAssignments from "../components/AccessAssignments";
import CustomDialogYesNo from "../components/CustomDialogYesNo";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import { MINIMUM_USERNAME_LENGTH } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

export default function UsersNewEdit() {
    let { id } = useParams(); // will be undefined for "New"
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const [userToManage, setUserToManage] = useState({
        username: "",
        fullName: "",
        location: "",
        department: [],
        email: "",
        position: "",
        isActive: true,
        roles: [],
    });
    const [refreshRequests, setRefreshRequests] = useState(0);
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
    const { user } = useAuth();


    useEffect(() => {
        fetchUsers();
    }, [id]);

    async function fetchUsers() {
        try {
            setLoading(true);
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
                    setUserToManage({
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
        setUserToManage((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        // Validate form
        if (userToManage.username.trim().length < MINIMUM_USERNAME_LENGTH) {
            notify(`A username must have a minimum of ${MINIMUM_USERNAME_LENGTH} characters.`, "error");
            return;
        }
        if (userToManage.fullName.trim().length < 3) {
            notify("Full name must have a minimum of 3 characters.", "error");
            return;
        }
        // if (user.roles.length === 0) { // Role may be blank for external supplier
        //     notify("At least one role is required.", "error");
        //     return;
        // }
        if (userToManage.department.length === 0) {
            notify("At least one department is required.", "error");
            return;
        }
        if (userToManage.location.length === 0) {
            notify("A location is required.", "error");
            return;
        }
        if (userToManage.position.length === 0) {
            notify("The user's position is required.", "error");
            return;
        }

        try {
            if (id) {
                // Edit
                await api.put(`/users/${id}`, userToManage);
                notify("User updated successfully.", "success");
            } else {
                // New
                const res = await api.post(`/users`, userToManage);
                setUserToManage(prev => ({ ...prev, _id: res.data.newId }));
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
                        value={userToManage.username}
                        onChange={(e) => handleFieldChange("username", e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Full Name"
                        value={userToManage.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Autocomplete
                        multiple
                        options={roleOptions}
                        getOptionLabel={(option) => option.label}
                        value={roleOptions.filter((opt) => (userToManage.roles || []).includes(opt.value))}
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
                        size="medium"
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Alert sx={{ mb: 2 }} severity="info">Departments provide access to documents.</Alert>
                    <SelectWithSearch
                        options={departments}
                        label="Departments"
                        labelField="department"
                        multiple
                        value={departments.filter((c) => (userToManage.department || []).includes(c._id))}
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
                        value={locations.find((c) => c._id === userToManage.location) || null}
                        onChange={(e, newValue) =>
                            handleFieldChange("location", newValue ? newValue._id : "")
                        }
                        required
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Email"
                        value={userToManage.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Position"
                        value={userToManage.position}
                        onChange={(e) => handleFieldChange("position", e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    {id && (<Typography>Status: {userToManage.isActive ? "Active" : "Terminated"}</Typography>)}

                    {/* Show password box for new users only */}
                    {!id && (
                        <TextField
                            fullWidth
                            autoComplete="new-password"
                            variant="outlined"
                            label="Temporary Password"
                            type="password"
                            onChange={(e) => handleFieldChange("password", e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    )}

                    <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                        {id && userToManage.isActive === false && (<CustomDialogYesNo
                            variant="contained"
                            buttonLabel={"Reactivate"}
                            dialogTitle={"Confirm Reactivation"}
                            dialogContent={`Are you sure you wish to reactivate ${userToManage?.fullName}? Any previous granted access to software must be requested again.`}
                            dialogueYesAction={handleSave}
                        />)}
                        {id && userToManage.isActive === true && (
                            <Button variant="contained" onClick={handleSave}>
                                {id && userToManage.isActive === false ? "Reactivate" : "Save"}
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
                        {id && userToManage?.isActive && (<CustomDialogYesNo
                            buttonLabel={"Terminate"}
                            dialogTitle={"Confirm Termination"}
                            dialogContent={`Are you sure you wish to terminate ${userToManage?.fullName}? Terminate access requests will be sent to all admins.`}
                            dialogueYesAction={handleTerminate}
                            disabled={!user?.uiFlags?.enableTerminate}
                        />)}
                    </div>
                </Paper>
            </div>
            {id && (<div><AccessAssignments id={userToManage._id} fullName={userToManage.fullName} notify={notify} onChanged={() => setRefreshRequests(prev => prev + 1)} /></div>)}
            {id && (<div><AccessRequests id={userToManage._id} fullName={userToManage.fullName} refreshKey={refreshRequests} /></div>)}
        </>
    );
}
