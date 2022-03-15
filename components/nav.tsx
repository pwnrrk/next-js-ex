import Link from "next/link";
import useUser from "util/user";

function UserMenu() {
  const user = useUser();
  if (user.user)
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

const Nav = () => {
  return (
    <nav className="py-5 border-b border-b-slate-300 flex">
      <div className="flex-1 text-2xl font-bold px-3">
        <Link href="/">Blogs</Link>
      </div>
      <div className="flex-none hover:text-blue-500 px-3">
        <Link href="/">Home</Link>
      </div>
      <UserMenu />
    </nav>
  );
};

export default Nav;
