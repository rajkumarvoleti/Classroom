import { Box } from "@mui/system";
import ClassRooms from "../components/ClassRooms";
import { useSession } from "next-auth/react";
import CircularProgressComp from "../components/CircularProgressComp";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <CircularProgressComp height={"100vh"} />;
  console.log(session);
  if (!session) return <p>please login</p>;
  return (
    <Box sx={{ margin: "20px" }}>
      <ClassRooms userId={session.user.id} type="all" />
    </Box>
  );
}
