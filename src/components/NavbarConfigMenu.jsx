import * as React from "react";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function NavBarConfigMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="config-button"
                aria-controls={open ? "config-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    textTransform: "none",       // match Typography
                    color: "rgba(255, 255, 255, 1)",             // use parent text colour
                    fontSize: "inherit",          // match surrounding text size
                    fontWeight: 500,        // optional, for consistency
                    padding: "0 15px",            // match your Typography padding
                    minWidth: "auto",             // remove MUI button min-width
                }}
            >
                Configuration
            </Button>

            <Menu
                id="config-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: { "aria-labelledby": "config-button" },
                }}
            >
                <MenuItem component={Link} to="/departments" onClick={handleClose}>
                    Departments
                </MenuItem>
                <MenuItem component={Link} to="/locations" onClick={handleClose}>
                    Locations
                </MenuItem>
                <MenuItem component={Link} to="/platform-roles" onClick={handleClose} disabled>
                    Platform Roles
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/docs-categories" onClick={handleClose} >
                    Document Categories
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/system-categories" onClick={handleClose}>
                    System Categories
                </MenuItem>
                <MenuItem component={Link} to="/system-applications" onClick={handleClose}>
                    System Applications
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/permissions" onClick={handleClose}>
                    Permissions (Dev)
                </MenuItem>

            </Menu>
        </div>
    );
}
