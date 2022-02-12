import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { PostModel } from "models/post";
import Link from "next/link";

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  useEffect(() => {
    fetch("/api/post")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  const postList = posts.map((post) => (
    <li
      key={post._id?.toString()}
      className="border-b cursor-pointer hover:bg-slate-200 transition ease border-b-slate-300 py-3"
    >
      <Link href={`/post/${post._id}`} passHref={true}>
        <div className="px-3">
          <h3 className="text-lg">{post.title}</h3>
          <p className="text-slate-500">{post.description}</p>
        </div>
      </Link>
    </li>
  ));

  return (
    <div className="px-5">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Blogs Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen">
        <div className="rounded-lg p-5 bg-slate-100 my-5">
          <ul>{postList}</ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
