import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: string;
  onClick?: CallableFunction;
  className?: string;
  disabled?: boolean;
};
export default function Button({ children, className }: ButtonProps) {
  return (
    <button
      className={
        className +
        " transition ease-out rounded px-3 py-1 bg-blue-500 disabled:bg-blue-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 text-white"
      }
    >
      {children}
    </button>
  );
}
