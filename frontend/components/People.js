import {
  Avatar,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import CatSvg from "../lib/CatSvg";

function ListComp({ array }) {
  if (!array[0])
    return (
      <Box className="center" sx={{ width: "100%", mt: "60px" }}>
        <CatSvg />
        <p>No one here</p>
      </Box>
    );
  return (
    <List dense>
      {array.map((user) => (
        <Box key={user.id}>
          <ListItem sx={{ m: "10px" }}>
            <ListItemAvatar>
              <Avatar src={user.image} alt={user.name} />
            </ListItemAvatar>
            <ListItemText>{user.name}</ListItemText>
          </ListItem>
          <Divider />
        </Box>
      ))}
    </List>
  );
}

export default function People({ Class }) {
  const { teachers, students } = Class;
  return (
    <Container maxWidth="md">
      <Box>
        <Typography fontSize="25px" color="blue">
          Teachers
        </Typography>
        <Divider sx={{ backgroundColor: "blue", height: "2px" }} />
        <ListComp array={teachers} />
      </Box>
      <Box sx={{ mt: "40px" }}>
        <Typography fontSize="25px" color="blue">
          Students
        </Typography>
        <Divider sx={{ backgroundColor: "blue", height: "2px" }} />
        <ListComp array={students} />
      </Box>
    </Container>
  );
}
