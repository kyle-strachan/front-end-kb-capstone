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
                    color: "rgb(100,108,255)",             // use parent text colour
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
                <MenuItem component={Link} to="/platform-roles" onClick={handleClose}>
                    Platform Roles
                </MenuItem>
                <MenuItem component={Link} to="/department-categories" onClick={handleClose}>
                    Department Categories
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/system-categories" onClick={handleClose}>
                    System Categories
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/users" onClick={handleClose}>
                    Users
                </MenuItem>
            </Menu>
        </div>
    );
}
