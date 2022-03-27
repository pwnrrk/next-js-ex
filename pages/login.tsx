import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "components/button";
import Input from "components/input";
import useUser from "util/user";

function LoginForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<any>();

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
      localStorage.setItem("access_token", result.data.token);
      return router.push("/");
    }
    setError(result);
  };
  return (
    <form onSubmit={loginUser}>
      <div className="grid gap-3">
        <Input
          autoComplete="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          warning={
            isError?.status === "invalid" ? "Password is not correct" : false
          }
        />
        <Button disabled={isLoading}>Login</Button>
      </div>
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
        <div className="rounded-lg p-3 bg-white my-5">
          <h1 className="text-3xl my-12 font-bold">Login</h1>
          <LoginForm />
          <div className="my-5">
            New user?{" "}
            <span className="text-blue-500 hover:text-blue-600 hover:underline">
              <Link href="/register">
                <a>Register</a>
              </Link>
            </span>{" "}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
