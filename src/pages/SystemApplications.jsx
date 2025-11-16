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
import { ToastContainer, } from "react-toastify";
import "../App.css";

export default function SystemApplications() {
    const navigate = useNavigate();
    const [systemApplications, setSystemApplications] = useState([]);
    const [systemCategories, setSystemCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // function notify(message, type = "Info") {
    //     if (type === "success") {
    //         toast.success(message);
    //     } else {
    //         toast.error(message);
    //     }
    // }

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
        } catch (err) {
            console.error("Failed to fetch system applications:", err.message);
            setError("Could not load system applications.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSystemApplications();
    }, []);

    function handleRefresh() {
        fetchSystemApplications();
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Configuration</h2>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>System Applications</h3>
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
                        onClick={() => navigate("/system-applications/new")}
                        sx={{ mb: 2 }}
                    >
                        New
                    </Button>
                </div>


                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        aria-label="system applications table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>System Application Name</TableCell>
                                <TableCell>Category</TableCell>
                                {/* <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                    ID (dev only)
                                </TableCell> */}
                                <TableCell></TableCell>
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
                                        <TableCell>
                                            {d.system}
                                        </TableCell>
                                        <TableCell>
                                            {systemCategories.find((c) => c._id === d.category)?.category || 'Undefined'}

                                        </TableCell>
                                        {/* <TableCell
                                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                                        >
                                            {d._id}
                                        </TableCell> */}
                                        <TableCell>
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
            <ToastContainer />
        </div>
    );
}
