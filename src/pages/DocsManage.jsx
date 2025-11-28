import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../App.css";
import PageTitle from "../components/PageTitle";
import { useLoading } from "../context/LoadingContext";

export default function Docs() {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const { loading, setLoading } = useLoading();
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showActive, setShowActive] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    async function fetchDocs() {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get("/docs");
            if (res.data.docs) {
                setDocs(res.data.docs);
            } else {
                setDocs([]);
                setError(res.data.message || "No documents found.");
            }
        } catch (err) {
            console.error("Failed to fetch docs:", err.message);
            setError("Could not load docs.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDocs();
    }, []);

    function handleRefresh() {
        fetchDocs();
    }

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    if (error) return <p>{error}</p>;

    // Multiple filters
    const filteredDocs = docs.filter((d) => d.isArchived !== showActive).filter((d) => {
        const term = searchTerm.toLowerCase(); return (
            d.description.toLowerCase().includes(term) ||
            d.body.toLowerCase().includes(term) ||
            d.title.toLowerCase().includes(term));
    });

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1rem" }}>
            <PageTitle title="Manage Documents" />
            <Paper sx={{ width: "100%", overflow: "hidden", padding: "20px" }}>
                <h2>Manage Documents</h2>

                <Typography variant="subtitle1" gutterBottom sx={{ mb: "2rem" }}>
                    Manage all documents that will be shown to Viewer users. Archive documents to remove from the Document Tree view and Search results.
                </Typography>
                {/* <h3>Search</h3> */}

                <div className="space-between-container">
                    <div className="filter-container">

                        <TextField
                            label="Filter"
                            variant="standard"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2, mr: 2, width: 300 }}
                        />


                        {/* Toggle to show Active / Inactive */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showActive}
                                    onChange={(e) => setShowActive(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={showActive ? "Showing Active Documents" : "Showing Archived Documents"}
                            sx={{ mb: 1 }}
                        />

                    </div>


                    <div className="cta-btn-container">
                        <Button
                            variant="contained"
                            onClick={() => navigate("/docs/new")}
                            sx={{ mb: 2 }}
                        >
                            New
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            sx={{ mb: 2 }}
                        >
                            {loading === true ? "Loading" : "Refresh"}
                        </Button>
                    </div>
                </div>

                <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table
                        stickyHeader
                        aria-label="docs-table"
                        sx={{ minWidth: 650, width: "100%" }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDocs
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((d) => (
                                    <TableRow
                                        key={d._id}
                                        hover
                                    >
                                        <TableCell>
                                            {d.title}
                                        </TableCell>
                                        <TableCell>
                                            {d.description}
                                        </TableCell>
                                        <TableCell>
                                            {d.department?.department}
                                        </TableCell>
                                        <TableCell>
                                            {d.docsCategory?.category}
                                        </TableCell>
                                        <TableCell>
                                            <div className="cta-btn-container">
                                                <Button variant="outlined" onClick={() => navigate(`/docs/view/${d._id}`)}>
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredDocs.length} // ✅ pagination uses filtered count
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
