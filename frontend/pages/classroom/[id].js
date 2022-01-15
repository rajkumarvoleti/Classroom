import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import CircularProgressComp from "../../components/CircularProgressComp";
import { CLASS_DATA } from "../../graphql/Class";
import { getSession } from "next-auth/react";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Stream from "../../components/Stream";
import People from "../../components/People";

export default function ClassroomPage({ user }) {
  const router = useRouter();
  const { id } = router.query;

  const {
    data,
    error,
    loading: classLoading,
  } = useQuery(CLASS_DATA, {
    variables: { id },
  });

  const [value, setValue] = useState(0);
  const handleChange = (e, newValue) => setValue(newValue);

  if (classLoading) return <CircularProgressComp height="80vh" />;
  if (error) {
    console.log(error);
    return <p>Something went wrong</p>;
  }

  const isTeacher = data.Class.teachers.find(
    (teacher) => teacher?.id === user?.id
  );

  return (
    <Box>
      <Box className="center">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Stream" />
          <Tab label="Classwork" />
          <Tab label="People" />
          {isTeacher && <Tab label="Marks" />}
        </Tabs>
      </Box>
      <div role="tabpanel" hidden={value !== 0}>
        <Stream Class={data.Class} isTeacher={isTeacher} />
      </div>
      <div role="tabpanel" hidden={value !== 1}>
        <p>Class work</p>
      </div>
      <div role="tabpanel" hidden={value !== 2}>
        <People Class={data.Class} />
      </div>
      {isTeacher && (
        <div role="tabpanel" hidden={value !== 3}>
          <p>Marks</p>
        </div>
      )}
    </Box>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      user: session?.user || null,
    },
  };
}
