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
import { MINIMUM_LOCATION_LENGTH } from "../utils/constants";

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [edited, setEdited] = useState([]);
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [newLocation, setNewLocation] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Variable to disable Save button if any of the text inputs have fewer than three characters
    const hasInvalid = locations.some(
        (d) => d.location?.trim().length < MINIMUM_LOCATION_LENGTH
    );

    // Populate locations list
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
        } catch {
            setError("Could not load locations.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, []); // Only required on initial page load

    function handleFieldChange(id, field, value) {
        // Update the locations state
        setLocations((prevLocations) => {
            // Create map based on the previous values
            const updatedLocations = prevLocations.map((loc) => {
                if (loc._id === id) {
                    // Return revised locations
                    return {
                        ...loc, // Copy all existing fields
                        [field]: value // Overwrite only the changed field
                    };
                } else {
                    // Return the location unchanged
                    return loc;
                }
            });
            return updatedLocations;
        });

        // Track which locations have been edited (for UI styling)
        setEdited((prevEdited) => {
            // Add the ID to the list and remove duplicates using a set
            return [...new Set([...prevEdited, id])];
        });
    }

    async function handleSave() {
        try {
            // Send only updated values
            const updates = locations.filter((d) => edited.includes(d._id));
            if (updates.length === 0) {
                notify("No changes to save.", "error");
                return;
            }

            const res = await api.put("/config/locations", { updates });
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

            await fetchLocations();
        } catch {
            notify("Failed to save changes.", "error");
        }
    }

    // Insert new location
    async function handleInsert() {
        try {
            if (newLocation.trim().length < MINIMUM_LOCATION_LENGTH) {
                notify(`New locations must have a minimum of ${MINIMUM_LOCATION_LENGTH} characters.`, "error");
                return;
            }

            await api.post("/config/locations", {
                location: newLocation.trim(),
            });
            notify("Location added successfully.", "success");
            setNewLocation("");
            await fetchLocations();
        } catch {
            // console.error("Insert failed:", error.message);
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

            {/* Insert new location */}
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
                        disabled={newLocation.trim().length < MINIMUM_LOCATION_LENGTH}
                    >
                        Insert
                    </Button>
                </div>
            </Paper>

            {/* Current locations table */}
            <Paper sx={{ width: "100%", overflow: "hidden", padding: 3 }}>
                <Typography variant="h2">Locations</Typography>
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
                        aria-label="locations table"
                        sx={{ minWidth: 395, width: "100%" }}
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
                                .map((loc) => (
                                    <TableRow
                                        key={loc._id}
                                        hover
                                        sx={{
                                            backgroundColor: edited.includes(loc._id)
                                                ? "#fffbe6"
                                                : "inherit",
                                        }}
                                    >
                                        <TableCell sx={{ width: "100%", pl: 0 }}>
                                            <TextField
                                                error={loc.location.length < MINIMUM_LOCATION_LENGTH}
                                                variant="outlined"
                                                value={loc.location}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        loc._id,
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                                helperText={
                                                    loc.location.length < MINIMUM_LOCATION_LENGTH
                                                        ? `Must be at least ${MINIMUM_LOCATION_LENGTH} characters.`
                                                        : ""
                                                }
                                            />
                                        </TableCell>
                                        <TableCell sx={{ width: 120 }}>
                                            <Checkbox
                                                checked={loc.isActive}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        loc._id,
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
