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
import "../App.css";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import { Typography } from "@mui/material";
import Alert from '@mui/material/Alert';

export default function SystemApplications() {
    const navigate = useNavigate();
    const [systemApplications, setSystemApplications] = useState([]);
    const [systemCategories, setSystemCategories] = useState([]);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Populate applications list
    async function fetchSystemApplications() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/system-applications");
            if (res.data.systemApplications && res.data.systemCategories) {
                setSystemApplications(res.data.systemApplications);
                setSystemCategories(res.data.systemCategories);
            } else {
                setSystemApplications([]);
                setSystemCategories([]);
                setError(res.data.message || "No system applications or categories found.");
            }
        } catch (error) {
            setError(`Could not load system applications. ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSystemApplications();
    }, []); // Get only on initial load

    function handleRefresh() {
        fetchSystemApplications();
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div className="page-content">
            <PageTitle title="System Applications" />

            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">System Applications</Typography>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={() => navigate("/system-applications/new")}
                        sx={{ mb: 2 }}
                    >
                        New
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        sx={{ mb: 2 }}
                    >
                        {loading === true ? "Loading" : "Refresh"}
                    </Button>
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label="system applications table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "40%", pl: 0 }}>System Application Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Active</TableCell>
                                <TableCell sx={{ width: 120 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {systemApplications
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d) => (
                                    <TableRow
                                        key={d._id}
                                        hover
                                    >
                                        <TableCell sx={{ width: "40%", pl: 0 }}>
                                            {d.system}
                                        </TableCell>
                                        <TableCell>
                                            {systemCategories.find((c) => c._id === d.category)?.category || 'Undefined'}
                                        </TableCell>
                                        <TableCell>
                                            {d.isActive ? "Active" : "Inactive"}
                                        </TableCell>
                                        <TableCell sx={{ width: 120, pr: 0 }}>
                                            <div className="cta-btn-container">
                                                <Button variant="outlined" onClick={() => navigate(`/system-applications/${d._id}`)}>
                                                    Edit
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
                    count={systemApplications.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
