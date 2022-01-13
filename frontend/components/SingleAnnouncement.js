import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
import moment from "moment";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const styles = {
  user: {
    display: "flex",
    alignItems: "center",
    ".text": {
      ml: "20px",
    },
    ".text>*": {
      m: 0,
    },
    ".text p": {
      color: "grey",
      fontSize: "12px",
    },
    ".text h3": {
      fontSize: "16px",
      fontWeight: "500",
    },
  },
};

const getFileName = (url) => {
  let pos = url.indexOf("?");
  return url.slice(pos + 1);
};

function FileComp({ url }) {
  console.log(url);
  const fileName = getFileName(url);
  return (
    <Box sx={{ display: "flex" }}>
      <IconButton href={url} target="_blank">
        <AttachFileIcon />
      </IconButton>
      <p>{fileName}</p>
    </Box>
  );
}

export default function SingleAnnouncement({ data }) {
  const date = moment(data.date)
    .utc()
    .utcOffset(330)
    .format("MMMM Do YYYY, h:mm:ss a");

  const urls = JSON.parse(data.links);

  return (
    <Paper sx={{ p: "10px 30px", my: "15px" }}>
      <Box sx={styles.user}>
        <Avatar src={data.user.image} alt={data.user.name} />
        <div className="text">
          <h3>{data.user.name}</h3>
          <p>{date}</p>
        </div>
      </Box>
      <Box>
        <p>{data.text}</p>
        <Box>
          {urls?.map((url) => (
            <FileComp url={url} />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
