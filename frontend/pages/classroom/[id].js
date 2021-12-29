import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import CircularProgressComp from "../../components/CircularProgressComp";
import { CLASS_DATA } from "../../graphql/ClassQueries";

export default function ClassroomPage() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);
  const { data, error, loading } = useQuery(CLASS_DATA, {
    variables: { id },
  });

  if (loading) return <CircularProgressComp height="80vh" />;
  if (error) {
    console.log(error);
    return <p>Something went wrong</p>;
  }
  console.log(data);
  return <p>{id}</p>;
}
