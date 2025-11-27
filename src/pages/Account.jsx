import { useAuth } from "../context/AuthContext";
import { Paper, Typography, Button, TextField } from "@mui/material"
import InputTextPassword from "../components/InputTextPassword"
import { useState } from "react";
import { api } from "../api";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";

export default function Account() {
    const { user, refreshUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const { loading, setLoading } = useLoading();

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
            setCurrentPassword("");
            setNewPassword("");
            setNewPassword2("");
        }
    }

    async function handleUpdatePassword() {
        try {
            const res = await api.patch("/auth/change-password", { newPassword }); //Add new password only.
            if (res.status === 200) {
                notify("Password changed successfully.", "success");
                // Reload user from DB to clear redirect
                await refreshUser();
            } else {
                notify(res.message, "error");
            }
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Unknown error";
            notify(message, "error");
        }
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <PageTitle title="My Account" />
            <Paper sx={{ p: 3, mb: "1rem" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    My Account
                </Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {user.fullName}
                </Typography>
                <Typography sx={{ mb: 2 }}>Username: {user.username}</Typography>
                <Typography sx={{ mb: 2 }}>Position: {user.postion}</Typography>
                <Typography sx={{ mb: 2 }}>Email: {user.email}</Typography>
                <Typography sx={{ mb: 2 }}>Assigned Roles: {user.roles}</Typography>
            </Paper>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Change Password
                </Typography>
                {user.passwordMustChange === true && (<div className="cta-notice">Password must be changed to continue.</div>)}

                <InputTextPassword value={(e) => setCurrentPassword(e.target.value)} label="Current Password" />
                <InputTextPassword value={(e) => setNewPassword(e.target.value)} label="New Password" />
                <InputTextPassword value={(e) => setNewPassword2(e.target.value)} label="Confirm New Password" />
                {newPassword2.length > 0 && newPassword !== newPassword2 && (
                    <Typography color="error" sx={{ mb: 2 }}>New passwords do not match.</Typography>
                )}
                <Button variant="contained" onClick={handleUpdatePassword} disabled={!(currentPassword.length > 0 && newPassword.length > 0 && newPassword2.length > 0 && newPassword === newPassword2)} >
                    Change Password
                </Button>
            </Paper>
            <ToastContainer />
        </div>
    );
}
