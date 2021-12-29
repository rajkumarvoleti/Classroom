import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MovingIcon from "@mui/icons-material/Moving";

import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Avatar,
  Button,
  CardActionArea,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Box } from "@mui/system";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLASS_CARD_DATA, UNENROLL_CLASS } from "../graphql/ClassQueries";
import { useSession } from "next-auth/react";
import { useEmitter } from "react-custom-events-hooks";

const styles = {
  card: {
    position: "relative",
    width: "280px",
    ".content": {
      height: "180px",
    },
  },
  avatar: {
    position: "absolute",
    width: "50px",
    height: "auto",
    right: "20px",
    top: "115px",
  },
  more: {
    position: "absolute",
    right: "30px",
    top: "20px",
  },
  action: {
    display: "flex",
    justifyContent: "flex-end",
    mx: "20px",
  },
};

const options = ["Unenroll"];

function Confirm({ open, setOpen, handleUnenroll }) {
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ mt: "10px" }}>
        Unenroll from the class?
      </DialogContent>

      <DialogActions className="centerR" sx={{ mb: "15px" }}>
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          color="error"
          onClick={handleUnenroll}
        >
          Unenroll
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ClassCard({ id }) {
  const { data, error, loading } = useQuery(GET_CLASS_CARD_DATA, {
    variables: { id },
  });
  const [
    unEnroll,
    { data: unEnrollData, error: unEnrollError, loading: unEnrollLoading },
  ] = useMutation(UNENROLL_CLASS);
  const { data: session, status } = useSession();

  const [anchorElMore, setAnchorElMore] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const refetchClasses = useEmitter("refetchClasses");

  const handleOpenMore = (event) => {
    event.stopPropagation();
    setAnchorElMore(event.currentTarget);
  };

  const handleUnenroll = async () => {
    await unEnroll({
      variables: {
        classId: id,
        userId: session.user.id,
      },
    });
    refetchClasses();
    setOpen(false);
    setAnchorElMore(null);
    setHidden(true);
  };

  const handleCloseMore = async (option) => {
    console.log(option);
    if (option === "Unenroll") setOpen(true);
    else setAnchorElMore(null);
  };

  const changePage = () => {
    console.log("You clicked me");
  };

  if (loading || unEnrollLoading || status === "loading") {
    return (
      <Box sx={styles.card}>
        <LinearProgress />
      </Box>
    );
  }

  if (error || unEnrollError) {
    console.log(error, unEnrollError);
    return <p>Something went wrong</p>;
  }
  const { Class } = data;

  return (
    <Fade in={!loading} timeout={{ enter: 500, exit: 500 }}>
      <Card hidden={hidden} sx={styles.card} className="elevate">
        <CardActionArea onClick={changePage}>
          <CardMedia
            component="img"
            height="140"
            image="https://picsum.photos/200/300"
            alt="green iguana"
          />
        </CardActionArea>
        <CardContent className="content">
          <Avatar
            sx={styles.avatar}
            alt="Remy Sharp"
            // src="https://picsum.photos/200"
            src={Class.author?.image}
          />

          <Box>
            <IconButton onClick={handleOpenMore} sx={styles.more}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorElMore}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElMore)}
              onClose={handleCloseMore}
            >
              <Confirm
                open={open}
                setOpen={setOpen}
                handleUnenroll={handleUnenroll}
              />
              {options.map((option) => (
                <MenuItem key={option} onClick={() => handleCloseMore(option)}>
                  <Typography textAlign="center">{option}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box>
            <Typography gutterBottom variant="h5" component="div">
              {Class.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Class.subject}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Class.section}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Class.author.name}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={styles.action}>
          <IconButton>
            <MovingIcon />
          </IconButton>
          <IconButton>
            <AssignmentIndOutlinedIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Fade>
  );
}
