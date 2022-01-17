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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useAlert } from "../lib/AlertContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Divider from "@mui/material/Divider";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const studentInviteCodes = ["k40cv9Q2c", "cTDcNY_2_", "z7gZLTOw5"];
const teacherInviteCodes = ["0pZicXNZii", "Scf3f6wnuw", "	W2uO--D-D0"];

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

function CopyButton({ text }) {
  const { openAlert } = useAlert();
  const handleCopy = () => {
    openAlert({ mode: "success", title: "Copied!" });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <p>{text}</p>
      <CopyToClipboard onCopy={handleCopy} text={text}>
        <IconButton>
          <ContentCopyIcon sx={{ ml: "10px", fontSize: "20px" }} />
        </IconButton>
      </CopyToClipboard>
    </Box>
  );
}

export default function AppBarMenu2({ setMode }) {
  const { palette } = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElClass, setAnchorElClass] = React.useState(null);
  const [anchorElInfo, setAnchorElInfo] = React.useState(null);
  const [user, setUser] = React.useState("loading");

  React.useEffect(() => {
    getSession().then((res) => {
      if (res?.user) setUser(res.user);
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    event.stopPropagation();
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    event.stopPropagation();
    setAnchorElUser(event.currentTarget);
  };
  const handleClassroomMenu = (event) => {
    event.stopPropagation();
    setAnchorElClass(event.currentTarget);
  };
  const handleOpenInfo = (event) => {
    event.stopPropagation();
    setAnchorElInfo(event.currentTarget);
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

  const handleCloseInfo = () => {
    setAnchorElInfo(null);
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
              sx={{ mr: 0, display: "flex", flexGrow: 1 }}
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

              <Tooltip title="Here are few class codes that might help">
                <IconButton sx={{ p: { xs: "5px" } }} onClick={handleOpenInfo}>
                  <InfoOutlinedIcon color="action" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElInfo}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElInfo)}
                onClose={handleCloseInfo}
              >
                <Box sx={{ mx: "20px" }}>
                  <p>Student Invite Codes</p>
                  {studentInviteCodes.map((code) => (
                    <CopyButton key={code} text={code} />
                  ))}
                  <Divider />
                  <p>Teacher Invite Codes</p>
                  {teacherInviteCodes.map((code) => (
                    <CopyButton key={code} text={code} />
                  ))}
                </Box>
              </Menu>
              <Tooltip title="Create or Join a class">
                <IconButton
                  sx={{ p: { xs: "5px" } }}
                  onClick={handleClassroomMenu}
                >
                  <AddIcon color="action" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
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
                <JoinModal
                  userId={user.id}
                  handleMenuClose={handleCloseClassroomMenu}
                />
                <CreateModal
                  userId={user.id}
                  handleMenuClose={handleCloseClassroomMenu}
                />
              </Menu>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
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
