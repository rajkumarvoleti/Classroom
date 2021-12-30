import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      html: {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        height: "100%",
        width: "100%",
        "-webkit-box-sizing": "border-box",
        "-moz-box-sizing": "border-box",
        boxSizing: "border-box",
        fontFamily: "Open Sans, sans-serif",
      },
      "*, *::before, *::after": {
        "-webkit-box-sizing": "inherit",
        "-moz-box-sizing": "inherit",
        boxSizing: "inherit",
      },
      body: {
        height: "100%",
        width: "100%",
        overflowX: "hidden",
      },
      "#root": {
        height: "100%",
        width: "100%",
      },
      ".tsparticles canvas": {
        position: "absolute !important",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      },
      ".center": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      },
      ".centerR": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      },
      ".elevate": {
        "&:hover": {
          boxShadow:
            " rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
          transition: "box-shadow 0.3s ease-in-out",
        },
      },
      ".borderHalfD": {
        border: "1px solid transparent",
        borderRadius: "10px 10px 0 0",
      },
      ".borderHalfU": {
        border: "1px solid transparent",
        borderRadius: " 0 0 10px 10px",
      },
      ".borderFull": {
        border: "1px solid transparent",
        borderRadius: "10px",
      },
    },
  })
);

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
