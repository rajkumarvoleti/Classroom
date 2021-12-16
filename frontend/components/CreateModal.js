import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { MenuItem, TextField } from "@mui/material";

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

export default function CreateModal({ handleCloseClassroomMenu }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    class: "",
    section: "",
    subject: "",
  });

  const handleOpen = (e) => {
    e.stopPropagation();
    handleCloseClassroomMenu();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "class" && value !== "") setError(false);
    values[name] = value;
    console.log(values);
    setValues(values);
  };

  const handleSubmit = () => {
    if (values.class === "") {
      setError(true);
      return;
    }
    console.log("success", values);
  };

  return (
    <Box>
      <MenuItem onClick={handleOpen}>
        <Typography>Create Class</Typography>
      </MenuItem>
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
                name="class"
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
            </Box>
            <Box className="buttonGroup">
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
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
