import {
  Drawer,
  List,
  ListItem,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function DrawerComp({ anchorElNav, handleCloseNavMenu }) {
  return (
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
      <Box sx={{ width: "300px", bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem>
              <ListItemButton component="a" href="/dashboard">
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />

        <nav aria-label="secondary mailbox folders">
          <List>
            <ListSubheader>Teaching</ListSubheader>
            <ListItem>
              <ListItemButton>
                <ListItemText primary="Trash" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href="#simple-list">
                <ListItemText primary="Spam" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />

        <nav aria-label="secondary mailbox folders">
          <List>
            <ListSubheader>Enrolled</ListSubheader>
            <ListItem>
              <ListItemButton>
                <ListItemText primary="Trash" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton component="a" href="#simple-list">
                <ListItemText primary="Spam" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />
      </Box>
    </Drawer>
  );
}
