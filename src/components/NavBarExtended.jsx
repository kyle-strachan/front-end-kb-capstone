import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./NavBarExtended.css";
import NavBarConfigMenu from "../components/NavBarConfigMenu";
import NavBarUacMenu from './NavBarUacMenu';
import NavBarDocsMenu from './NavBarDocsMenu';
import NavDrawerMobile from './NavDrawerMobile';

export default function AccountMenu() {
    const { user, logout } = useAuth();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <Paper
            sx={{
                backgroundColor: 'rgba(58, 58, 58, 1)',
                m: 2,
                width: 'calc(100% - 32px)', // subtract both 16px margins
                boxSizing: 'border-box',
                color: "white",
            }}
        >
            <Box sx={{ height: "50px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', padding: '5px 10px' }}>
                <div style={{ display: "flex" }}>
                    <img style={{ padding: "5px 10px", width: "40px" }} src="/logo-white-sq.svg" />
                    <div className="nav-bar-lobby-lock nav-bar-links">
                        <Typography sx={{ padding: '0 15px' }}><Link to="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Lobby Lock</Link></Typography>
                    </div>
                    <div className="nav-bar-links">
                        <Typography sx={{ padding: '0 15px' }}><Link to="/dashboard" style={{ color: "inherit", textDecoration: "none" }}>Dashboard</Link></Typography>
                        <NavBarDocsMenu />
                        <NavBarUacMenu />
                        <NavBarConfigMenu />
                    </div>
                </div>
                <div>
                    <div className="nav-bar-account-menu">
                        <Typography sx={{ minWidth: 100 }}>{user?.fullName || user?.username}</Typography>
                        <Tooltip title="Account Settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="nav-bar-mobile-menu">
                        <NavDrawerMobile />
                    </div>
                </div>
            </Box>


            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem component={Link} to="/account" onClick={handleClose}>
                    <Avatar /> My Account
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleClose();
                    logout();
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

        </Paper>
    );
}