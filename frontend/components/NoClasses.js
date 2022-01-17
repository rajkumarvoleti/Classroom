import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import CreateModal from "./CreateModal";
import JoinModal from "./JoinModal";

const svg = "https://www.gstatic.com/classroom/empty_states_home.svg";

export default function NoClasses({ userId }) {
  return (
    <Box className="center" sx={{ width: "300px", height: "70vh" }}>
      <img src={svg} alt="No classes" />
      <Typography sx={{ textAlign: "center", my: "20px" }}>
        You have no classes. Check the info option at the top if you don't have
        any invite codes.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button sx={{ textTransform: "none" }} size="small" variant="outlined">
          <CreateModal userId={userId} simple={true} />
        </Button>
        <Button sx={{ textTransform: "none" }} size="small" variant="contained">
          <JoinModal userId={userId} simple={true} />
        </Button>
      </Stack>
    </Box>
  );
}
