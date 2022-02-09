import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Blogs Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <div className="rounded-lg p-5 bg-slate-100 my-5">
          <h1 className="text-3xl my-12 font-bold">Welcome</h1>
        </div>
      </main>
    </div>
  );
};

export default Home;
