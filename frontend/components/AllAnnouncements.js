import { Box } from "@mui/material";
import CircularProgressComp from "./CircularProgressComp";
import SingleAnnouncement from "./SingleAnnouncement";
import { useQuery } from "@apollo/client";
import { ALL_ANNOUNCEMENTS } from "../graphql/Announcement";
import { useListener } from "react-custom-events-hooks";
import CatSvg from "../lib/CatSvg";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AllAnnouncements({ classId }) {
  const { data, error, loading, refetch } = useQuery(ALL_ANNOUNCEMENTS, {
    variables: { id: classId },
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session.user);
    });
  }, []);

  if (typeof window !== "undefined") {
    useListener(`Announcement${classId}`, () => {
      refetch();
    });
  }

  if (loading || !user) return <CircularProgressComp height="30vh" />;

  if (error) {
    console.log(error);
    return <p>Something went wrong. Please try refreshing the page</p>;
  }

  if (!data.allAnnouncements[0]) {
    return (
      <Box sx={{ width: "90vw", mt: "50px" }} className="center">
        <CatSvg />
        <p>You can see the class announcements here</p>
      </Box>
    );
  }

  return (
    <Box>
      {data.allAnnouncements.map((ann) => (
        <SingleAnnouncement data={ann} userId={user?.id} />
      ))}
    </Box>
  );
}
