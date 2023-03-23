// Create a theme instance.
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    white: "#FEFEFF",
    gray: "#8E8A9B",
    blue: "#2357B8",
    darkblue: "#244576",
    green: "#328985",
    darkgreen: "#006470",
    orange: "#EB6B54",
    ...(mode === "light"
      ? {
          background: {
            primary: "#FEFEFF",
            secondary: "#E0E1E1",
          },
          text: {
            primary: "#2A2250",
            secondary: "#8E8A9B",
          },
        }
      : {
          background: {
            primary: "#010100",
            secondary: "#060402",
            
          },
          text: {
            primary: "#d5ddaf",
            secondary: "#717564",
          },
        }),
  },
});

// main: "#2357B8",
export default getDesignTokens;
