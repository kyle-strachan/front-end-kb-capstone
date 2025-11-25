import { useEffect, useState } from "react";
import { api } from "../api";
import {
    Paper,
    Button,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import CustomDialogYesNo from "./CustomDialogYesNo";

export default function AccessAssignments({ id, fullName, notify }) {
    const [accessAssignments, setAccessAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableNote, setTableNote] = useState(null)

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
            const res = await api.post(`/uac/access-requests/revoke`, { ids: [id] });
            if (res.status === 200) {
                notify("Revocation request submitted successfully.", "success");

            } else {
                notify("Revocation request not submitted. Response not OK.", "error");
            }
        } catch (error) {
            notify(`Revocation request not submitted. ${error}`, "error");
        } finally {
            fetchAccessAssignments();
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
                                {/* Leave action header blank */}
                                <TableCell></TableCell>
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
                                        <div className="cta-btn-container">
                                            {d.pendingRevocation ? <Button variant="outlined" disabled>
                                                Pending Revocation
                                            </Button> : <CustomDialogYesNo
                                                buttonLabel={"Revoke"}
                                                dialogTitle={"Confirm Revocation"}
                                                dialogContent={`A request to revoke ${d.userId?.fullName}'s access to ${d.applicationId?.system} will be created. Do you wish to continue?`}
                                                dialogueYesAction={() => handleRevoke(d._id)}
                                            />}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {tableNote ? <Typography sx={{ mb: 2, p: 1 }}>{tableNote}</Typography> : ""}
            </Paper>
        </div>
    );
}