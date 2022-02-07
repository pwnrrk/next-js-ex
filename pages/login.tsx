import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Button from "../components/button";
import Input from "../components/input";

type LoginButtonProps = {
  isLoading: boolean;
};

const LoginButton = ({ isLoading }: LoginButtonProps) => {
  if (isLoading)
    return (
      <Button
        type="submit"
        disabled
        className="w-full my-5 pb-3 pt-3 shadow-xl"
      >
        Loading...
      </Button>
    );
  return (
    <Button type="submit" className="w-full my-5 pb-3 pt-3 shadow-xl">
      Login
    </Button>
  );
};
function LoginForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({ status: null, message: null });
  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    const loginData = {
      email: (document.getElementById("email-input") as HTMLInputElement).value,
      password: (document.getElementById("password-input") as HTMLInputElement)
        .value,
    };
    setLoading(true);
    const response = await fetch("/api/login", {
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await response.json();
    setLoading(false);
    if (result.status === "ok") {
      localStorage.setItem("token", result.data.token);
      router.push("/profile");
      return;
    }
    setError(result);
  };
  const errorClass = "border-red-500";
  const noUserError = () => {
    if (error.status === "no_user") return { error, class: errorClass };
  };
  const passwordIncorrectError = () => {
    if (error.status === "invalid") return { error, class: errorClass };
  };
  const errorMessage = () => {
    if (error.status) {
      if (error.status === "no_user") return "No user founded";
      return "Password incorrect";
    }
  };
  return (
    <form onSubmit={loginUser}>
      <div>
        <Input
          name="email"
          id="email-input"
          autoComplete="email"
          className={
            "rounded-none rounded-tr rounded-tl pt-3 pb-3 " +
            noUserError()?.class
          }
          type="email"
          placeholder="Email"
        />
      </div>
      <div>
        <Input
          name="password"
          id="password-input"
          className={
            "rounded-none rounded-br rounded-bl border-t-0 pt-3 pb-3 " +
            passwordIncorrectError()?.class
          }
          type="password"
          placeholder="Password"
        />
      </div>
      <label className="text-red-500">{errorMessage()}</label>
      <LoginButton isLoading={isLoading} />
    </form>
  );
}

const Login: NextPage = () => {
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
            <h1 className="text-3xl my-12 font-bold">Login</h1>
            <LoginForm />
            <div className="my-5">
              New user?{" "}
              <span className="text-blue-500 hover:text-blue-600 hover:underline">
                <Link href="/register">Register</Link>
              </span>{" "}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Login;
