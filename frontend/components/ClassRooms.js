import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import {
  GET_STUDENT_CLASSES,
  GET_TEACHER_CLASSES,
} from "../graphql/ClassQueries";
import ClassCard from "./ClassCard";

const classes = ["", "", "", "", ""];

export default function ClassRooms({ type, userId }) {
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

  if (studentLoading || teacherLoading) return <p>loading</p>;
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
    <Grid container spacing="30px">
      {classes.map((_class) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <ClassCard id={_class.id} key={_class.id} />
        </Grid>
      ))}
    </Grid>
  );
}
