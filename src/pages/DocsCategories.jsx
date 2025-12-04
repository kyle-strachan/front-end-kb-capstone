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
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import Alert from '@mui/material/Alert';
import { Typography } from "@mui/material";
import { MINIMUM_CATEGORY_LENGTH } from "../utils/constants";

export default function DocsCategories() {
    const [docsCategories, setDocsCategories] = useState([]);
    const [edited, setEdited] = useState([]);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [newDocsCategory, setNewDocsCategory] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [departments, setDepartments] = useState([]);
    const [newDepartmentId, setNewDepartmentId] = useState(null);

    // Variable to disable Save button if any of the text inputs have fewer than three characters
    const hasInvalid = docsCategories.some(
        (d) => d.category?.trim().length < MINIMUM_CATEGORY_LENGTH
    );

    async function fetchDocsCategories() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/docs-categories");
            if (Array.isArray(res.data.docsCategories)) {
                setDocsCategories(res.data.docsCategories);
            } else {
                setDocsCategories([]);
                setError(res.data.message || "No document categories found.");
            }
        } catch (error) {
            console.error("Failed to fetch document categories:", error.message);
            setError("Could not load document categories.");
        } finally {
            setLoading(false);
        }
    }

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
        fetchDocsCategories();
        fetchDepartments();
    }, []); // Required on initial load

    function handleFieldChange(id, field, value) {
        // Update the category state
        setDocsCategories((prev) => {
            // Create map based on the previous values
            const updatedCategories = prev.map((category) => {
                if (category._id === id) {
                    // Return revised categories
                    return {
                        ...category, // Copy all existing fields
                        [field]: value // Overwrite only the changed field
                    };
                } else {
                    // Return the categories unchanged
                    return category;
                }
            });
            return updatedCategories;
        });

        // Track which categories have been edited (for UI styling)
        setEdited((prevEdited) => {
            // Add the ID to the list and remove duplicates using a set
            return [...new Set([...prevEdited, id])];
        });
    }

    async function handleSave() {
        try {
            // Send only updated values
            const updates = docsCategories.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.patch("/config/docs-categories", { updates });
            const results = res.data.results || [];
            const failedIds = results.filter((r) => !r.success).map((r) => r.id);

            // Keep failed updates highlighted in UI, but they are returned to their previous value
            setEdited((prev) => prev.filter((id) => failedIds.includes(id)));

            if (failedIds.length > 0) {
                notify(`Some updates failed, see highlights below.`, "error");
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

    // Insert new category
    async function handleInsert() {
        try {
            if (newDocsCategory.trim().length < MINIMUM_CATEGORY_LENGTH) {
                notify(`New document categories must have a minimum of ${MINIMUM_CATEGORY_LENGTH} characters.`, "error");
                return;
            }

            await api.post("/config/docs-categories", {
                category: newDocsCategory.trim(),
                departmentId: newDepartmentId?._id,
            });

            notify("Document category added successfully.", "success");
            setNewDocsCategory("");
            await fetchDocsCategories();
        } catch {
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

    if (error) return (
        <div className="page-content"><Alert severity="error">{error}</Alert></div>);

    return (
        <div className="page-content">
            <PageTitle title="Configure Document Categories" />

            <Paper sx={{ mb: 4, p: 3 }}>
                <Typography variant="h2">Add New Document Category</Typography>
                <div className="btn-inline-container">
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
                    <TextField
                        id="input-new-doc-category"
                        helperText="Minimum three characters"
                        label="Category Name"
                        variant="outlined"
                        value={newDocsCategory}
                        onChange={(e) => setNewDocsCategory(e.target.value)}
                        sx={{ ml: 2, width: "100%" }}
                    />
                </div>
                <div className="cta-btn-container"><Button
                    variant="contained"
                    onClick={handleInsert}
                    disabled={(newDocsCategory.trim().length) < 3 || (newDepartmentId === null)}
                >
                    Insert
                </Button></div>
            </Paper>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">Document Categories</Typography>

                <div className="cta-btn-container">

                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={edited.length === 0 || hasInvalid}
                        sx={{ mb: 2 }}
                    >
                        Save
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
                        aria-label="departments table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "40%", pl: 0 }}>Department</TableCell>
                                <TableCell sx={{ width: "60%" }}>Category Name</TableCell>
                                <TableCell sx={{ width: 120 }}>Active</TableCell>
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
                                        <TableCell sx={{ width: "40%", pl: 0 }}>
                                            {d.departmentId?.department}
                                        </TableCell>
                                        <TableCell sx={{ width: "60%" }}>
                                            <TextField
                                                error={d.category?.length < MINIMUM_CATEGORY_LENGTH}
                                                variant="outlined"
                                                value={d.category}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        d._id,
                                                        "category",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    d.category?.length < MINIMUM_CATEGORY_LENGTH
                                                        ? `Must be at least ${MINIMUM_CATEGORY_LENGTH} characters.`
                                                        : ""
                                                }
                                            />
                                        </TableCell>

                                        <TableCell sx={{ width: 120 }}>
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
        </div>
    );
}
