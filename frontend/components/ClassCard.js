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
  Divider,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Box } from "@mui/system";

const styles = {
  card: {
    position: "relative",
    width: "280px",
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

export default function ClassCard() {
  const [anchorElMore, setAnchorElMore] = useState(null);

  const handleOpenMore = (event) => {
    event.stopPropagation();
    setAnchorElMore(event.currentTarget);
  };
  const handleCloseMore = () => setAnchorElMore(null);

  const changePage = () => {
    console.log("You clicked me");
  };

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
      <CardContent>
        <Avatar
          sx={styles.avatar}
          alt="Remy Sharp"
          src="https://picsum.photos/200"
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

        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
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
