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
import KeyOffOutlinedIcon from '@mui/icons-material/KeyOffOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import Badge from '@mui/material/Badge';

export default function RequestsOverview({ id, fullName }) {

    const navigate = useNavigate();
    const [accessRequests, setAccessRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tableNote, setTableNote] = useState(null);
    const [activateTotal, setActivateTotal] = useState(0);
    const [revokeTotal, setRevokeTotal] = useState(0);

    async function fetchMyAccessRequests() {
        try {
            setTableNote(null);
            setLoading(true);
            setError(null);
            const res = await api.get("/uac/access-requests/to-action", {
                params: { userId: id, status: "New" }
            });

            // Continue to display table headers if results are empty, for more consistent UI. 404 downed on back-end too.

            const items = res.data.toActionRequests || [];
            setAccessRequests(items);
            setActivateTotal(res.data?.counts.activate);
            setRevokeTotal(res.data?.counts.revoke);

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
        fetchMyAccessRequests();
    }, []);

    // Block module if error during rendering.
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px", mb: "1rem" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    System Management Required Action
                </Typography>
                <div className="dashboard-access-request-summary">
                    <div className="dashboard-access-request-icons">
                        <Badge badgeContent={activateTotal} color="primary">
                            <div className="dashboard-access-request-icons-background" >
                                <KeyOutlinedIcon sx={{ fontSize: 75, color: "#00B388", fontVariationSettings: `"wght" 100, "OUTLINE" 0`, }} />
                            </div>
                        </Badge>
                        <div className="dashboard-access-request-icons-background" >
                            <Badge badgeContent={revokeTotal} color="primary">
                                <KeyOffOutlinedIcon sx={{ fontSize: 75, color: "#E03C31", fontVariationSettings: `"wght" 100, "OUTLINE" 0`, }} />
                            </Badge>
                        </div>
                    </div>
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label="users table"
                        sx={{ width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>System Name</TableCell>
                                <TableCell>Request Type</TableCell>
                                <TableCell>Requested By</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accessRequests.map((r) => (
                                <TableRow key={r._id} hover>
                                    <TableCell>{r.userId?.fullName}</TableCell>
                                    <TableCell>{r.applicationId?.system}</TableCell>
                                    <TableCell>{r.requestType}</TableCell>
                                    <TableCell>{r.requestedBy?.fullName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {tableNote ? <Typography sx={{ mb: 2, p: 1 }}>{tableNote}</Typography> : ""}

                <div className="cta-btn-container" style={{ marginTop: "16px" }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/access-requests")}
                        sx={{ mb: 2 }}
                    >
                        Manage Requests
                    </Button>
                </div>
            </Paper>
        </div>
    );
}