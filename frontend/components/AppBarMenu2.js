import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@emotion/react";
import { getSession, signOut } from "next-auth/react";
import logo from "../images/logoBg.png";
import { Drawer, List, ListItem } from "@mui/material";
import { DarkmodeSwitch } from "./DarkmodeSwitch";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function AppBarMenu2() {
  const { palette } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getSession().then((res) => {
      if (res?.user) setUser(res.user);
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (setting) => {
    if (setting === "Logout")
      signOut({
        callbackUrl: "/",
      });
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const styles = {
    appbar: {
      backgroundColor: palette.background.primary,
      color: palette.text.primary,
      transition: "background-color 0.5s ease",
    },
  };

  if (!user) return <p></p>;

  return (
    <AppBar style={styles.appbar} position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              id="menu-appbar"
              anchorEl={anchorElNav}
              key="left"
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: "flex",
              }}
            >
              <List sx={{ width: "200px" }}>
                {pages.map((page) => (
                  <ListItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: "flex", flexGrow: 1 }}
          >
            <img
              style={{ margin: "0 10px", width: "60px", height: "auto" }}
              src={logo.src}
              alt="logo"
            />
            Class Room
          </Typography>

          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <Box>
              <DarkmodeSwitch />
            </Box>
            <IconButton
              aria-label="add classroom"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              sx={{ mx: "10px" }}
            >
              <AddIcon sx={{ fontSize: "30px" }} />
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{ border: "1px solid darkblue" }}
                  alt="Remy Sharp"
                  src={user.image}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseNavMenu(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
