import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AccessRequests({ id, fullName }) {

    const navigate = useNavigate();
    const [accessRequests, setAccessRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableNote, setTableNote] = useState(null)

    async function fetchAccessRequests() {
        try {
            setTableNote(null);
            setLoading(true);
            setError(null);
            const res = await api.get("/uac/access-requests", {
                params: { userId: id, status: "New" }
            });

            // Continue to display table headers if results are empty, for more consistent UI. 404 downed on back-end too.

            const items = res.data.accessRequests || [];
            setAccessRequests(items);

            if (items.length === 0) {
                setTableNote("No pending requests");
            } else {
                setTableNote("");
            }


        } catch (error) {
            console.error("Failed to fetch access requests:", error.message);
            setError("Could not load access requests.");
            setAccessRequests([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAccessRequests();
    }, []);

    function handleRefresh() {
        fetchAccessRequests();
    }

    // Block module if error during rendering.
    if (error) return <p>{error}</p>;

    return (
        <div className="page-content">

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Pending Access Requests for {fullName}
                </Typography>

                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleRefresh}
                        sx={{ mb: 2 }}
                    >
                        {loading === true ? "Loading" : "Refresh"}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/access-request")}
                        sx={{ mb: 2 }}
                    >
                        New
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
                                <TableCell>Request Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Requested By</TableCell>
                                <TableCell>Requested At</TableCell>
                                {/* <TableCell>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accessRequests.map((r) => (
                                <TableRow key={r._id} hover>
                                    <TableCell>{r.userId?.fullName}</TableCell>
                                    <TableCell>{r.applicationId?.system}</TableCell>
                                    <TableCell>{r.requestType}</TableCell>
                                    <TableCell>{r.status}</TableCell>
                                    <TableCell>{r.requestedBy?.fullName}</TableCell>
                                    <TableCell>{new Date(r.requestedAt).toLocaleString()}</TableCell>
                                    <TableCell>{/* actions later */}</TableCell>
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