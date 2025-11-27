import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
import CustomDialogYesNo from "../components/CustomDialogYesNo";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";

export default function AccessRequests() {
    const navigate = useNavigate();
    const [accessRequests, setAccessRequests] = useState([]);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function fetchAccessRequests() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/uac/access-requests",
                { params: { status: "New" } }
            );

            if (res.data.accessRequests) {
                setAccessRequests(res.data.accessRequests);
                // console.log(res.data.accessRequests);
            } else {
                setAccessRequests([]);
                setError(res.data.message || "No pending access requests found.");
            }
        } catch (error) {
            console.error(`Failed to fetch access requests in "New" status.`, error.message);
            setError("Could not load access requests.");
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

    async function handleApproveOrReject(id, action) {
        try {
            const res = await api.patch(`/uac/access-requests/${id}`, { action });
            notify(res.data?.message || "Access request updated completed successfully.", "success")
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            notify(`${backendMessage}` || `Access request not completed.`, "error");
        } finally {
            fetchAccessRequests();
        }
    }

    async function handleConfirmRevocation(id) {
        try {
            const res = await api.post(`uac/access-assignments/confirm-revoke/${id}`);
            notify(res.data?.message || "Access confirmed as revoked.", "success")
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            notify(`${backendMessage}` || `Access request not completed`, "error")
        } finally {
            fetchAccessRequests();
        }
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (error) return <p>{error}</p>;


    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <PageTitle title="Pending Access Requests" />

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Pending Requests</h3>

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
                                <TableCell>Application</TableCell>
                                <TableCell>Request Type</TableCell>
                                <TableCell>Requested By/At</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accessRequests
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d) => (
                                    <TableRow
                                        key={d._id}
                                        hover
                                    >
                                        <TableCell>
                                            {d.userId.fullName}
                                        </TableCell>
                                        <TableCell>
                                            {d.applicationId.system}
                                        </TableCell>
                                        <TableCell>
                                            {/* {d.requestType === "Revoke" ? <Typography color="red">{d.requestType}</Typography> : d.requestType} */}
                                            {d.requestType === "Revoke"
                                                ? <span style={{ color: "red" }}>{d.requestType}</span>
                                                : d.requestType}

                                        </TableCell>
                                        <TableCell>
                                            {d.requestedBy.fullName}/{new Date(d.requestedAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="cta-btn-container">
                                                {d.requestType === "Revoke" ? (<CustomDialogYesNo
                                                    buttonLabel={"Confirm Revocation"}
                                                    dialogTitle={"Confirm Revocation"}
                                                    dialogContent={`Has ${d.userId?.fullName} been completely removed from ${d.applicationId.system}?`}
                                                    dialogueYesAction={() => handleConfirmRevocation(d._id)}
                                                />) : (<><CustomDialogYesNo
                                                    buttonLabel={"Approve"}
                                                    dialogTitle={"Confirm Approval"}
                                                    dialogContent={`Has ${d.userId?.fullName} been setup in ${d.applicationId.system} and you wish to confirm the approval?`}
                                                    dialogueYesAction={() => handleApproveOrReject(d._id, "Approved")}
                                                /><CustomDialogYesNo
                                                        buttonLabel={"Reject"}
                                                        dialogTitle={"Confirm Rejection"}
                                                        dialogContent={`You are rejecting the request for ${d.userId?.fullName} to access ${d.applicationId.system}. Do you wish to continue?`}
                                                        dialogueYesAction={() => handleApproveOrReject(d._id, "Rejected")}
                                                    /></>)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={accessRequests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <ToastContainer />
        </div>
    );
}
