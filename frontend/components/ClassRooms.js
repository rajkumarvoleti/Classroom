import { Grid } from "@mui/material";
import ClassCard from "./ClassCard";

const classes = ["", "", "", "", ""];

export default function ClassRooms() {
  return (
    <Grid container spacing="30px">
      {classes.map(() => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <ClassCard />
        </Grid>
      ))}
    </Grid>
  );
}
