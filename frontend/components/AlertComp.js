import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";
import PropTypes from "prop-types";
import { useAlert } from "../lib/AlertContext";

function Transition(props) {
  return <Slide timeout={2000} {...props} direction="right" />;
}

export default function AlertComp() {
  const { visible, closeAlert, options } = useAlert();
  const { title, message, mode } = options;

  return (
    <Snackbar
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      open={visible}
      onClose={closeAlert}
      TransitionComponent={Transition}
      sx={{ maxWidth: "80vw" }}
    >
      <Alert onClose={closeAlert} severity={mode} sx={{ width: "100%" }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
}

AlertComp.propTypes = {
  visible: PropTypes.bool,
  closeAlert: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
};

AlertComp.defaultProps = {
  title: "Error",
  message:
    "Something went wrong. Please try refreshing the page. Please try again",
};
