import * as React from "react";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBarDocsMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { user } = useAuth();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="docs-button"
                aria-controls={open ? "docs-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    textTransform: "none",
                    color: "rgba(255, 255, 255, 1)",
                    fontSize: "inherit",
                    fontWeight: 500,
                    padding: "0 15px",
                    minWidth: "auto",
                }}
            >
                Docs
            </Button>

            <Menu
                id="docs-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: { "aria-labelledby": "docs-button" },
                }}
            >
                <MenuItem component={Link} to="/docs/search" onClick={handleClose}>
                    Search Docs
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/docs/new" onClick={handleClose} disabled={!user?.uiFlags?.enableDocs}>
                    New Document
                </MenuItem>
                <MenuItem component={Link} to="/docs-categories" onClick={handleClose} disabled={!user?.uiFlags?.enableDocsCategories}>
                    Document Categories
                </MenuItem>
                <MenuItem component={Link} to="/docs" onClick={handleClose} disabled={!user?.uiFlags?.enableDocs}>
                    Manage Documents
                </MenuItem>
            </Menu>
        </div>
    );
}
