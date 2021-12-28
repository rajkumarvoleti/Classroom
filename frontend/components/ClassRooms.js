import { Grid } from "@mui/material";
import ClassCard from "./ClassCard";
import NoClasses from "./NoClasses";

export default function ClassRooms({ classes }) {
  if (!classes[0]) return <NoClasses />;

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
