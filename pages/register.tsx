import type { NextPage } from "next";
import Head from "next/head";
import Input from "components/input";
import Button from "components/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

const RegisterForm = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const passwordMatched = () => {
    const password = (
      document.getElementById("password-input") as HTMLInputElement
    ).value;
    const confirmPassword = (
      document.getElementById("confirm-password-input") as HTMLInputElement
    ).value;
    return password === confirmPassword;
  };
  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!passwordMatched) return;
    const registerData = {
      first_name: (
        document.getElementById("first-name-input") as HTMLInputElement
      ).value,
      last_name: (
        document.getElementById("last-name-input") as HTMLInputElement
      ).value,
      email: (document.getElementById("email-input") as HTMLInputElement).value,
      password: (document.getElementById("password-input") as HTMLInputElement)
        .value,
    };
    setLoading(true);
    const response = await fetch("/api/register", {
      body: JSON.stringify(registerData),
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
    }
  };
  return (
    <form onSubmit={registerUser}>
      <div className="my-3 grid gap-3">
        <Input
          type="text"
          id="first-name-input"
          name="first_name"
          placeholder="First Name"
          required
        />
        <Input
          type="text"
          id="last-name-input"
          name="last_name"
          placeholder="Last Name"
          required
        />
        <Input type="email" id="email-input" name="email" placeholder="Email" />
        <Input
          type="password"
          id="password-input"
          name="password"
          placeholder="Password"
          minLength={8}
          maxLength={16}
          required
        />
        <Input
          type="password"
          id="confirm-password-input"
          name="confirm-password"
          placeholder="Confirm Password"
          minLength={8}
          maxLength={16}
          required
        />
        <label>
          <Input
            type="checkbox"
            id="eula-accept-input"
            name="eula-accept"
            className="form-check w-auto"
            required
          />{" "}
          I have read and agree Term of service
        </label>
        <Button disabled={isLoading}>Register</Button>
      </div>
    </form>
  );
};

const Register: NextPage = () => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Blogs Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen px-3">
        <div className="rounded-lg p-3 bg-white my-5">
          <h1 className="text-3xl my-12 font-bold">Register</h1>
          <RegisterForm />
          <div className="my-5">
            Already register?{" "}
            <span className="text-blue-500 hover:text-blue-600 hover:underline">
              <Link href="/login">Login</Link>
            </span>{" "}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
