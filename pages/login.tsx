import type { NextPage } from "next";
import Layout from "../components/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import Button from "../components/button";

function LoginForm() {
  const router = useRouter();
  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    const loginData = {
      email: (document.getElementById("email-input") as HTMLInputElement).value,
      password: (document.getElementById("password-input") as HTMLInputElement)
        .value,
    };
    const response = await fetch("/api/login", {
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const result = await response.json();
    if (result.status === "ok") {
      localStorage.setItem("token", result.data.token);
      router.push("/profile");
    }
  };
  return (
    <form onSubmit={loginUser}>
      <div>
        <input
          name="email"
          id="email-input"
          autoComplete="email"
          className="rounded-tl rounded-tr form-input px-4 py-3 w-full"
          type="email"
          placeholder="Email"
          required
        />
      </div>
      <div>
        <input
          name="password"
          id="password-input"
          className="rounded-bl rounded-br border-t-0 form-input px-4 py-3 w-full"
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <Button type="submit" className="my-3 w-full pt-3 pb-3">
        <span>Login</span>
      </Button>
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
          </div>
        </main>
        <footer></footer>
      </div>
    </Layout>
  );
};

export default Login;
