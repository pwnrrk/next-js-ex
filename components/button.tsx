import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<any> & {
  children?: ReactNode;
  variants?: string;
};

const varaints: { [key: string]: string } = {
  primary:
    "bg-blue-500 disabled:bg-blue-300 hover:bg-blue-600 active:bg-blue-700 focus:outline-none",
  secondary:
    "bg-gray-500 disabled:bg-gray-300 hover:bg-gray-600 active:bg-gray-700 focus:outline-none",
  danger:
    "bg-red-500 disabled:bg-red-300 hover:bg-red-600 active:bg-red-700 focus:outline-none",
  warning:
    "bg-yellow-500 disabled:bg-yellow-300 hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none",
};

const Button = (props: ButtonProps) => {
  const variant = varaints[props.variants || "primary"];
  return (
    <button
      {...props}
      className={`${props.className} transition ease-out shadow shadow-black/50 rounded-sm px-3 py-1 text-white ${variant}`}
    ></button>
  );
};
export default Button;
