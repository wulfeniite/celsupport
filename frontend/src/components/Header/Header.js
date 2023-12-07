import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function Header(props) {
  const { onDrawerToggle, currentlyactive, currenttab, setcurrenttab } = props;

  const handleTabValue = () => {
    if (currenttab === "All") {
      return 0;
    } else if (currenttab === "Pending") {
      return 1;
    } else if (currenttab === "Open") {
      return 2;
    } else if (currenttab === "Resolved") {
      return 3;
    }
  };

  const handleTabChange = (tab) => {
    if (currenttab === tab) return;
    setcurrenttab(tab);
  };

  return (
    <React.Fragment>
      <AppBar
        color="primary"
        position="sticky"
        sx={{ display: { sm: "none", xs: "block" } }}
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {currentlyactive}
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {currentlyactive === "Issues" && (
        <AppBar
          component="div"
          position="static"
          elevation={0}
          sx={{ zIndex: 0 }}
        >
          <Tabs value={handleTabValue()} textColor="inherit">
            <Tab label="All" onClick={() => handleTabChange("All")} />
            <Tab label="Pending" onClick={() => handleTabChange("Pending")} />
            <Tab label="Open" onClick={() => handleTabChange("Open")} />
            <Tab label="Resolved" onClick={() => handleTabChange("Resolved")} />
          </Tabs>
        </AppBar>
      )}
    </React.Fragment>
  );
}

Header.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
