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
  CardActionArea,
  CardActions,
  Divider,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Box } from "@mui/system";
import { useQuery } from "@apollo/client";
import { GET_CLASS_CARD_DATA } from "../graphql/ClassQueries";

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

const options = ["Enroll", "Leave"];

export default function ClassCard({ id }) {
  const { data, error, loading } = useQuery(GET_CLASS_CARD_DATA, {
    variables: { id },
  });

  const [anchorElMore, setAnchorElMore] = useState(null);

  const handleOpenMore = (event) => {
    event.stopPropagation();
    setAnchorElMore(event.currentTarget);
  };
  const handleCloseMore = () => setAnchorElMore(null);

  const changePage = () => {
    console.log("You clicked me");
  };

  if (loading) return <p>loading</p>;
  if (error) {
    console.log(error);
    return <p>Something went wrong</p>;
  }
  const { Class } = data;

  return (
    <Card sx={styles.card} className="elevate">
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
            {options.map((option) => (
              <MenuItem key={option} onClick={handleCloseMore}>
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
  );
}
