import * as React from "react";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBarConfigMenu() {
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
                id="config-button"
                aria-controls={open ? "config-menu" : undefined}
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
                <MenuItem component={Link} to="/departments" onClick={handleClose} disabled={!user?.uiFlags || !user?.uiFlags?.enableDepartments}>
                    Departments
                </MenuItem>
                <MenuItem component={Link} to="/locations" onClick={handleClose} disabled={!user?.uiFlags || !user?.uiFlags?.enableLocations}>
                    Locations
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/system-categories" onClick={handleClose} disabled={!user?.uiFlags || !user?.uiFlags?.enableSystems}>
                    System Categories
                </MenuItem>
                <MenuItem component={Link} to="/system-applications" onClick={handleClose} disabled={!user?.uiFlags || !user?.uiFlags?.enableSystems}>
                    System Applications
                </MenuItem>
            </Menu>
        </div>
    );
}
