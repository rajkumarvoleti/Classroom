import background from "../images/gradient.png";
import Grid from "@mui/material/Grid";
import { useTheme } from "@emotion/react";

import homePageImg from "../images/homePageImg.png";
import wave from "../images/WaveSVG2.png";
import { Button } from "@mui/material";
import { BackgroundParticles } from "../components/BackgroundParticles";
import { useRouter } from "next/dist/client/router";
import { signIn, signOut, getSession } from "next-auth/react";
import AppBarMenu1 from "../components/AppBarMenu1";

export default function HomePage({ user }) {
  const router = useRouter();
  const theme = useTheme();

  const styles = {
    main: {
      backgroundImage: `url(${background.src})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    head: {
      color: "white",
      textAlign: "center",
      h1: {
        fontSize: "50px",
      },
      p: {
        fontSize: "18px",
      },
      [theme.breakpoints.down("md")]: {
        h1: {
          fontSize: "38px",
        },
      },
    },
    headButton: {
      fontSize: "18px",
      backgroundColor: "green",
      "&:hover": {
        backgroundColor: "darkgreen",
      },
    },
    wave: {
      position: "absolute",
      bottom: 0,
      width: "100vw",
      zIndex: "3",
    },
    grid: {
      padding: "0 40px",
      [theme.breakpoints.down("md")]: {
        marginTop: "150px",
      },
    },
    headImage: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 4,
      img: {
        width: "90%",
        filter: "drop-shadow(0.35rem 0.35rem 0.4rem rgba(0, 0, 0, 0.5))",
      },
    },
  };

  const goToClassroom = async (e) => {
    e.preventDefault();
    if (!user) signIn();
    router.push("/dashboard");
  };

  return (
    <div>
      <AppBarMenu1 user={user} />
      <div style={styles.main}>
        <BackgroundParticles />
        <Grid container spacing={2} sx={styles.grid}>
          <Grid item md={12} lg={6} sx={styles.head}>
            <h1>The teacher’s choice for over a decade</h1>
            <p>
              Satchel One is a Google for Education Partner, Microsoft Partner
              and is trusted by 1 in 3 UK secondary schools. Our award-winning
              learning platform integrates seamlessly with Google Classroom and
              Microsoft Teams, forming meaningful relationships, and helping
              schools deliver the ultimate learning experience.
            </p>
            <Button
              onClick={goToClassroom}
              size="large"
              sx={styles.headButton}
              variant="contained"
            >
              Go To Classroom
            </Button>
          </Grid>
          <Grid item md={12} lg={6} sx={styles.headImage}>
            <img src={homePageImg.src} alt="homePageImg" />
          </Grid>
        </Grid>

        <img src={wave.src} alt="wrong path" style={styles.wave} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: {
      user: session?.user || null,
    },
  };
}
