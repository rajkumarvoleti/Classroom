import {
  Card,
  CardContent,
  CardMedia,
  Collapse,
  Container,
  IconButton,
  Paper,
  Slide,
  Typography,
} from "@mui/material";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAlert } from "../lib/AlertContext";

const styles = {
  container: {
    mt: "20px",
    position: "relative",
    padding: "0 !important",
  },
  info: {
    padding: "0 !important",
  },
  image: {
    border: "1px solid transparent",
    width: "100%",
  },
  content: {
    position: "absolute",
    bottom: "5px",
    left: "20px",
    zIndex: 2,
    color: "white",
    width: "100%",
    ".icon": {
      position: "absolute",
      right: "70px",
      bottom: "30px",
      color: "white",
    },
    ".rotate": {
      transform: "rotate(180deg)",
    },
  },
  paper: {
    padding: "30px",
    ".paperContent": {
      fontWeight: "500",
      fontSize: "16px",
      span: {
        fontWeight: "400",
      },
    },
  },
};

function CopyButton({ text }) {
  const { openAlert } = useAlert();
  const handleCopy = () => {
    openAlert({ mode: "success", title: "Copied!" });
  };

  return (
    <CopyToClipboard onCopy={handleCopy} text={text}>
      <IconButton>
        <ContentCopyIcon sx={{ ml: "10px", fontSize: "20px" }} />
      </IconButton>
    </CopyToClipboard>
  );
}

export default function StreamBanner({ Class, isTeacher }) {
  const [info, setInfo] = useState(false);

  const toggleInfo = () => setInfo(!info);

  return (
    <>
      <Container sx={styles.container}>
        <CardMedia
          sx={styles.image}
          component="img"
          height="200"
          image={Class.banner}
          className={info ? "borderHalfD" : "borderFull"}
        />
        <CardContent sx={styles.content}>
          <Typography sx={{ maxWidth: "60vw" }} variant="h4">
            {Class.name}
          </Typography>
          <Typography>{Class.section}</Typography>
          {isTeacher && (
            <IconButton
              className={info ? "icon rotate" : "icon"}
              onClick={toggleInfo}
            >
              <ExpandCircleDownOutlinedIcon />
            </IconButton>
          )}
        </CardContent>
      </Container>
      <Container maxWidth="lg" sx={styles.info}>
        <Collapse in={info}>
          <Paper sx={styles.paper} elevation={1}>
            {Class.subject && (
              <Typography className="paperContent">
                Subject <span>{Class.subject}</span>
              </Typography>
            )}
            {isTeacher && (
              <Typography className="paperContent">
                Student Invite Code <span>{Class.studentInviteCode}</span>
                <CopyButton text={Class.studentInviteCode} />
              </Typography>
            )}
            {isTeacher && (
              <Typography className="paperContent">
                Teacher Invite Code <span>{Class.teacherInviteCode}</span>
                <CopyButton text={Class.teacherInviteCode} />
              </Typography>
            )}
          </Paper>
        </Collapse>
      </Container>
    </>
  );
}
