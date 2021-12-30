import { Container } from "@mui/material";
import StreamBanner from "./StreamBanner";

export default function Stream({ Class, isTeacher }) {
  return (
    <Container maxWidth="lg">
      <StreamBanner Class={Class} isTeacher={isTeacher} />
    </Container>
  );
}
