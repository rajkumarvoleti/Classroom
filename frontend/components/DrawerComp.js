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
import GridViewIcon from "@mui/icons-material/GridView";
import { useQuery } from "@apollo/client";
import CircularProgressComp from "../components/CircularProgressComp";
import {
  GET_STUDENT_CLASSNAMES,
  GET_TEACHER_CLASSNAMES,
} from "../graphql/Class";
import { useRouter } from "next/router";

const ListItemComp = ({ _class }) => {
  const router = useRouter();

  const go = (e) => {
    e.preventDefault();
    router.push(`/classroom/${_class.id}`);
  };

  return (
    <ListItem>
      <ListItemButton onClick={go}>
        <ListItemText primary={_class.name} />
      </ListItemButton>
    </ListItem>
  );
};

export default function DrawerComp({
  anchorElNav,
  handleCloseNavMenu,
  userId,
}) {
  const {
    data: studentData,
    loading: studentLoading,
    error: studentError,
  } = useQuery(GET_STUDENT_CLASSNAMES, {
    variables: { id: userId },
  });

  const router = useRouter();

  const {
    data: teacherData,
    loading: teacherLoading,
    error: teacherError,
  } = useQuery(GET_TEACHER_CLASSNAMES, {
    variables: { id: userId },
  });

  if (studentError || teacherError) {
    console.log({ studentError, teacherError });
    return <p>Something went wrong</p>;
  }

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
      open={userId && Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ width: "300px", bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem>
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
              >
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/dashboard");
                }}
              >
                <ListItemIcon>
                  <GridViewIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
        <Divider />

        <nav>
          {teacherLoading && (
            <CircularProgressComp width="300px" height="200px" />
          )}
          {!teacherLoading && (
            <List>
              <ListSubheader>Teaching</ListSubheader>
              {!teacherData.allClasses[0] && (
                <ListItem>No classes to show</ListItem>
              )}
              {teacherData.allClasses.map((_class) => (
                <ListItemComp key={_class.id} _class={_class} />
              ))}
            </List>
          )}
        </nav>
        <Divider />

        <nav>
          {studentLoading && (
            <CircularProgressComp width="300px" height="200px" />
          )}
          {!studentLoading && (
            <List>
              <ListSubheader>Enrolled</ListSubheader>
              {!studentData.allClasses[0] && (
                <ListItem>No classes to show</ListItem>
              )}
              {studentData.allClasses.map((_class) => (
                <ListItemComp key={_class.id} _class={_class} />
              ))}
            </List>
          )}
        </nav>
        <Divider />
      </Box>
    </Drawer>
  );
}
