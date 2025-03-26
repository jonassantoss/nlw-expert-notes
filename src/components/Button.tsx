import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-slate-700 rounded-md px-4 py-2 flex items-center gap-2 text-slate-200 text-sm hover:bg-slate-600"
      {...props}
    >
      {children}
    </button>
  );
}
