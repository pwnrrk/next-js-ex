import { NextPage } from "next";
import { useEffect } from "react";

const Logout: NextPage = () => {
  useEffect(() => {
    localStorage.clear();
    location.replace("/");
  }, []);
  return <div></div>;
};

export default Logout;
