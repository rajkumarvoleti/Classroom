import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import moment from "moment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NextLink from "next/link";
import { Link as MUILink } from "@material-ui/core";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_ANNOUNCEMENT } from "../graphql/Announcement";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEmitter } from "react-custom-events-hooks";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
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

function Confirm({ open, setOpen, handleDelete, loading }) {
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ mt: "10px" }}>
        Delete the Announcement?
      </DialogContent>

      <DialogActions className="centerR" sx={{ mb: "15px" }}>
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          sx={{ textTransform: "none" }}
          variant="contained"
          color="error"
          onClick={handleDelete}
          loading={loading}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function FileComp({ url }) {
  const fileName = getFileName(url);
  return (
    <Box sx={{ display: "flex" }}>
      <IconButton href={url} target="_blank">
        <AttachFileIcon />
      </IconButton>
      <NextLink href={url} passHref>
        <MUILink className="center" variant="body2">
          {fileName}
        </MUILink>
      </NextLink>
    </Box>
  );
}

export default function SingleAnnouncement({ data, userId }) {
  const [open, setOpen] = useState(false);

  const openConfirm = () => setOpen(true);
  const closeConfirm = () => setOpen(false);

  const [deleteAnnouncemnt, { error: deletError, loading: deleteLoading }] =
    useMutation(DELETE_ANNOUNCEMENT);

  let refetchAnnouncements;
  if (typeof window !== "undefined") {
    refetchAnnouncements = useEmitter(`Announcement${data.classroom.id}`);
  }

  const date = moment(data.date)
    .utc()
    .utcOffset(330)
    .format("MMMM Do YYYY, h:mm:ss a");

  const urls = JSON.parse(data.links);

  const handleDelete = async () => {
    console.log(data.id);
    await deleteAnnouncemnt({ variables: { id: data.id } });
    refetchAnnouncements();
    closeConfirm();
  };

  if (deletError) return <p>Something went wrong.Please refresh the page</p>;

  console.log(data.user.id, userId);

  return (
    <Paper sx={{ p: "10px 30px", my: "15px" }}>
      <Box sx={styles.header}>
        <Box sx={styles.user}>
          <Avatar src={data.user.image} alt={data.user.name} />
          <div className="text">
            <h3>{data.user.name}</h3>
            <p>{date}</p>
          </div>
        </Box>
        {userId === data.user.id && (
          <Tooltip title="Delete Announcemet">
            <IconButton>
              <DeleteForeverIcon color="error" onClick={openConfirm} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box>
        <p>{data.text}</p>
        <Box>
          {urls?.map((url) => (
            <FileComp key={url} url={url} />
          ))}
        </Box>
      </Box>
      <Confirm
        open={open}
        setOpen={setOpen}
        handleDelete={handleDelete}
        loading={deleteLoading}
      />
    </Paper>
  );
}
