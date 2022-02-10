import { ReactNode } from "react";
import Nav from "./nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
