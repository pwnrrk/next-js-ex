import { NextPage } from "next";
import Head from "next/head";
import React, { createRef, FormEvent, useEffect, useState } from "react";
import { userStore } from "../lib/hooks/user";
import { PostModel } from "../models/post";
import Modal from "../components/modal";
import Button from "../components/button";
import Input, { inputDefaultClass } from "../components/input";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Alert from "../components/alert";
import { Types } from "mongoose";
import { User } from "../models/user";

function ProfileData() {
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    userStore().then(({ user }) => {
      setUser(user);
    });
  }, []);
  if (user)
    return (
      <div className="text-center text-2xl">Welcome {user["first_name"]}</div>
    );
  return <></>;
}

const defaultPostData: PostModel = {
  title: "",
  description: "",
};

type Action = "POST" | "PUT";

type AddPostFormProps = {
  hideModal: CallableFunction;
  getPost: CallableFunction;
  actionType: Action;
  postData: PostModel;
  resetPost: CallableFunction;
};

const AddPostForm = ({
  getPost,
  hideModal,
  actionType,
  postData,
  resetPost,
}: AddPostFormProps) => {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setTitle(postData.title);
    setDescription(postData.description);
  }, [postData]);

  const savePost = async (event: FormEvent) => {
    event.preventDefault();
    const body = postData;
    body.title = title;
    body.description = description;
    setLoading(true);
    const response = await fetch("/api/post", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
      method: actionType,
    });
    setLoading(false);
    if (response.status == 200) {
      resetForm();
      getPost();
      alert("Post save successfuly");
      return;
    }
    alert("Save fail");
  };

  const resetForm = () => {
    resetPost();
    setTitle("");
    setDescription("");
    hideModal();
  };

  return (
    <div className="relative">
      <form onSubmit={savePost} onReset={resetForm}>
        <div className="my-3">
          <Input
            type="text"
            name="title"
            id="title-input"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
};

function UserPost() {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState<PostModel>(defaultPostData);
  const [formAction, setFormAction] = useState<Action>("POST");

  const alert = createRef<any>();

  const getPosts = async () => {
    setLoading(true);
    const response = await fetch("/api/post/me", {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setLoading(false);
    setPosts(data);
  };

  const deletePost = async (id: Types.ObjectId | undefined, title: string) => {
    const confirm = await alert.current.fire({
      title: "Are you sure to delete",
      description: title,
      showConfirm: true,
    });
    if (!confirm) return;
    setDeleting(true);
    const response = await fetch(`/api/post/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setDeleting(false);
    if (response.status == 200) {
      getPosts();
      return;
    }
    window.alert("Fail");
  };

  const add = () => {
    setShowModal(true);
    setFormAction("POST");
  };

  const update = (postData: PostModel) => {
    setShowModal(true);
    setPostToEdit(postData);
    setFormAction("PUT");
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const resetPostToEdit = () => setPostToEdit(defaultPostData);

  const postList = posts.map((post) => (
    <li key={post._id?.toString()} className="border-b border-b-slate-300 py-3">
      <div className="flex items-center px-3">
        <div className="flex-1 pr-3">
          <h3 className="text-lg">{post.title}</h3>
          <p className="text-slate-500">{post.description}</p>
        </div>
        <div className="flex-none">
          <Button
            variants="warning"
            onClick={() => update(post)}
            className="text-xl mr-3"
            title="Edit"
          >
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

  useEffect(() => {
    getPosts();
  }, []);

  if (isLoading) return <></>;

  return (
    <div>
      <div className="text-right">
        <Button onClick={() => add()}>Add Post</Button>
      </div>
      <h3 className="text-xl font-medium">Posts</h3>
      <Modal setShowModal={setShowModal} showing={showModal}>
        <div className="rounded bg-white max-w-lg mx-auto my-5 p-5">
          <AddPostForm
            getPost={getPosts}
            hideModal={hideModal}
            postData={postToEdit}
            resetPost={resetPostToEdit}
            actionType={formAction}
          />
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
  );
};
export default Profile;
