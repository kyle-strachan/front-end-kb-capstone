import * as React from "react";
import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function NavBarDocsMenu() {
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
                <MenuItem component={Link} to="/docs" onClick={handleClose}>
                    All Documents
                </MenuItem><MenuItem component={Link} to="/docs/new" onClick={handleClose}>
                    New Document
                </MenuItem>
                <MenuItem component={Link} to="/docs/691ce8452f0e2fe0b6a98c11" onClick={handleClose}>
                    Sample GET Document
                </MenuItem>
            </Menu>
        </div>
    );
}
