import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { api } from "../api";
import notify from '../utils/toastify';
import Paper from '@mui/material/Paper';
import { MINIMUM_PASSWORD_LENGTH } from "../utils/constants.js";
import { useState } from 'react';

export default function ResetPasswordForm({ userReset, userIdToChange }) {
    const [open, setOpen] = React.useState(false);
    const [password, setPassword] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const newPassword = password.trim();
        const forceUserToUpdate = !userReset;

        try {
            await api.post("/auth/reset", {
                userId: userIdToChange,
                newPassword: newPassword.trim(),
                passwordMustChange: forceUserToUpdate,
            });
            notify("Password reset successful.", "success");
        } catch (error) {
            console.error("Password update failed:", error.message);
            notify("Failed to reset password.", "error");
        } finally {
            handleClose();
        }
    };

    // MUI boilerplate
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Reset Password
            </Button>
            <Dialog open={open} onClose={handleClose} >
                <Paper sx={{ p: 1 }}>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Reset user password.
                        </DialogContentText>
                        <form onSubmit={handleSubmit} id="reset-password-form">
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="newPassword"
                                name="newPassword"
                                label="Temporary password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                fullWidth
                                variant="outlined"
                                helperText={`Minimum ${MINIMUM_PASSWORD_LENGTH} characters`}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" form="reset-password-form" variant="contained" disabled={password.length < MINIMUM_PASSWORD_LENGTH}>
                            Reset Password
                        </Button>
                        <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    </DialogActions>
                </Paper>
            </Dialog>
        </React.Fragment>
    );
}
