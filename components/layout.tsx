import { ReactNode } from "react";
import Nav from "./nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-zinc-100 min-h-screen">
      <Nav />
      {children}
    </div>
  );
}
