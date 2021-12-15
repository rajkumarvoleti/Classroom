import { getProviders, signIn, getSession } from "next-auth/react";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Button } from "@mui/material";
import logo from "../images/logoBg.png";
const styles = {
  boxOuter: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "background.primary",
    justifyContent: "center",
    alignItems: "center",
  },
  head: {
    textAlign: "center",
    color: "text.primary",
    img: {
      width: "150px",
      height: "auto",
    },
  },
  boxInner: {
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    border: "1px solid",
    borderColor: "text.secondary",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    button: {
      height: "40px",
      margin: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
      svg: {
        marginRight: "10px",
      },
    },
    "#google": {
      backgroundColor: "#EA483A",
      "&:hover": {
        backgroundColor: "#CC213B",
      },
    },
    "#github": {
      backgroundColor: "#211F1F",
      "&:hover": {
        backgroundColor: "#4f4a4a",
      },
    },
  },
};

function signin({ providers }) {
  const Icons = {
    facebook: <FacebookIcon />,
    google: <GoogleIcon />,
    github: <GitHubIcon />,
  };

  if (!providers) return null;
  return (
    <Box sx={styles.boxOuter}>
      <Box sx={styles.boxInner}>
        <Box sx={styles.head}>
          <h2>Sign In to Classroom</h2>
          <img src={logo.src} alt="logo" />
        </Box>
        <Box sx={styles.buttonGroup}>
          {Object.values(providers).map((provider) => {
            return (
              <Button
                key={provider.name}
                variant="contained"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/dashboard",
                  })
                }
                id={provider.id}
              >
                {Icons[provider.id]}
                Sign in with {provider.name}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default signin;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();

  if (!providers) return;

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: { providers },
  };
}
