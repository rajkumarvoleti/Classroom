import { Box } from "@mui/system";
import ClassRooms from "../components/ClassRooms";
import { useSession } from "next-auth/react";
import CircularProgressComp from "../components/CircularProgressComp";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

function TabPanel({ value, index, userId, type }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ margin: "30px 10px" }}>
          <ClassRooms userId={userId} type={type} />
        </Box>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [value, setValue] = useState(1);

  const handleChange = (e, newValue) => setValue(newValue);

  if (status === "loading") return <CircularProgressComp height={"100vh"} />;
  if (!session) return <p>please login</p>;
  return (
    <Box sx={{ margin: "10px" }}>
      <Box className="center" sx={{ width: "100vw" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="All Classes" />
          <Tab label="Enrolled" />
          <Tab label="Teaching" />
        </Tabs>
      </Box>
      <TabPanel userId={session.user.id} value={value} type="all" index={0} />
      <TabPanel
        userId={session.user.id}
        value={value}
        type="student"
        index={1}
      />
      <TabPanel
        userId={session.user.id}
        value={value}
        type="teacher"
        index={2}
      />
    </Box>
  );
}
