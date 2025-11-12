import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
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
import { ToastContainer, toast } from 'react-toastify';

export default function SystemCategories() {
    const [systemCategories, setSystemCategories] = useState([]);
    const [edited, setEdited] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSystemCategory, setNewSystemCategory] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function fetchSystemCategories() {
        try {
            const res = await api.get("/config/system-categories");
            if (Array.isArray(res.data.systemCategories)) {
                setSystemCategories(res.data.systemCategories);
            } else {
                setSystemCategories([]);
                setError(res.data.message || "No system categories found.");
            }
        } catch (err) {
            console.error("Failed to fetch system categories:", err.message);
            setError("Could not load system categories.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSystemCategories();
    }, []);

    function handleFieldChange(id, field, value) {
        setSystemCategories((prev) =>
            prev.map((d) => (d._id === id ? { ...d, [field]: value } : d))
        );
        setEdited((prev) => [...new Set([...prev, id])]);
    }

    async function handleSave() {
        try {
            const updates = systemCategories.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/system-categories", { updates });
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

            await fetchSystemCategories();
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    async function handleInsert() {
        try {
            if (newSystemCategory.trim().length < 3) {
                notify("New system categories must have a minimum of 3 characters.", "error");
                return;
            }

            await api.post("/config/system-categories", {
                category: newSystemCategory.trim(),
            });
            notify("System category added successfully.", "success");
            setNewSystemCategory("");
            await fetchSystemCategories();
        } catch (error) {
            console.error("Insert failed:", error.message);
            notify("Failed to insert system category.", "error");
        }
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (loading) return <p>Loading system categories...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Configuration</h2>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Locations</h3>
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
                        aria-label="system categories table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>System Category Name</TableCell>
                                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                                    ID (dev only)
                                </TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {systemCategories
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
                                                value={d.category}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        d._id,
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                                        >
                                            {d._id}
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
                    count={systemCategories.length}
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
                        id="input-new-system-category"
                        helperText="Minimum three characters"
                        label="System Category Name"
                        variant="standard"
                        value={newSystemCategory}
                        onChange={(e) => setNewSystemCategory(e.target.value)}
                        sx={{ mr: 2, width: "100%" }}
                    />
                    <div>
                        <Button
                            variant="contained"
                            onClick={handleInsert}
                            disabled={newSystemCategory.trim().length < 3}
                        >
                            Insert
                        </Button></div>
                </div>
            </Paper>
            <ToastContainer />
        </div>
    );
}
