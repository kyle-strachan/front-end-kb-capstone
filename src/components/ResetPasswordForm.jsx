import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { api } from "../api";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPasswordForm({ userReset, userIdToChange }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const newPassword = formJson.newPassword;
        const forceUserToUpdate = !userReset;

        try {

            // TODO: APPLY STANDARD PASSWORD FRONT END LOGIC
            // if (newPassword.trim().length < 8) {
            //     notify("New locations must have a minimum of 8 characters.", "error");
            //     return;
            // }

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

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Reset Password
            </Button>
            <Dialog open={open} onClose={handleClose}>
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
                            label="Enter New Password"
                            type="password"
                            fullWidth
                            variant="standard"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="reset-password-form">
                        Reset Password
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </React.Fragment>
    );
}
