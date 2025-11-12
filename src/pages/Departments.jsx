import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
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

export default function Departments() {
    const { user } = useAuth();
    const [departments, setDepartments] = useState([]);
    const [edited, setEdited] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDepartment, setNewDepartment] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    async function fetchDepartments() {
        try {
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) {
                setDepartments(res.data.departments);
            } else {
                setDepartments([]);
                setError(res.data.message || "No departments found.");
            }
        } catch (err) {
            console.error("Failed to fetch departments:", err.message);
            setError("Could not load departments.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartments();
    }, []);

    function handleFieldChange(id, field, value) {
        setDepartments((prev) =>
            prev.map((dept) => (dept._id === id ? { ...dept, [field]: value } : dept))
        );
        setEdited((prev) => [...new Set([...prev, id])]);
    }

    async function handleSave() {
        try {
            const updates = departments.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                alert("No changes to save.");
                return;
            }

            const res = await api.put("/config/departments", { updates });
            const results = res.data.results || [];
            const failedIds = results.filter((r) => !r.success).map((r) => r.id);

            setEdited((prev) => prev.filter((id) => failedIds.includes(id)));

            if (failedIds.length > 0) {
                alert(
                    `Some updates failed:\n` +
                    results
                        .filter((r) => !r.success)
                        .map((r) => `${r.id}: ${r.message}`)
                        .join("\n")
                );
            } else {
                alert("All changes saved successfully.");
                setEdited([]);
            }

            await fetchDepartments();
        } catch (error) {
            console.error("Save failed:", error.message);
            alert("Failed to save changes.");
        }
    }

    async function handleInsert() {
        try {
            if (newDepartment.trim().length < 3) {
                alert("New departments must have a minimum of 3 characters.");
                return;
            }

            await api.post("/config/departments", {
                department: newDepartment.trim(),
            });
            alert("Department added successfully.");
            setNewDepartment("");
            await fetchDepartments();
        } catch (error) {
            console.error("Insert failed:", error.message);
            alert("Failed to insert changes.");
        }
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (loading) return <p>Loading departments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Configuration</h2>
            <p>Welcome, {user?.fullName || user?.username}</p>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Departments</h3>
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
                        aria-label="departments table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Department Name</TableCell>
                                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                    ID (dev only)
                                </TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((dept) => (
                                    <TableRow
                                        key={dept._id}
                                        hover
                                        sx={{
                                            backgroundColor: edited.includes(dept._id)
                                                ? "#fffbe6"
                                                : "inherit",
                                        }}
                                    >
                                        <TableCell>
                                            <TextField
                                                variant="standard"
                                                value={dept.department}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        dept._id,
                                                        "department",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                                        >
                                            {dept._id}
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={dept.isActive}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        dept._id,
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
                    count={departments.length}
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
                        id="input-new-department"
                        helperText="Minimum three characters"
                        label="Department Name"
                        variant="standard"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        sx={{ mr: 2, width: "100%" }}
                    />
                    <div>
                        <Button
                            variant="contained"
                            onClick={handleInsert}
                            disabled={newDepartment.trim().length < 3}
                        >
                            Insert
                        </Button></div>
                </div>
            </Paper>
        </div>
    );
}
