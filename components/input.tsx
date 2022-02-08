import { HTMLInputTypeAttribute } from "react";

type InputProps = {
  type: HTMLInputTypeAttribute;
  name: string;
  className?: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minlength?: number;
  maxlength?: number;
  autoComplete?: string;
};

export const inputDefaultClass =
  " rounded px-2 py-2 invalid:border-red-500 border-slate-300 w-full focus:outline-none focus:ring focus:ring-blue-300 transition ease";

export default function Input(props: InputProps) {
  return <input {...props} className={props.className + inputDefaultClass} />;
}
