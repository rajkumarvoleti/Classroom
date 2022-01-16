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
import { CircularProgress, useScrollTrigger } from "@mui/material";
import { DarkmodeSwitch } from "./DarkmodeSwitch";
import DrawerComp from "./DrawerComp";
import JoinModal from "./JoinModal";
import CreateModal from "./CreateModal";
import CircularProgressComp from "./CircularProgressComp";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function AppBarMenu2({ setMode }) {
  const { palette } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElClass, setAnchorElClass] = React.useState(null);
  const [user, setUser] = React.useState("loading");

  React.useEffect(() => {
    getSession().then((res) => {
      if (res?.user) setUser(res.user);
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };
  const handleClassroomMenu = (event) => {
    setAnchorElClass(event.currentTarget);
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

  const handleCloseClassroomMenu = () => {
    setAnchorElClass(null);
  };

  const handleTheme = (val) => {
    const checked = val.target.checked;
    if (checked) setMode("dark");
    else setMode("light");
  };

  const styles = {
    appbar: {
      backgroundColor: palette.background.primary,
      color: palette.text.primary,
      borderBottom: `1px solid ${palette.background.secondary}`,
      transition: "background-color 0.5s ease",
    },
  };

  if (!user) return <p>Please login</p>;

  return (
    <ElevationScroll>
      <AppBar style={styles.appbar} position="sticky">
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
              {user?.id && (
                <DrawerComp
                  anchorElNav={anchorElNav}
                  handleCloseNavMenu={handleCloseNavMenu}
                  userId={user.id}
                />
              )}
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
              {/* <Box>
                <DarkmodeSwitch onChange={handleTheme} />
              </Box> */}

              <Tooltip title="Create or Join a class">
                <IconButton
                  aria-label="add classroom"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  sx={{ mx: "10px" }}
                  onClick={handleClassroomMenu}
                >
                  <AddIcon sx={{ fontSize: "30px" }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElClass}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElClass)}
                onClose={handleCloseClassroomMenu}
              >
                <JoinModal handleMenuClose={handleCloseClassroomMenu} />
                <CreateModal handleMenuClose={handleCloseClassroomMenu} />
              </Menu>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {user === "loading" && <CircularProgress />}
                  {user !== "loading" && (
                    <Avatar
                      sx={{ border: "1px solid darkblue" }}
                      alt="Remy Sharp"
                      src={user.image}
                    />
                  )}
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
    </ElevationScroll>
  );
}
