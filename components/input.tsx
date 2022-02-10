import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<any>;

export const inputDefaultClass =
  " rounded px-2 py-2 invalid:border-red-500 border-slate-300 w-full focus:outline-none focus:ring focus:ring-blue-300 transition ease";

const Input = (props: InputProps) => {
  return <input {...props} className={props.className + inputDefaultClass} />;
};

export default Input;
