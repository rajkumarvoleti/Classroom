import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Countdown() {
  const [seconds, setSeconds] = useState(0);
  const [mins, setMins] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  const deadline = "February, 17, 2023";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMins(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Typography>{days} : </Typography>
      <Typography>{hours} : </Typography>
      <Typography>{mins} : </Typography>
      <Typography>{seconds}</Typography>
    </Box>
  );
}
