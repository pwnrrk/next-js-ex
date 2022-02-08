import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { createRef, FormEvent, useEffect, useState } from "react";
import Layout from "../components/layout";
import useUser from "../util/useUser";
import { PostModel } from "../models/post";
import Modal from "../components/modal";
import Button from "../components/button";
import Input, { inputDefaultClass } from "../components/input";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Alert from "../components/alert";
import { Types } from "mongoose";

function ProfileData() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isLoggedin, setLoggedIn] = useState(false);
  const getUser = useUser;
  useEffect(() => {
    setLoading(true);
    getUser().then((res) => {
      setUser(res.user);
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
    <div className="text-center text-2xl">
      Welcome {user ? user["first_name"] : ""}
    </div>
  );
}

type AddPostFormProps = {
  setShowModal: CallableFunction;
  getPost: CallableFunction;
};

function AddPostForm({ setShowModal, getPost }: AddPostFormProps) {
  const [isLoading, setLoading] = useState(false);
  const savePost = async (event: FormEvent) => {
    event.preventDefault();
    const postData = {
      title: (document.getElementById("title-input") as HTMLInputElement).value,
      description: (
        document.getElementById("description-input") as HTMLInputElement
      ).value,
    };
    setLoading(true);
    const response = await fetch("/api/post", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(postData),
      method: "POST",
    });
    setLoading(false);
    if (response.status == 200) {
      getPost();
      setShowModal(false);
      return alert("Post save successfuly");
    }
    alert("Save fail");
  };
  return (
    <div className="relative">
      <form onSubmit={savePost} onReset={() => setShowModal(false)}>
        <div className="my-3">
          <Input
            type="text"
            name="title"
            id="title-input"
            placeholder="Title"
          />
        </div>
        <div className="my-3">
          <textarea
            id="description-input"
            className={inputDefaultClass}
            rows={3}
            maxLength={300}
            style={{ resize: "none" }}
            placeholder="Description"
          ></textarea>
        </div>
        <div className="text-right">
          <Button type="reset" className="mx-2" variants="secondary">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex flex-col justify-center items-center">
          <span className="text-white tex-xl animate-pulse">Saving</span>
        </div>
      )}
    </div>
  );
}

function UserPost() {
  const [posts, setPosts] = useState(new Array<PostModel>());
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const getPosts = async () => {
    setLoading(true);
    const response = await fetch("/api/post/me", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading)
    return (
      <div className="text-center text-2xl text-slate-300">Loading...</div>
    );

  const alert = createRef<any>();

  const deletePost = (id: Types.ObjectId, title: string) => {
    alert.current
      .fire({
        title: "Are you sure to delete",
        description: title,
        showConfirm: true,
      })
      .then((confirm: boolean) => {
        if (!confirm) return;
        setDeleting(true);
        fetch(`/api/post/${id}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          setDeleting(false);
          if (res.status == 200) {
            getPosts();
            return;
          }
          window.alert("Fail");
        });
      });
  };

  const postList = posts.map((post) => (
    <li key={post._id.toString()} className="border-b border-b-slate-300 py-3">
      <div className="flex items-center px-3">
        <div className="flex-1 pr-3">
          <h3 className="text-lg">{post.title}</h3>
          <p className="text-slate-500">{post.description}</p>
        </div>
        <div className="flex-none">
          <Button variants="warning" className="text-xl mr-3" title="Edit">
            <FaPencilAlt />
          </Button>
          <Button
            variants="danger"
            className="text-xl"
            title="Delete"
            onClick={() => deletePost(post._id, post.title)}
          >
            <FaTrashAlt />
          </Button>
        </div>
      </div>
    </li>
  ));

  return (
    <div>
      <div className="text-right">
        <Button onClick={() => setShowModal(true)}>Add Post</Button>
      </div>
      <h3 className="text-xl font-medium">Posts</h3>
      <Modal setShowModal={setShowModal} showing={showModal}>
        <div className="rounded bg-white max-w-lg mx-auto my-5 p-5">
          <AddPostForm setShowModal={setShowModal} getPost={getPosts} />
        </div>
      </Modal>
      {posts.length == 0 && (
        <div className="text-center text-2xl text-slate-300">
          You have no post
        </div>
      )}
      <ul>{postList}</ul>
      <Alert ref={alert} />
      {isDeleting && (
        <div className="fixed top-0 left-0 bottom-0 bg-black/50 right-0 flex flex-col items-center justify-center">
          <span className="text-2xl animate-pulse text-white">Deleting</span>
        </div>
      )}
    </div>
  );
}

const Profile: NextPage = () => {
  return (
    <Layout>
      <div className="p-5">
        <Head>
          <title>Blogs</title>
          <meta name="description" content="Blogs Test" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="h-screen">
          <div className="rounded-lg p-5 bg-slate-100 my-5">
            <ProfileData />
          </div>
          <div className="rounded-lg p-5 bg-slate-100 my-5">
            <UserPost />
          </div>
        </main>
      </div>
    </Layout>
  );
};
export default Profile;
