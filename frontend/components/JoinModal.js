import { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

import Typography from "@mui/material/Typography";
import { MenuItem, TextField } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useMutation } from "@apollo/client";
import { JOIN_CLASS } from "../graphql/Class";
import AlertComp from "./AlertComp";
import { useEmitter } from "react-custom-events-hooks";
import { useAlert } from "../lib/AlertContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  ".inputs": {
    my: "30px",
    ".toggle": {
      flexDirection: "row",
      mb: "10px",
    },
  },
  ".buttonGroup button": {
    mx: "10px",
  },
};

const result = {
  title: "Success",
  mode: "success",
  message: "You have joined the class",
};

export default function JoinModal({ simple, handleMenuClose, userId }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [teacher, setTeacher] = useState(false);
  const [error, setError] = useState(null);

  const [joinClass, { data, error: classError, loading }] =
    useMutation(JOIN_CLASS);
  const { openAlert } = useAlert();

  const handleOpen = (e) => {
    e.stopPropagation();
    if (handleMenuClose) handleMenuClose();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCodeChange = (e) => setCode(e.target.value);
  const refetchClasses = useEmitter("refetchClasses");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await joinClass({
      variables: {
        code: code,
        userId,
        isTeacher: teacher,
      },
    });
    const message = res.data.joinClass.message;
    if (message === "success") {
      setError(null);
      refetchClasses();
      openAlert(result);
      handleClose();
    } else setError(message);
  };

  const handleSwitch = () => {
    setTeacher(!teacher);
  };

  useEffect(() => {
    setError(null);
  }, []);

  if (classError)
    return <p>Something went wrong. Please try refreshing the page {error}</p>;

  return (
    <Box>
      {!simple && (
        <MenuItem onClick={handleOpen}>
          <Typography>Join class</Typography>
        </MenuItem>
      )}
      {simple && <Typography onClick={handleOpen}>Join class</Typography>}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style} className="center">
            <Typography fontSize="20px" textAlign="center">
              Enter the Class Code
            </Typography>

            <Box className="inputs">
              <Box className="toggle center">
                <Typography>Join as a Teacher ?</Typography>
                <Switch onChange={handleSwitch} />
              </Box>
              <TextField
                error={error}
                label="Class Code"
                size="small"
                onChange={handleCodeChange}
                helperText={error ? error : ""}
              />
            </Box>

            <Box className="buttonGroup">
              <LoadingButton
                onClick={handleSubmit}
                variant="contained"
                loading={loading}
              >
                Submit
              </LoadingButton>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
