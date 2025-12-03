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
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";
import notify from "../utils/toastify";
import { Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import { MINIMUM_SYSTEM_CATEGORY_LENGTH } from "../utils/constants";

export default function SystemCategories() {
    const [systemCategories, setSystemCategories] = useState([]);
    const [edited, setEdited] = useState([]);
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [newSystemCategory, setNewSystemCategory] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Variable to disable Save button if any of the text inputs have fewer than three characters
    const hasInvalid = systemCategories.some(
        (d) => d.category?.trim().length < MINIMUM_SYSTEM_CATEGORY_LENGTH
    );

    // Populate categories list
    async function fetchSystemCategories() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/system-categories");
            if (Array.isArray(res.data.systemCategories)) {
                setSystemCategories(res.data.systemCategories);
            } else {
                setSystemCategories([]);
                setError(res.data.message || "No system categories found.");
            }
        } catch (error) {
            setError(`Could not load system categories. ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSystemCategories();
    }, []); // Only required on initial page load

    function handleFieldChange(id, field, value) {
        // Update the category state
        setSystemCategories((prevCategories) => {
            // Create map based on the previous values
            const updatedCategories = prevCategories.map((cats) => {
                if (cats._id === id) {
                    // Return revised categories
                    return {
                        ...cats, // Copy all existing fields
                        [field]: value // Overwrite only the changed field
                    };
                } else {
                    // Return the categories unchanged
                    return cats;
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
            const updates = systemCategories.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/system-categories", { updates });
            const results = res.data.results || [];
            const failedIds = results.filter((result) => !result.success).map((result) => result.id);

            // Keep failed updates highlighted in UI, but they are returned to their previous value
            setEdited((prev) => prev.filter((id) => failedIds.includes(id)));

            if (failedIds.length > 0) {
                notify(`Some updates failed, see highlights below.`, "error");
            } else {
                notify("All changes saved successfully.", "success");
                setEdited([]);
            }

            await fetchSystemCategories();
        } catch (error) {
            notify(`Failed to save changes. ${error.message}`, "error");
        }
    }

    // Insert new category
    async function handleInsert() {
        try {
            if (newSystemCategory.trim().length < MINIMUM_SYSTEM_CATEGORY_LENGTH) {
                notify(`New system categories must have a minimum of ${MINIMUM_SYSTEM_CATEGORY_LENGTH} characters.`, "error");
                return;
            }

            await api.post("/config/system-categories", {
                category: newSystemCategory.trim(),
            });
            notify("System category added successfully.", "success");
            setNewSystemCategory("");
            await fetchSystemCategories();
        } catch (error) {
            notify(`Failed to insert system category. ${error.message}`, "error");
        }
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
            <PageTitle title="System Categories" />

            {/* Insert new category */}
            <Paper sx={{ mb: 4, p: 3 }}>
                <Typography variant="h2">Add New System Category</Typography>
                <div className="btn-inline-container">
                    <TextField
                        id="input-new-system-category"
                        helperText="Minimum three characters"
                        label="System Category Name"
                        variant="outlined"
                        value={newSystemCategory}
                        onChange={(e) => setNewSystemCategory(e.target.value)}
                        sx={{ width: "100%" }}
                    />
                </div>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleInsert}
                        disabled={newSystemCategory.trim().length < MINIMUM_SYSTEM_CATEGORY_LENGTH}
                    >
                        Insert
                    </Button>
                </div>
            </Paper>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">System Categories</Typography>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={edited.length === 0 || hasInvalid}
                        sx={{ mb: 2 }}
                    >
                        Save
                    </Button>
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        size="small"
                        aria-label="system categories table"
                        sx={{ minWidth: 395, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "100%", pl: 0 }}>System Category Name</TableCell>
                                <TableCell sx={{ width: 120 }}>Active</TableCell>
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
                                        <TableCell sx={{ width: "100%", pl: 0 }}>
                                            <TextField
                                                error={d.category.length < MINIMUM_SYSTEM_CATEGORY_LENGTH}
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
                                                    d.category.length < MINIMUM_SYSTEM_CATEGORY_LENGTH
                                                        ? `Must be at least ${MINIMUM_SYSTEM_CATEGORY_LENGTH} characters.`
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
                    count={systemCategories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
