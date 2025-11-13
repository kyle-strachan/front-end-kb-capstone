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
import Switch from "@mui/material/Switch"; // ✅ added
import FormControlLabel from "@mui/material/FormControlLabel"; // ✅ added
import { ToastContainer } from "react-toastify";
import "../App.css";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    // const [systemCategories, setSystemCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // ✅ new state for Active/Inactive toggle
    const [showActive, setShowActive] = useState(true);

    // function notify(message, type = "Info") {
    //     if (type === "success") {
    //         toast.success(message);
    //     } else {
    //         toast.error(message);
    //     }
    // }

    async function fetchUsers() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/users/");
            if (res.data.users && res.data.users) {
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

    if (error) return <p>{error}</p>;

    // ✅ apply toggle filter (no API calls, just client-side)
    const filteredUsers = users.filter((u) => u.isActive === showActive);

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Configuration</h2>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Users</h3>

                {/* ✅ toggle to show Active / Inactive */}
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
                        onClick={() => navigate("/users/new")}
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
                                <TableCell>Username</TableCell>
                                <TableCell>Position</TableCell>
                                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                    ID (dev only)
                                </TableCell>
                                <TableCell>Actions</TableCell>
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
                                        <TableCell>
                                            {d.fullName}
                                        </TableCell>
                                        <TableCell>
                                            {d.username}
                                        </TableCell>
                                        <TableCell>
                                            {d.position}
                                        </TableCell>
                                        <TableCell>
                                            {d._id}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => navigate(`/users/${d._id}`)}>
                                                Edit
                                            </Button>
                                            {/* userReset false, will force user to reset their password upon login. */}
                                            <ResetPasswordForm userReset={false} userIdToChange={d._id} />
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
            <ToastContainer />
        </div>
    );
}
