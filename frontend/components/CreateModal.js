import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { MenuItem, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { CREATE_CLASS_MUTATION } from "../graphql/Class";
import AlertComp from "./AlertComp";
import { useEmitter } from "react-custom-events-hooks";
import { useAlert } from "../lib/AlertContext";
import ImagePickerComp from "./ImagePickerComp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  ".buttonGroup button": {
    mx: "10px",
  },
};

const formStyle = {
  my: "20px",
  ".MuiFilledInput-root": {
    my: "10px",
    width: "300px",
  },
};

const success = {
  message: "Classroom created",
  title: "Success",
  mode: "success",
};

export default function CreateModal({ simple, handleMenuClose }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    name: "",
    section: "",
    subject: "",
  });
  const [banner, setBanner] = useState(
    "https://gstatic.com/classroom/themes/img_read.jpg"
  );

  const { data: session } = useSession();
  const [createClass, { data, error: classError, loading }] = useMutation(
    CREATE_CLASS_MUTATION
  );
  const { openAlert } = useAlert();

  const refetchClasses = useEmitter("refetchClasses");

  const handleOpen = (e) => {
    e.stopPropagation();
    if (handleMenuClose) handleMenuClose();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value !== "") setError(false);
    values[name] = value;
    setValues(values);
  };

  const handleSubmit = async () => {
    if (values.name === "") {
      setError(true);
      return;
    }
    const { id } = session.user;
    await createClass({ variables: { ...values, userId: id, banner } });
    openAlert(success);
    refetchClasses();
    handleClose();
  };

  return (
    <Box>
      {!simple && (
        <MenuItem onClick={handleOpen}>
          <Typography>Create Class</Typography>
        </MenuItem>
      )}
      {simple && <Typography onClick={handleOpen}>Create Class</Typography>}
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
          <Box sx={style}>
            <Typography fontSize="20px" textAlign="center">
              Create Class
            </Typography>
            <Box className="center" sx={formStyle}>
              <TextField
                onChange={handleInputChange}
                name="name"
                size="small"
                label="Class Name (required)"
                required
                variant="filled"
                error={error}
              />
              <TextField
                size="small"
                onChange={handleInputChange}
                name="section"
                variant="filled"
                label="Section"
              />
              <TextField
                onChange={handleInputChange}
                name="subject"
                size="small"
                variant="filled"
                label="Subject"
              />
              <ImagePickerComp setBanner={setBanner} />
            </Box>
            <Box className="buttonGroup">
              <LoadingButton
                loading={loading}
                onClick={handleSubmit}
                variant="contained"
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
