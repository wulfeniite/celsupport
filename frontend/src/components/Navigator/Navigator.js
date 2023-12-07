import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navigator(props) {
  const { user, currentlyactive, setcurrentlyactive, ...other } = props;

  var categories = [];

  const handleActive = (id) => {
    if (id === currentlyactive) return true;
  };

  const switchActive = (id) => {
    if (id === currentlyactive) return;
    if (id === "Logout") {
      localStorage.removeItem("token");
      window.location.reload();
    }
    setcurrentlyactive(id);
  };

  if (user.isAdmin) {
    categories = [
      {
        id: "Admin Panel",
        children: [
          {
            id: "Issues",
            icon: <LabelImportantIcon />,
          },
          { id: "Users", icon: <PeopleIcon /> },
          { id: "Profile", icon: <AdminPanelSettingsIcon /> },
          { id: "Logout", icon: <LogoutIcon /> },
        ],
      },
    ];
  } else {
    categories = [
      {
        id: "Employee Support Panel",
        children: [
          {
            id: "Issues",
            icon: <LabelImportantIcon />,
          },
          { id: "Profile", icon: <AccountCircleIcon /> },
          { id: "Logout", icon: <LogoutIcon /> },
        ],
      },
    ];
  }

  const item = {
    py: "2px",
    px: 3,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover, &:focus": {
      bgcolor: "rgba(255, 255, 255, 0.08)",
    },
  };

  const itemCategory = {
    boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
    py: 1.5,
    px: 3,
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          CEL SUPPORT
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <ListItem
                disablePadding
                key={childId}
                onClick={() => switchActive(childId)}
              >
                <ListItemButton selected={handleActive(childId)} sx={item}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
