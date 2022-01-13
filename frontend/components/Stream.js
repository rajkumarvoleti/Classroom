import { Container } from "@mui/material";
import AllAnnouncements from "./AllAnnouncements";
import AnnouncementInput from "./AnnouncementInput";
import StreamBanner from "./StreamBanner";

export default function Stream({ Class, isTeacher }) {
  return (
    <Container maxWidth="lg">
      <StreamBanner Class={Class} isTeacher={isTeacher} />
      <AnnouncementInput classId={Class.id} />
      <AllAnnouncements classId={Class.id} />
    </Container>
  );
}
