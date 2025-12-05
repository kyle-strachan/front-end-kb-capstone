import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RuleIcon from '@mui/icons-material/Rule';
import PeopleIcon from "@mui/icons-material/People";
import CheckIcon from "@mui/icons-material/Check";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ArticleIcon from "@mui/icons-material/Article";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from '@mui/icons-material/SearchOutlined';
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import AvatarIcon from '@mui/icons-material/ManageAccountsOutlined';
import { IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavDrawerMobile() {
  const [open, setOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const NavDrawer = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <List sx={{
        '& .MuiTypography-root': {
          lineHeight: 1.1,
        },
      }}>
        <ListItem key={"Dashboard"} disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"MyAccount"} disablePadding>
          <ListItemButton component={Link} to="/account">
            <ListItemIcon>
              <AvatarIcon />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Logout"} disablePadding>
          <ListItemButton onClick={() => { logout(); }}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      {/* Documents menu */}

      <List sx={{
        '& .MuiTypography-root': {
          lineHeight: 1.1,
        },
      }}>
        <ListItem key={"DocSearch"} disablePadding>
          <ListItemButton component={Link} to="/docs/search">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={"Search Documents"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"NewDoc"} disablePadding>
          <ListItemButton component={Link} to="/docs/new" disabled={!user?.uiFlags?.enableDocs}>
            <ListItemIcon>
              <CreateIcon />
            </ListItemIcon>
            <ListItemText primary={"New Document"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"DepartmentCategories"} disablePadding>
          <ListItemButton component={Link} to="/docs-categories" disabled={!user?.uiFlags?.enableDocsCategories}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Document Categories"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"ManageDoc"} disablePadding>
          <ListItemButton component={Link} to="/docs" disabled={!user?.uiFlags?.enableDocs}>
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary={"Manage Documents"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      {/* User access menu */}
      <List sx={{
        '& .MuiTypography-root': {
          lineHeight: 1.1,
        },
      }}>
        <Typography sx={{ m: "8px 18px" }}><b>User Access</b></Typography>
        <ListItem key={"AccessOverview"} disablePadding>
          <ListItemButton component={Link} to="/access-overview" disabled={!user?.uiFlags?.enableAccessRequests}>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary={"Access Overview"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"ManageAccessRequests"} disablePadding>
          <ListItemButton component={Link} to="/access-requests" disabled={!user?.uiFlags?.enableAccessRequests}>
            <ListItemIcon>
              <RuleIcon />
            </ListItemIcon>
            <ListItemText primary={"Pending Access Requests"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"NewAccessRequest"} disablePadding>
          <ListItemButton component={Link} to="/access-request" disabled={!user?.uiFlags?.enableAccessRequests}>
            <ListItemIcon>
              <AddTaskIcon />
            </ListItemIcon>
            <ListItemText primary={"New Access Request"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Users"} disablePadding>
          <ListItemButton component={Link} to="/users" disabled={!user?.uiFlags?.enableUsers}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Users"} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List sx={{
        '& .MuiTypography-root': {
          lineHeight: 1.1,
        },
      }}>
        <Typography sx={{ m: "8px 18px" }}><b>Configuration</b></Typography>
        <ListItem key={"Departments"} disablePadding>
          <ListItemButton component={Link} to="/departments" disabled={!user?.uiFlags || !user?.uiFlags?.enableDepartments}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Departments"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Locations"} disablePadding >
          <ListItemButton component={Link} to="/locations" disabled={!user?.uiFlags || !user?.uiFlags?.enableLocations}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Locations"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"SystemCategories"} disablePadding>
          <ListItemButton component={Link} to="/system-categories" disabled={!user?.uiFlags || !user?.uiFlags?.enableSystems}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"System Categories"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"SystemApplications"} disablePadding>
          <ListItemButton component={Link} to="/system-applications" disabled={!user?.uiFlags || !user?.uiFlags?.enableSystems}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"System Applications"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );


  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      {/* <Button onClick={toggleDrawer(true)}>Open drawer</Button> */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {NavDrawer}
      </Drawer>
    </div>
  );
}
