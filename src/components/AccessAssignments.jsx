import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { api } from "../api";
import {
    Paper,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import SelectWithSearch from "./SelectWithSearch";
import CustomDialogYesNo from "./CustomDialogYesNo";

export default function AccessAssignments({ id, fullName }) {

    // const navigate = useNavigate();
    const [accessAssignments, setAccessAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableNote, setTableNote] = useState(null)

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function fetchAccessAssignments() {
        try {
            setTableNote(null);
            setLoading(true);
            setError(null);
            const res = await api.get("/uac/access-assignments", {
                params: { userId: id }
            });

            // Continue to display table headers if results are empty, for more consistent UI. 404 downed on back-end too.
            const items = res.data.assignments || [];
            setAccessAssignments(items);

            if (items.length === 0) {
                setTableNote("No active assignments");
            } else {
                setTableNote("");
            }


        } catch (error) {
            console.error("Failed to fetch access assignments:", error.message);
            setError("Could not load access assignments.");
            setAccessAssignments([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccessAssignments();
    }, []);

    function handleRefresh() {
        fetchAccessAssignments();
    }

    async function handleRevoke(id) {
        try {
            const res = await api.post(`/uac/access-assignments/revoke`, { ids: [id] });
            if (res.status === 200) {
                notify("Revocation request submitted successfully.", "success");

            } else {
                notify("Revocation request not submitted. Response not OK.", "error");
            }
        } catch (error) {
            notify(`Revocation request not submitted. ${error}`, "error");
        }
    }

    // Block module if error during rendering.
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Active Access Assignments {fullName}
                </Typography>

                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleRefresh}
                        sx={{ mb: 2 }}
                    >
                        {loading === true ? "Loading" : "Refresh"}
                    </Button>
                    {/* <Button
                        variant="contained"
                        onClick={() => navigate("/users/new")}
                        sx={{ mb: 2 }}
                    >
                        New
                    </Button> */}
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        aria-label="users table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>System Name</TableCell>
                                <TableCell>Active Since</TableCell>
                                <TableCell>Completed By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accessAssignments.map((d) => (
                                <TableRow key={d._id} hover>
                                    <TableCell>{d.userId?.fullName}</TableCell>
                                    <TableCell>{d.applicationId?.system}</TableCell>
                                    <TableCell>{new Date(d.activeAt).toLocaleString()}</TableCell>
                                    <TableCell>{d.completedBy?.fullName}</TableCell>
                                    <TableCell>
                                        {d.pendingRevocation ? <Button variant="outlined" disabled>
                                            Pending Revocation
                                        </Button> : <CustomDialogYesNo
                                            buttonLabel={"Revoke"}
                                            dialogTitle={"Confirm Revocation"}
                                            dialogContent={`A request to revoke ${d.userId?.fullName}'s access to ${d.applicationId?.system} will be created. Do you wish to continue?`}
                                            dialogueYesAction={() => handleRevoke(d._id)}
                                        />}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {tableNote ? <Typography sx={{ mb: 2, p: 1 }}>{tableNote}</Typography> : ""}
            </Paper>
            <ToastContainer />

        </div>
    );
}