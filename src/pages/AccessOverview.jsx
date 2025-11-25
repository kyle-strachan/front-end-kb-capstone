import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ToastContainer } from "react-toastify";
import "../App.css";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showActive, setShowActive] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableNote, setTableNote] = useState(null)

    const [accessAssignments, setAccessAssignments] = useState([]);

    async function fetchAccessAssignments() {
        setLoading(true);
        setTableNote("");
        try {
            const res = await api.get("/uac/access-assignments")
            if (res.data.assignments) {
                setAccessAssignments(res.data.assignments);
            }
        } catch (error) {
            setTableNote("No access assignments found.");
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

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (error) return <p>{error}</p>;

    // Multiple filters
    const filteredAccessAssignments = accessAssignments.filter((d) => {
        const term = searchTerm.toLowerCase();
        return (
            d.userId.fullName.toLowerCase().includes(term) ||
            d.applicationId.system.toLowerCase().includes(term)
        );
    });

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Access Overview</h2>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Current Assignments</h3>

                <div className="space-between-container">
                    <div className="filter-container">

                        <TextField
                            label="Search Name or Application"
                            variant="standard"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2, mr: 2, width: 300 }}
                        />
                    </div>


                    <div className="cta-btn-container">
                        <Button
                            variant="contained"
                            onClick={() => navigate("/access-request")}
                            sx={{ mb: 2 }}
                        >
                            New Access Request
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            sx={{ mb: 2 }}
                        >
                            {loading === true ? "Loading" : "Refresh"}
                        </Button>
                    </div>
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
                                <TableCell>Position</TableCell>
                                <TableCell>Application</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAccessAssignments
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
                                            {d.userId.position}
                                        </TableCell>
                                        <TableCell>
                                            {d.applicationId.system}
                                        </TableCell>
                                        <TableCell>
                                            <div className="cta-btn-container">
                                                <Button variant="outlined" onClick={() => navigate(`/users/${d.userId._id}`)}>
                                                    Manage User
                                                </Button>
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
                    count={filteredAccessAssignments.length} // ✅ pagination uses filtered count
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
