import { MouseEventHandler, ReactNode } from "react";

type ButtonProps = {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  variants?: string;
  disabled?: boolean;
};

const varaints: { [key: string]: string } = {
  primary:
    "bg-blue-500 disabled:bg-blue-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300",
  secondary:
    "bg-gray-500 disabled:bg-gray-300 hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300",
};

export default function Button(props: ButtonProps) {
  const variant = varaints[props.variants || "primary"];
  return (
    <button
      {...props}
      className={`${props.className} transition ease-out rounded px-3 py-1 text-white ${variant}`}
    ></button>
  );
}
