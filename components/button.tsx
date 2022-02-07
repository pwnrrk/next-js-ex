import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: string;
  onClick?: CallableFunction;
  className: string;
};
export default function Button({ children, className }: ButtonProps) {
  return (
    <button
      className={
        className +
        " rounded px-3 py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 shadow-lg text-white"
      }
    >
      {children}
    </button>
  );
}
