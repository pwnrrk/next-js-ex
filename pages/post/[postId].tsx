import { Types } from "mongoose";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "../../components/button";
import { inputDefaultClass } from "../../components/input";
import { userStore } from "../../lib/hooks/user";
import { CommentModel } from "../../models/comment";
import { PostModel } from "../../models/post";
import { UserModel } from "../../models/user";

const Post: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;
  const [post, setPost] = useState<{ post: PostModel; author: UserModel }>();
  const [comments, setComments] =
    useState<{ comment: CommentModel; user: UserModel }[]>();
  const [user, setUser] = useState<UserModel>();
  const [commentToPost, setCommentToPost] = useState("");
  const [isSendingComment, setSendingComment] = useState(false);
  const [isDeletingComment, setDeletingComment] = useState(false);

  useEffect(() => {
    fetch(`/api/post/${postId}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
    userStore().then(({ user }) => setUser(user));
  }, [postId]);

  useEffect(() => {
    fetch(`/api/post/${postId}/comment`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [postId, isSendingComment, isDeletingComment]);

  const getDateString = (date: string | undefined) => {
    if (date)
      return new Date(date).toLocaleDateString("EN-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  };

  const postComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!commentToPost || /^\s*$/.test(commentToPost)) return;
    setSendingComment(true);
    const response = await fetch(`/api/post/${postId}/comment`, {
      method: "POST",
      headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ content: commentToPost }),
    });
    setSendingComment(false);
    if (response.status == 200) {
      setCommentToPost("");
    }
  };

  const deleteComment = async (id: Types.ObjectId) => {
    setDeletingComment(true);
    await fetch(`/api/comment/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setDeletingComment(false);
  };

  const commentList = comments?.map((comment) => (
    <li
      key={comment.comment._id.toString()}
      className="border-b-slate-300 border-b py-5"
    >
      <div className="text-blue-500 font-medium">
        {comment.user?.first_name} {comment.user?.last_name}
      </div>
      <p className="text-s p-1">{comment.comment.content}</p>
      {user?._id?.toString() === comment.user._id?.toString() && (
        <button
          className="text-xs text-slate-500"
          onClick={() => deleteComment(comment.comment._id)}
        >
          Delete
        </button>
      )}
    </li>
  ));

  return (
    <main className="max-w-3xl p-5 mx-auto">
      <h3 className="text-xl font-bold my-5">{post?.post.title}</h3>
      <div className="text-slate-500 flex items-start justify-between">
        <div className="text-lg">{post?.author.first_name}</div>
        <div>{getDateString(post?.post.createdAt)}</div>
      </div>
      <div className="my-5">{post?.post.description}</div>
      <div className="p-5 my-5 rounded bg-slate-50">
        <div className="my-5">
          <div className="my-5 font-medium">Comments</div>
          {!user && (
            <div className="text-slate-500 text-center">Login to comment</div>
          )}
          {user && (
            <form onSubmit={postComment}>
              <textarea
                className={inputDefaultClass}
                rows={3}
                style={{ resize: "none" }}
                value={commentToPost}
                onChange={(event) => setCommentToPost(event.target.value)}
              ></textarea>
              <div className="text-right">
                <Button
                  type="submit"
                  variants="primary"
                  disabled={isSendingComment}
                >
                  {isSendingComment ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <span>Send</span>
                  )}
                </Button>
              </div>
            </form>
          )}
          <ul className="p-5">{commentList}</ul>
        </div>
      </div>
    </main>
  );
};

export default Post;
