import { Box } from "@mui/system";
import ClassCard from "../components/ClassCard";
import ClassRooms from "../components/ClassRooms";

export default function DashboardPage() {
  return (
    <Box sx={{ margin: "20px" }}>
      <ClassRooms />
    </Box>
  );
}
