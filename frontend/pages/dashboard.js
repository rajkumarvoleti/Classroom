import { Box } from "@mui/system";
import ClassRooms from "../components/ClassRooms";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>loading</p>;
  console.log(session);
  if (!session) return <p>please login</p>;
  return (
    <Box sx={{ margin: "20px" }}>
      <ClassRooms userId={session.user.id} type="all" />
    </Box>
  );
}
