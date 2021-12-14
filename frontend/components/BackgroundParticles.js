import Particles from "react-tsparticles";

export const BackgroundParticles = () => {
  const particlesInit = (main) => {
    // console.log(main);
    // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
  };

  const particlesLoaded = (container) => {};
  return (
    <Particles
      className="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
          position: "relative",
          repeat: "no-repeat",
          size: "cover",
        },
        backgroundMask: {
          cover: {
            color: {
              value: "#ffffff00",
            },
          },
        },
        interactivity: {
          events: {
            onClick: {
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "bubble",
            },
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              color: {
                value: "#122842",
              },
              size: 40,
            },
            grab: {
              distance: 400,
            },
          },
        },
        particles: {
          color: {
            value: "#244576",
          },
          links: {
            color: {
              value: "#ffffff",
            },
            distance: 200,
            width: 2,
          },
          move: {
            attract: {
              rotate: {
                x: 600,
                y: 1200,
              },
            },
            enable: true,
            path: {},
            outModes: {
              bottom: "out",
              left: "out",
              right: "out",
              top: "out",
            },
            speed: 4,
            spin: {},
          },
          number: {
            density: {
              enable: true,
            },
            value: 6,
          },
          opacity: {
            random: {
              enable: true,
              minimumValue: 0.3,
            },
            value: {
              min: 0.3,
              max: 0.5,
            },
            animation: {
              speed: 1,
              minimumValue: 0.1,
            },
          },
          size: {
            random: {
              enable: true,
              minimumValue: 10,
            },
            value: {
              min: 10,
              max: 100,
            },
            animation: {
              minimumValue: 40,
            },
          },
          twinkle: {
            particles: {
              frequency: 0.02,
            },
          },
        },
      }}
    />
  );
};
