import type { NextPage } from "next";
import Head from "next/head";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

type RegisterButtonProps = {
  isLoading: boolean;
};

const RegisterButton = ({ isLoading }: RegisterButtonProps) => {
  if (isLoading)
    return (
      <Button
        type="submit"
        disabled
        className="w-full my-5 pb-2 pt-2 shadow-xl"
      >
        Loading...
      </Button>
    );
  return (
    <Button type="submit" className="w-full my-5 pb-2 pt-2 shadow-xl">
      Register
    </Button>
  );
};

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
      <div className="my-3">
        <Input
          type="text"
          id="first-name-input"
          name="first_name"
          placeholder="First Name"
          required
        />
      </div>
      <div className="my-3">
        <Input
          type="text"
          id="last-name-input"
          name="last_name"
          placeholder="Last Name"
          required
        />
      </div>
      <div className="my-3">
        <Input type="email" id="email-input" name="email" placeholder="Email" />
      </div>
      <div className="my-3">
        <Input
          type="password"
          id="password-input"
          name="password"
          placeholder="Password"
          minLength={8}
          maxLength={16}
          required
        />
      </div>
      <div className="my-3">
        <Input
          type="password"
          id="confirm-password-input"
          name="confirm-password"
          placeholder="Confirm Password"
          minLength={8}
          maxLength={16}
          required
        />
      </div>
      <div className="my-3">
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
        <RegisterButton isLoading={isLoading} />
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
      <main className="h-screen">
        <div className="rounded-lg p-5 bg-slate-100 my-5">
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
