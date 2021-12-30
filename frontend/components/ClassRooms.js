import { useTheme } from "@emotion/react";
import { Grid } from "@mui/material";
import ClassCard from "./ClassCard";
import NoClasses from "./NoClasses";

export default function ClassRooms({ classes }) {
  const theme = useTheme();

  const style = {
    [theme.breakpoints.down("sm")]: {
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
    },
    maxWidth: "90vw",
  };

  if (!classes[0]) return <NoClasses />;

  return (
    <Grid sx={style} container>
      {classes.map((_class) => (
        <Grid sx={{ padding: "10px" }} item xs={12} sm={6} md={4} lg={3} xl={2}>
          <ClassCard id={_class.id} key={_class.id} />
        </Grid>
      ))}
    </Grid>
  );
}
