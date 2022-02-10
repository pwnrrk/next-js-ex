import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PostModel } from "../../models/post";
import { UserModel } from "../../models/user";

const Post: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<{ post: PostModel; author: UserModel }>();

  useEffect(() => {
    fetch(`/api/post/${postId}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [postId]);

  const getDateString = (date: string | undefined) => {
    if (date)
      return new Date(date).toLocaleDateString("EN-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  };

  return (
    <main className="max-w-3xl px-5 mx-auto">
      <h3 className="text-xl font-bold my-5">{post?.post.title}</h3>
      <div className="text-slate-500 flex items-start justify-between">
        <div className="text-lg">{post?.author.first_name}</div>
        <div>{getDateString(post?.post.createdAt)}</div>
      </div>
      <div className="my-5">{post?.post.description}</div>
    </main>
  );
};

export default Post;
