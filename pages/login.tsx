import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "components/button";
import Input from "components/input";
import useUser from "util/user";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    const loginData = {
      email,
      password,
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
          autoComplete="email"
          className={
            "rounded-b-none rounded-tr rounded-tl pt-3 pb-3 " +
            noUserError()?.class
          }
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <Input
          className={
            "rounded-t-none rounded-br rounded-bl border-t-0 pt-3 pb-3 " +
            passwordIncorrectError()?.class
          }
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <label className="text-red-500">{errorMessage()}</label>
      <LoginButton isLoading={isLoading} />
    </form>
  );
}

const Login: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.user) router.replace("/");
  }, [user.user, router]);

  return (
    <div className="max-w-lg mx-auto text-center">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Blogs Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen px-3">
        <div className="rounded-lg p-3 bg-slate-100 my-5">
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
  );
};

export default Login;
