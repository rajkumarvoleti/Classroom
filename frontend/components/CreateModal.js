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
import { CREATE_CLASS_MUTATION } from "../graphql/ClassQueries";
import AlertComp from "./AlertComp";

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

const result = {
  message: "It's woking",
  title: "Success",
  mode: "success",
};

export default function CreateModal() {
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [error, setError] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);
  const [values, setValues] = useState({
    name: "",
    section: "",
    subject: "",
  });

  const { data: session } = useSession();
  const [createClass, { data, error: classError, loading }] = useMutation(
    CREATE_CLASS_MUTATION
  );

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const closeSnack = () => setSnack(false);
  const openSnack = () => setSnack(true);

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
    setBtnLoad(true);
    const res = await createClass({ variables: { ...values, userId: id } });
    console.log(res.data);
    setBtnLoad(false);
    openSnack();
    handleClose();
    // open the classroom page
  };

  return (
    <Box>
      <AlertComp
        visible={snack}
        closeAlert={closeSnack}
        title={result.title}
        message={result.message}
        mode={result.mode}
      />
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
            </Box>
            <Box className="buttonGroup">
              <LoadingButton
                loading={btnLoad}
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