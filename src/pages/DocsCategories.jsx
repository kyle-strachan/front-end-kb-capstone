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
import SelectWithSearch from "../components/SelectWithSearch";
import "../App.css";
import { ToastContainer, toast } from 'react-toastify';

export default function DocsCategories() {
    const [docsCategories, setDocsCategories] = useState([]);
    const [edited, setEdited] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDocsCategory, setNewDocsCategory] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [departments, setDepartments] = useState([]);
    const [newDepartmentId, setNewDepartmentId] = useState(null);


    function notify(message, type = "Info") {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    async function fetchDocsCategories() {
        try {
            const res = await api.get("/config/docs-categories");
            if (Array.isArray(res.data.docsCategories)) {
                setDocsCategories(res.data.docsCategories);
            } else {
                setDocsCategories([]);
                setError(res.data.message || "No document categories found.");
            }
            // console.log(res.data.docsCategories);
        } catch (error) {
            console.error("Failed to fetch document categories:", error.message);
            setError("Could not load document categories.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDocsCategories();
    }, []);

    async function fetchDepartments() {
        try {
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) {
                setDepartments(res.data.departments);
            } else {
                setDepartments([]);
                setError(res.data.message || "No departments found.");
            }
            console.log(`Departments`, res.data.departments);
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
        setDocsCategories((prev) =>
            prev.map((dept) => (dept._id === id ? { ...dept, [field]: value } : dept))
        );
        setEdited((prev) => [...new Set([...prev, id])]);
    }

    async function handleSave() {
        try {
            const updates = docsCategories.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.patch("/config/docs-categories", { updates });
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

            await fetchDocsCategories();
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    async function handleInsert() {
        try {
            if (newDocsCategory.trim().length < 3) {
                notify("New document categories must have a minimum of 3 characters.", "error");
                return;
            }

            await api.post("/config/docs-categories", {
                category: newDocsCategory.trim(),
                departmentId: [newDepartmentId?._id],
            });

            notify("Document category added successfully.", "success");
            setNewDocsCategory("");
            await fetchDocsCategories();
        } catch (error) {
            console.error("Insert failed:", error.message);
            notify("Failed to insert document category.", "error");
        }
    }

    function handleRefresh() {
        fetchDocsCategories();
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (loading) return <p>Loading document categories...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <h2>Document Categories</h2>

            <Paper sx={{ mb: 4, p: 2 }}>
                <h4>Add New</h4>
                <div className="btn-inline-container">
                    <TextField
                        id="input-new-doc-category"
                        helperText="Minimum three characters"
                        label="Category Name"
                        variant="standard"
                        value={newDocsCategory}
                        onChange={(e) => setNewDocsCategory(e.target.value)}
                        sx={{ mr: 2, width: "100%" }}
                    />
                    <SelectWithSearch
                        options={departments}
                        label="Department"
                        labelField="department"
                        value={newDepartmentId}
                        onChange={(e, newValue) =>
                            setNewDepartmentId(newValue)
                        }
                        required
                    />


                    <div>
                        <Button
                            variant="contained"
                            onClick={handleInsert}
                            disabled={(newDocsCategory.trim().length) < 3 || (newDepartmentId === null)}
                        >
                            Insert
                        </Button></div>
                </div>
            </Paper>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h3>Document Categories</h3>





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
                                <TableCell>Department</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {docsCategories
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
                                        <TableCell
                                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                                        >
                                            {d.departmentId.department}
                                        </TableCell>
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
                    count={docsCategories.length}
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
