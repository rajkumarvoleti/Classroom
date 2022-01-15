import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AppBarMenu2 from "./AppBarMenu2";

export default function Page({ children, setMode }) {
  const [home, setHome] = useState(true);

  const router = useRouter();

  const handleRouteChange = (url) => {
    if (url === "/" || url.includes("sign")) setHome(true);
    else setHome(false);
  };

  useEffect(() => {
    handleRouteChange(router.pathname);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      {!home && <AppBarMenu2 setMode={setMode} />}
      {children}
    </>
  );
}
