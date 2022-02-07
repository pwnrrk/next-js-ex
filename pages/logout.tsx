import { NextPage } from "next";
import Layout from "../components/layout";
import useUser from "../util/useUser";

const Logout: NextPage = () => {
  useUser().then((user) => {
    user.logout();
  });
  location.replace("/");
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Logout;
