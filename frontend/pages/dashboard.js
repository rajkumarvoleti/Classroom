import { Link } from "@mui/material";
import { useSession } from "next-auth/react";
import AppBarMenu2 from "../components/AppBarMenu2";

export default function DashboardPage() {
  const { data: session } = useSession();
  if (!session) return <Link href="/signin">Please Login to continue</Link>;
  return (
    <div>
      <AppBarMenu2 />
      <p>Hello</p>
    </div>
  );
}
