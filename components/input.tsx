import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<any> & { warning?: any };

export const inputDefaultClass = [
  "peer",
  "rounded-lg",
  "px-3 py-3 w-full",
  "border-2 border-slate-300",
  "focus:outline-none focus:border-blue-500",
  "transition ease",
  "placeholder:opacity-0",
].join(" ");

function isNotTextbox(type?: HTMLInputTypeAttribute) {
  return (
    type === "radio" ||
    type === "file" ||
    type === "button" ||
    type === "reset" ||
    type === "range" ||
    type === "checkbox"
  );
}

const Input = (props: InputProps) => {
  return (
    <div className="relative inline-block">
      <input
        {...props}
        className={[
          props.className,
          inputDefaultClass,
          isNotTextbox(props.type) ? "px-2 py-2 rounded" : "",
          props.warning ? "border-red-500" : "",
        ].join(" ")}
      />
      {props.warning && <p className="text-red-500">{props.warning}</p>}
      <label className="absolute transition ease peer-focus:translate-y-[-150%] peer-placeholder-shown:translate-y-[-50%] peer-focus:scale-[0.8] peer-placeholder-shown:scale-1 scale-[0.8] peer-focus:text-blue-500 bg-white px-1 origin-top-left top-[50%] translate-y-[-150%] left-3 text-slate-500">
        {props.placeholder}
      </label>
    </div>
  );
};

export default Input;
