import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function CircularProgressComp({ height }) {
  return (
    <Box className="center" sx={{ width: "100vw", height: { height } }}>
      <CircularProgress />
    </Box>
  );
}
