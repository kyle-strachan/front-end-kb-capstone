import * as React from "react";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function NavBarUacMenu() {
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
                User Access
            </Button>

            <Menu
                id="uac-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: { "aria-labelledby": "config-button" },
                }}
            >
                <MenuItem component={Link} to="/access-overview" onClick={handleClose}>
                    Access Overview
                </MenuItem>
                <MenuItem component={Link} to="/access-requests" onClick={handleClose}>
                    Manage Access Requests
                </MenuItem>

                <MenuItem component={Link} to="/access-request" onClick={handleClose}>
                    New Access Request
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/users" onClick={handleClose}>
                    Users
                </MenuItem>
            </Menu>
        </div>
    );
}
