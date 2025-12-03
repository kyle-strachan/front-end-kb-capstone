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
import { MINIMUM_DEPARTMENT_LENGTH } from "../utils/constants";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [edited, setEdited] = useState([]);
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [newDepartment, setNewDepartment] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Variable to disable Save button if any of the text inputs have fewer than three characters
    const hasInvalid = departments.some(
        (d) => d.department?.trim().length < MINIMUM_DEPARTMENT_LENGTH
    );

    // Populate department list
    async function fetchDepartments() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/departments");
            if (Array.isArray(res.data.departments)) {
                setDepartments(res.data.departments);
            } else {
                setDepartments([]);
                setError(res.data.message || "No departments found.");
            }
        } catch (error) {
            setError(`Could not load departments. ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDepartments();
    }, []); // Only required on initial page load

    function handleFieldChange(id, field, value) {
        // Update the departments state
        setDepartments((prevDepartments) => {
            // Create map based on the previous values
            const updatedDepartments = prevDepartments.map((dept) => {
                if (dept._id === id) {
                    // Return revised departments
                    return {
                        ...dept, // Copy all existing fields
                        [field]: value // Overwrite only the changed field
                    };
                } else {
                    // Return the department unchanged
                    return dept;
                }
            });
            return updatedDepartments;
        });

        // Track which departments have been edited (for UI styling)
        setEdited((prevEdited) => {
            // Add the ID to the list and remove duplicates using a set
            return [...new Set([...prevEdited, id])];
        });
    }

    async function handleSave() {
        try {
            // Send only updated values
            const updates = departments.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/departments", { updates });
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

            await fetchDepartments();
        } catch (error) {
            notify(`Failed to save changes. ${error.message}`, "error");
        }
    }

    // Insert new department
    async function handleInsert() {
        try {
            if (newDepartment.trim().length < MINIMUM_DEPARTMENT_LENGTH) {
                notify(`New departments must have a minimum of ${MINIMUM_DEPARTMENT_LENGTH} characters.`, "error");
                return;
            }

            await api.post("/config/departments", {
                department: newDepartment.trim(),
            });
            notify("Department added successfully.", "success");
            setNewDepartment("");
            await fetchDepartments();
        } catch (error) {
            notify(`Failed to insert department. ${error.message}`, "error");
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
            <PageTitle title="Configure Departments" />

            {/* Insert new department */}
            <Paper sx={{ mb: 4, p: 3 }}>
                <Typography variant="h2">Add New Department</Typography>
                <TextField
                    id="input-new-department"
                    helperText="Minimum three characters"
                    label="Department Name"
                    variant="outlined"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    sx={{ width: "100%" }}
                />
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleInsert}
                        disabled={newDepartment.trim().length < MINIMUM_DEPARTMENT_LENGTH}
                    >
                        Insert
                    </Button>
                </div>
            </Paper>

            {/* Current departments table */}
            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">Departments</Typography>
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
                        aria-label="departments table"
                        sx={{ minWidth: 395, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: "100%" }}>Department Name</TableCell>
                                <TableCell sx={{ width: 120 }}>Active</TableCell>
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
                                        <TableCell sx={{ width: "100%", pl: 0 }}>
                                            <TextField
                                                error={dept.department.length < MINIMUM_DEPARTMENT_LENGTH}
                                                variant="outlined"
                                                value={dept.department}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        dept._id,
                                                        "department",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    dept.department.length < MINIMUM_DEPARTMENT_LENGTH
                                                        ? `Must be at least ${MINIMUM_DEPARTMENT_LENGTH} characters.`
                                                        : ""
                                                }
                                            />

                                        </TableCell>
                                        <TableCell sx={{ width: 120 }}>
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
        </div>
    );
}