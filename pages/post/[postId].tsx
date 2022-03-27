import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "components/button";
import Input from "components/input";
import useUser from "util/user";
import { CommentModel } from "models/comment";
import { PostModel } from "models/post";
import { UserModel } from "models/user";
import useSWR from "swr";

const Comment = (props: {
  comment: { comment: CommentModel; user: UserModel };
}) => {
  const [comment] = useState(props.comment);
  const { user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteComment() {
    setIsDeleting(true);
    await fetch(`/api/comment/${comment.comment._id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.access_token}`,
      },
    });
  }

  return (
    <li
      className={`border-b-slate-300 border-b py-5 ${
        isDeleting ? "opacity-[0.5] animate-pulse" : ""
      }`}
    >
      <div className="text-blue-500 font-medium">
        {comment.user?.first_name} {comment.user?.last_name}
      </div>
      <p className="text-s p-1">{comment.comment.content}</p>
      {user?._id?.toString() === comment.user._id?.toString() && (
        <button className="text-xs text-slate-500" onClick={deleteComment}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}
    </li>
  );
};

function useComments(postId?: string) {
  const fetcher = (path: string) => fetch(path).then((res) => res.json());
  const { data, error } = useSWR(`/api/post/${postId}/comment`, fetcher, {
    refreshInterval: 100,
  });
  if (error) console.log(error);
  return data as { comment: CommentModel; user: UserModel }[];
}

const CommentForm = () => {
  const [isSendingComment, setSendingComment] = useState(false);
  const [commentToPost, setCommentToPost] = useState("");
  const router = useRouter();
  const user = useUser();
  const comments = useComments(router.query.postId?.toString());

  const postComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!commentToPost || /^\s*$/.test(commentToPost)) return;
    setSendingComment(true);
    const response = await fetch(`/api/post/${router.query.postId}/comment`, {
      method: "POST",
      headers: { authorization: `Bearer ${localStorage.access_token}` },
      body: JSON.stringify({ content: commentToPost }),
    });
    setSendingComment(false);
    if (response.status == 200) {
      setCommentToPost("");
    }
  };

  return (
    <div className="p-5 rounded">
      {!user && (
        <div className="text-slate-500 text-center">Login to comment</div>
      )}
      {user && (
        <form onSubmit={postComment}>
          <div className="grid mb-2">
            <Input
              value={commentToPost}
              onChange={(event) => setCommentToPost(event.target.value)}
              placeholder="Comment"
            />
          </div>
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
      <ul className="p-5">
        {comments?.map((comment) => (
          <Comment comment={comment} key={comment.comment._id.toString()} />
        ))}
      </ul>
    </div>
  );
};

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
    <main className="max-w-3xl mx-auto">
      <div className="bg-white mt-5 p-3 rounded">
        <h3 className="text-xl font-bold my-5">{post?.post.title}</h3>
        <div className="text-slate-500 flex items-start justify-between">
          <div className="text-lg">{post?.author.first_name}</div>
          <div>{getDateString(post?.post.createdAt)}</div>
        </div>
        <div className="my-5">{post?.post.description}</div>
        <CommentForm />
      </div>
    </main>
  );
};

export default Post;
