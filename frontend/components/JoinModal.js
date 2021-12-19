import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ButtonGroup, Input, MenuItem, TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
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

export default function JoinModal() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCodeChange = (e) => setCode(e.target.value);

  const handleSubmit = () => {
    console.log(code);
  };

  return (
    <Box>
      <MenuItem onClick={handleOpen}>
        <Typography>Join class</Typography>
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
              Enter the Class Code
            </Typography>
            <TextField
              sx={{ my: "30px" }}
              label="Class Code"
              size="small"
              onChange={handleCodeChange}
            />
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
