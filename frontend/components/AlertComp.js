import { Alert, AlertTitle, Slide, Snackbar } from "@mui/material";
import PropTypes from "prop-types";

function Transition(props) {
  return <Slide {...props} direction="right" />;
}

export default function AlertComp({
  visible,
  closeAlert,
  title,
  message,
  mode,
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      open={visible}
      autoHideDuration={2000}
      TransitionComponent={Transition}
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
  message: "Something went wrong. Please try again",
};
