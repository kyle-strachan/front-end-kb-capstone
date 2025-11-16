import { useEffect, useState } from "react";
import { api } from "../api";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "../App.css";
import { ToastContainer } from 'react-toastify';
import notify from "../utils/toastify";

export default function Departments() {
    const [permissions, setPermissions] = useState([]);
    const [edited, setEdited] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPermission, setNewPermission] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    async function fetchPermissions() {
        try {
            const res = await api.get("/config/permissions");
            if (Array.isArray(res.data.permissions)) {
                setPermissions(res.data.permissions);
            } else {
                setPermissions([]);
                setError(res.data.message || "No permissions found.");
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message
            notify(`Failed to fetch permissions. ${backendMessage}`, "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPermissions();
    }, []);

    function handleFieldChange(id, field, value) {
        setPermissions((prev) =>
            prev.map((dept) => (dept._id === id ? { ...dept, [field]: value } : dept))
        );
        setEdited((prev) => [...new Set([...prev, id])]);
    }

    async function handleSave() {
        try {
            const updates = permissions.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/permissions", { updates });
            const results = res.data.results || [];
            const failedIds = results.filter((r) => !r.success).map((r) => r.id);

            setEdited((prev) => prev.filter((id) => failedIds.includes(id)));

            if (failedIds.length > 0) {
                notify(`Some updates failed:\n` +
                    results
                        .filter((r) => !r.success)
                        .map((r) => `${r.id}: ${r.message}`)
                        .join("\n"), "error");

            } else {
                notify("All changes saved successfully.", "success");
                setEdited([]);
            }
            await fetchPermissions();
        } catch (error) {
            const backendMessage = error.response?.data?.message
            notify(`Failed to fetch permissions. ${backendMessage}`, "error");
        }
    }

    async function handleInsert() {
        // Validate input
        if (newPermission.trim().length < 3) {
            notify("New permissions must have a minimum of 3 characters.", "error");
            return;
        }
        try {
            await api.post("/config/permissions", {
                permissionName: newPermission.trim(),
            });
            notify("Permission added successfully.", "success");
            setNewPermission("");
            await fetchPermissions();
        } catch (error) {
            const backendMessage = error.response?.data?.message
            notify(`Failed to fetch permissions. ${backendMessage}`, "error");
        }
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (loading) return <p>Loading permissions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Configuration (Developer)</h2>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Permissions</h3>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={edited.length === 0}
                        sx={{ mb: 2 }}
                    >
                        Save
                    </Button>
                </div>


                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        aria-label="permissions table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Permission Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {permissions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d) => (
                                    <TableRow
                                        key={d._id}
                                        hover
                                        sx={{
                                            backgroundColor: edited.includes(d._id)
                                                ? "#fffbe6"
                                                : "inherit",
                                        }}
                                    >
                                        <TableCell>
                                            <TextField
                                                variant="standard"
                                                value={d.permissionName}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        d._id,
                                                        "permissionName",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                                        >
                                            <TextField
                                                variant="standard"
                                                value={d.description}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        d._id,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={d.isActive}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        d._id,
                                                        "isActive",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={permissions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Paper sx={{ mt: 4, p: 2 }}>
                <h4>Add New</h4>
                <div className="btn-inline-container">
                    <TextField
                        id="input-new-permission"
                        helperText="Minimum three characters"
                        label="Permission Name"
                        variant="standard"
                        value={newPermission}
                        onChange={(e) => setNewPermission(e.target.value)}
                        sx={{ mr: 2, width: "100%" }}
                    />
                    <div>
                        <Button
                            variant="contained"
                            onClick={handleInsert}
                            disabled={newPermission.trim().length < 3}
                        >
                            Insert
                        </Button></div>
                </div>
            </Paper>
            <ToastContainer />
        </div>
    );
}
