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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../App.css";
import ResetPasswordForm from "../components/ResetPasswordForm";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import Alert from '@mui/material/Alert';

export default function Users() {
    const navigate = useNavigate();
    const { loading, setLoading } = useLoading();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showActive, setShowActive] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    async function fetchUsers() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/users/");
            if (res.data.users) {
                setUsers(res.data.users);
            } else {
                setUsers([]);
                setError(res.data.message || "No users found.");
            }
        } catch (err) {
            console.error("Failed to fetch users:", err.message);
            setError("Could not load users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    function handleRefresh() {
        fetchUsers();
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    // Multiple filters
    const filteredUsers = users.filter((u) => u.isActive === showActive).filter((u) => {
        const term = searchTerm.toLowerCase(); return (
            u.fullName.toLowerCase().includes(term) ||
            u.username.toLowerCase().includes(term) ||
            (u.position || "").toLowerCase().includes(term));
    });

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div className="page-content">
            <PageTitle title="Manage Users" />
            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">Users</Typography>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={() => navigate("/users/new")}
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
                <div className="filter-container">
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 2, mr: 2, width: 300 }}
                    />


                    {/* Toggle to show Active / Inactive */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showActive}
                                onChange={(e) => setShowActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={showActive ? "Showing Active Users" : "Showing Inactive Users"}
                        sx={{ mb: 1 }}
                    />

                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label="users table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ pl: 0 }}>Full Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell sx={{ pr: 0 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d) => (
                                    <TableRow
                                        key={d._id}
                                        hover
                                    >
                                        <TableCell sx={{ pl: 0 }}>
                                            {d.fullName}
                                        </TableCell>
                                        <TableCell>
                                            {d.username.toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            {d.position}
                                        </TableCell>
                                        <TableCell sx={{ pr: 0 }}>
                                            <div className="cta-btn-container">
                                                <Button variant="outlined" onClick={() => navigate(`/users/${d._id}`)}>
                                                    Edit
                                                </Button>
                                                {/* userReset false, will force user to reset their password upon login. */}
                                                <ResetPasswordForm userReset={false} userIdToChange={d._id} />
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
                    count={filteredUsers.length} // ✅ pagination uses filtered count
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
