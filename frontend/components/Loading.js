import { Box } from "@mui/system";
import LoadingSvg from "../images/loadingPage.svg";

const style = {
  backgroundColor: "background.primary",
  height: "90vh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function Loading() {
  return (
    <Box sx={style}>
      <LoadingSvg />
    </Box>
  );
}
