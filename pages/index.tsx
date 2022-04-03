import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { PostModel } from "models/post";
import Link from "next/link";
import resource from "util/resource";

async function getPosts() {
  const { data, error } = await resource.get("/api/post");
  if (data) return data;
  console.trace(error);
}

const Home: NextPage = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);

  useEffect(() => {
    getPosts().then((data) => setPosts(data || []));
  }, []);

  const postList = posts.map((post) => (
    <li
      key={post._id?.toString()}
      className="cursor-pointer bg-white shadow-sm rounded hover:bg-slate-200 transition ease mb-1 py-3"
    >
      <Link href={`/post/${post._id}`} passHref={true}>
        <a>
          <div className="px-3">
            <h3 className="text-lg">{post.title}</h3>
            <p className="text-slate-500">{post.description}</p>
          </div>
        </a>
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
      <section className="px-5 mt-5">
        <ul>{postList}</ul>
      </section>
    </div>
  );
};

export default Home;
