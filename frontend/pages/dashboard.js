import { Box } from "@mui/system";
import ClassRooms from "../components/ClassRooms";
import { useSession } from "next-auth/react";
import CircularProgressComp from "../components/CircularProgressComp";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import {
  GET_STUDENT_CLASSES,
  GET_TEACHER_CLASSES,
} from "../graphql/ClassQueries";
import { useQuery } from "@apollo/client";

function TabPanel({ value, index, userId, type }) {
  const {
    data: studentData,
    loading: studentLoading,
    error: studentError,
  } = useQuery(GET_STUDENT_CLASSES, {
    variables: { id: userId },
  });
  const {
    data: teacherData,
    loading: teacherLoading,
    error: teacherError,
  } = useQuery(GET_TEACHER_CLASSES, {
    variables: { id: userId },
  });

  if (studentLoading || teacherLoading)
    return <CircularProgressComp height={"80vh"} />;
  if (studentError || teacherError) {
    console.log({ studentError, teacherError });
    return <p>Something went wrong</p>;
  }

  const studentClasses = studentData.allClasses;
  const teacherClasses = teacherData.allClasses;
  const allClasses = [...studentClasses, ...teacherClasses];

  let classes = allClasses;
  if (type === "student") classes = studentClasses;
  else if (type === "teacher") classes = teacherClasses;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ margin: "30px 10px" }}>
          <ClassRooms classes={classes} />
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
