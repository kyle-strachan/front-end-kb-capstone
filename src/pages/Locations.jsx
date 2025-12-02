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

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [edited, setEdited] = useState([]);
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [newLocation, setNewLocation] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    async function fetchLocations() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/config/locations");
            if (Array.isArray(res.data.locations)) {
                setLocations(res.data.locations);
            } else {
                setLocations([]);
                setError(res.data.message || "No locations found.");
            }
        } catch (err) {
            console.error("Failed to fetch locations:", err.message);
            setError("Could not load locations.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, []);

    function handleFieldChange(id, field, value) {
        setLocations((prev) =>
            prev.map((dept) => (dept._id === id ? { ...dept, [field]: value } : dept))
        );
        setEdited((prev) => [...new Set([...prev, id])]);
    }

    async function handleSave() {
        try {
            const updates = locations.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/locations", { updates });
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
            await fetchLocations();
        } catch (error) {
            console.error("Save failed:", error.message);
            notify("Failed to save changes.", "error");
        }
    }

    async function handleInsert() {
        try {
            if (newLocation.trim().length < 3) {
                notify("New locations must have a minimum of 3 characters.", "error");
                return;
            }

            await api.post("/config/locations", {
                location: newLocation.trim(),
            });
            notify("Location added successfully.", "success");
            setNewLocation("");
            await fetchLocations();
        } catch (error) {
            console.error("Insert failed:", error.message);
            notify("Failed to insert location.", "error");
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
            <PageTitle title="Configure Locations" />
            <Paper sx={{ mb: 4, p: 3 }}>
                <Typography variant="h2">Add New Location</Typography>
                <div className="btn-inline-container">
                    <TextField
                        id="input-new-location"
                        helperText="Minimum three characters"
                        label="Location Name"
                        variant="outlined"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        sx={{ width: "100%" }}
                    />
                </div>
                <div className="cta-btn-container">
                    <Button
                        variant="contained"
                        onClick={handleInsert}
                        disabled={newLocation.trim().length < 3}
                    >
                        Insert
                    </Button>
                </div>
            </Paper>

            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">Locations</Typography>

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
                        size="small"
                        aria-label="locations table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Location Name</TableCell>
                                <TableCell sx={{ width: 120 }}>Active</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations
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
                                                variant="outlined"
                                                value={dept.location}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        dept._id,
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
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
                    count={locations.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
