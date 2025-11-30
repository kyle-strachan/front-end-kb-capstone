import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../App.css";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import Alert from '@mui/material/Alert';;
import { useAuth } from "../context/AuthContext";

export default function Users() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [tableNote, setTableNote] = useState(null)
    const [accessAssignments, setAccessAssignments] = useState([]);
    const { user } = useAuth();

    async function fetchAccessAssignments() {
        setLoading(true);
        setError(null);
        setTableNote("");
        try {
            const res = await api.get("/uac/access-assignments")
            if (res.data.assignments) {
                setAccessAssignments(res.data.assignments);
            }
        } catch (error) {
            setTableNote("No access assignments found.");
            setError(`Could not load Access Assignments. ${error}`)
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

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    // Multiple filters
    const filteredAccessAssignments = accessAssignments.filter((d) => {
        const term = searchTerm.toLowerCase();
        return (
            d.userId?.fullName.toLowerCase().includes(term) ||
            d.applicationId.system.toLowerCase().includes(term)
        );
    });

    return (
        <div className="page-content">
            <PageTitle title="Access Overview" />

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <Typography variant="h2">Current Assignments</Typography>
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
                <div className="filter-container">

                    <TextField
                        label="Search Name or Application"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2, mr: 2, width: 300 }}
                    />
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label="users table"
                        sx={{ minWidth: 650, width: "100%", tableLayout: "fixed" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "calc((100% - 200px) / 3)", pl: 0 }}>Full Name</TableCell>
                                <TableCell sx={{ width: "calc((100% - 200px) / 3)" }}>Position</TableCell>
                                <TableCell sx={{ width: "calc((100% - 200px) / 3)" }} >Application</TableCell>
                                <TableCell sx={{ width: "200px" }}></TableCell>
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
                                        <TableCell sx={{ width: "calc((100% - 200px) / 3)", pl: 0 }}>
                                            {d.userId?.fullName}
                                        </TableCell>
                                        <TableCell sx={{ width: "calc((100% - 200px) / 3)" }}>
                                            {d.userId?.position}
                                        </TableCell>
                                        <TableCell sx={{ width: "calc((100% - 200px) / 3)" }}>
                                            {d.applicationId.system}
                                        </TableCell>
                                        <TableCell sx={{ width: "200px", pr: 0 }}>
                                            <div className="cta-btn-container">
                                                {user?.uiFlags?.enableUserEdit && (
                                                    <Button variant="outlined" onClick={() => navigate(`/users/${d.userId._id}`)}>
                                                        Manage User
                                                    </Button>
                                                )}
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
                    count={filteredAccessAssignments.length} // Pagination uses filtered count
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
