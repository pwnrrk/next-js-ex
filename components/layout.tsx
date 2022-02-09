import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { userStore } from "../lib/hooks/user";

type LayoutProps = {
  children: ReactNode;
};

function UserMenu() {
  const [isLoggedin, setLoggedIn] = useState(false);
  useEffect(() => {
    userStore().then(({ isLoggedin }) => {
      setLoggedIn(isLoggedin);
    });
  });
  if (isLoggedin)
    return (
      <>
        <div className="flex-none hover:text-blue-500 px-3">
          <Link href="/profile">Profile</Link>
        </div>
        <div className="flex-none hover:text-blue-500 px-3">
          <Link href="/logout">Logout</Link>
        </div>
      </>
    );
  return (
    <>
      <div className="flex-none hover:text-blue-500 px-3">
        <Link href="/login">Login</Link>
      </div>
      <div className="flex-none hover:text-blue-500 px-3">
        <Link href="/register">Register</Link>
      </div>
    </>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <nav className="py-5 border-b border-b-slate-300 flex">
        <div className="flex-1 text-2xl font-bold px-3">
          <Link href="/">Blogs</Link>
        </div>
        <div className="flex-none hover:text-blue-500 px-3">
          <Link href="/">Home</Link>
        </div>
        <UserMenu />
      </nav>
      {children}
    </div>
  );
}
