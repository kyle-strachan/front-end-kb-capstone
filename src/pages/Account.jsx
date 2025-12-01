import { useAuth } from "../context/AuthContext";
import { Paper, Typography, Button, TextField } from "@mui/material"
import InputTextPassword from "../components/InputTextPassword"
import { useState } from "react";
import { api } from "../api";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import Alert from '@mui/material/Alert';

export default function Account() {
    const { user, refreshUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const { setLoading } = useLoading();


    async function handleUpdatePassword() {
        try {
            setLoading(true);
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
        } finally {
            setCurrentPassword("");
            setNewPassword("");
            setNewPassword2("");
            setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <PageTitle title="My Account" />
            <Paper sx={{ p: 3 }}>
                <Typography variant="h2">{user.fullName} ({user.username})</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>
                </Typography>
                <Typography variant="h3" sx={{ mb: 2 }}>
                    Change Password
                </Typography>
                {user.passwordMustChange === true && (<Alert sx={{ mb: 2 }} severity="warning">Password must be changed to continue.</Alert>)}

                <InputTextPassword id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} label="Current Password" />
                <InputTextPassword id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} label="New Password" />
                <InputTextPassword id="new-password-confirm" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} label="Confirm New Password" />
                {newPassword2.length > 0 && newPassword !== newPassword2 && (
                    <Typography color="error" sx={{ mb: 2 }}>New passwords do not match.</Typography>
                )}
                <Button variant="contained" onClick={handleUpdatePassword} disabled={!(currentPassword.length > 0 && newPassword.length > 0 && newPassword2.length > 0 && newPassword === newPassword2)} >
                    Change Password
                </Button>
            </Paper>
        </div>
    );
}
