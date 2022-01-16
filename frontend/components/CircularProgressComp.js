import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function CircularProgressComp({ height, width }) {
  return (
    <Box
      className="center"
      sx={{ width: width || "100vw", height: { height } }}
    >
      <CircularProgress />
    </Box>
  );
}
