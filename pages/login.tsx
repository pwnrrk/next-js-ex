import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "components/button";
import Input from "components/input";
import useUser from "util/user";
import resource from "util/resource";

function LoginForm() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await resource.post("/api/login", {
      body: { email, password },
    });
    setLoading(false);
    if (data) {
      localStorage.setItem("access_token", data.data.token);
      return router.push("/");
    }
    console.log(error);
    setError(error);
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
    <>
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Blogs Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen max-w-lg mx-auto px-3">
        <section
          id="login"
          className="grid gap-12 bg-white text-center rounded p-5 mt-5"
        >
          <h1 className="text-3xl font-bold">Login</h1>
          <LoginForm />
          <div>
            New user?{" "}
            <span className="text-blue-500 hover:text-blue-600 hover:underline">
              <Link href="/register">
                <a>Register</a>
              </Link>
            </span>{" "}
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
