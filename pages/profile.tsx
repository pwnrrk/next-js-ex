import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import useUser from "../util/useUser";

function ProfileData() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoggedin, setLoggedIn] = useState(false);
  const getUser = useUser;
  useEffect(() => {
    setLoading(true);
    getUser().then((res) => {
      setData(res.user);
      setLoggedIn(res.isLoggedin);
      setLoading(false);
    });
  }, [getUser]);
  if (isLoading)
    return (
      <div className="text-center text-2xl text-slate-300">Loading...</div>
    );
  if (!isLoggedin)
    return (
      <div className="text-center text-2xl text-slate-300">
        Please <Link href="/login">Login</Link>
      </div>
    );
  return (
    <div className="text-center text-2xl text-slate-300">
      Welcome {data ? data["first_name"] : ""}
    </div>
  );
}
const Profile: NextPage = () => {
  return (
    <Layout>
      <div className="max-w-lg mx-auto text-center">
        <Head>
          <title>Blogs</title>
          <meta name="description" content="Blogs Test" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen">
          <div className="rounded-lg p-5 bg-slate-100 my-5">
            <ProfileData />
          </div>
        </main>
      </div>
    </Layout>
  );
};
export default Profile;
