import { getSession } from "next-auth/react";
import Paper from "@mui/material/Paper";
import { Avatar, Button, Skeleton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { PickerOverlay } from "filestack-react";
import { useMutation } from "@apollo/client";
import { CREATE_ANNOUNCEMENT } from "../graphql/Announcement";
import { useAlert } from "../lib/AlertContext";
import { useEmitter } from "react-custom-events-hooks";

const paper = {
  p: "30px",
  my: "10px",
  backgroundColor: "lightwhite",
};

const style1 = {
  display: "flex",
  "&:hover": {
    cursor: "pointer",
  },
  h6: {
    width: "100%",
    color: "text.secondary",
    display: "flex",
    alignItems: "center",
    pl: "20px",
    "&:hover": {
      color: "blue",
    },
  },
};

const style2 = {
  p: "20px",
  width: "100%",
  ".MuiTextField-root": {
    width: "100%",
  },
  ".buttons": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mt: "10px",
  },
};

function Paper1({ image, openInput }) {
  return (
    <Box sx={style1} onClick={openInput}>
      <Avatar src={image} alt="user" />
      <Typography component="h6">Announce something to your class</Typography>
    </Box>
  );
}

export default function AnnouncementInput({ classId }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [urls, setUrls] = useState([]);
  const [pick, setPick] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session.user);
    });
  }, []);
  let refetchAnnouncements;
  if (typeof window !== "undefined") {
    refetchAnnouncements = useEmitter(`Announcement${classId}`);
  }

  const [create, { data, error, loading }] = useMutation(CREATE_ANNOUNCEMENT);
  const { openAlert } = useAlert();

  const openInput = () => setOpen(true);
  const closeInput = () => setOpen(false);

  const openPick = () => setPick(true);
  const closePick = () => setPick(false);

  const handlePost = async () => {
    const userId = user.id;
    const links = JSON.stringify(urls);
    await create({
      variables: {
        userId,
        classId,
        text,
        links,
      },
    });
    refetchAnnouncements();
    setUrls([]);
    setText("");
    closeInput();
    if (error) {
      openAlert({
        title: "Error",
        mode: "error",
        message: "Something went wrong",
      });
    } else {
      openAlert({
        title: "Success",
        mode: "success",
        message: "Announcement posted",
      });
    }
  };

  const handleTextChange = (e) => setText(e.target.value);

  const onUploadDone = (files) => {
    console.log(files);
    files.filesUploaded.forEach((file) => {
      setUrls([...urls, `${file.url}?${file.filename}`]);
    });
  };
  const onUploadError = (err) => {
    console.log(err);
  };

  const pickerOptions = {
    accept: [".pdf", "image/*", "video/*", "audio/*", "text/*"],
    disableThumbnails: false,
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    onClose: closePick,
  };

  const apiKey = process.env.NEXT_PUBLIC_FILESTACK_API_KEY;

  if (!user) return <Skeleton sx={paper} variant="rectangle" height="80px" />;
  return (
    <Paper sx={paper} elevation={3}>
      {!open && <Paper1 image={user.image} openInput={openInput} />}
      {open && (
        <Box sx={style2}>
          <TextField onChange={handleTextChange} label="Type something" />
          {pick && (
            <PickerOverlay
              apikey={apiKey}
              onUploadDone={onUploadDone}
              onError={onUploadError}
              pickerOptions={pickerOptions}
            />
          )}
          {urls[0] && (
            <p>{`${urls.length} ${
              urls.length == 1 ? "file" : "files"
            } uploaded`}</p>
          )}
          <Box className="buttons">
            <Button onClick={openPick}>Upload Files</Button>
            <Box>
              <Button sx={{ m: "5px" }} variant="outlined" onClick={closeInput}>
                Cancel
              </Button>
              <LoadingButton
                loading={loading}
                sx={{ m: "5px" }}
                variant="contained"
                onClick={handlePost}
              >
                Post
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  );
}
