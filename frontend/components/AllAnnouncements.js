import { Box } from "@mui/material";
import CircularProgressComp from "./CircularProgressComp";
import SingleAnnouncement from "./SingleAnnouncement";
import { useQuery } from "@apollo/client";
import { ALL_ANNOUNCEMENTS } from "../graphql/Announcement";
import { useListener } from "react-custom-events-hooks";
import CatSvg from "../lib/CatSvg";

export default function AllAnnouncements({ classId }) {
  const { data, error, loading, refetch } = useQuery(ALL_ANNOUNCEMENTS, {
    variables: { id: classId },
  });

  if (typeof window !== "undefined") {
    useListener(`Announcement${classId}`, () => {
      refetch();
    });
  }

  if (error) {
    console.log(error);
    return <p>Something went wrong. Please try refreshing the page</p>;
  }
  if (loading) return <CircularProgressComp height="30vh" />;

  if (!data.allAnnouncements[0]) {
    return (
      <Box sx={{ width: "100vw", mt: "50px" }} className="center">
        <CatSvg />
        <p>You can see the class announcements here</p>
      </Box>
    );
  }

  return (
    <Box>
      {data.allAnnouncements.map((ann) => (
        <SingleAnnouncement data={ann} />
      ))}
    </Box>
  );
}
