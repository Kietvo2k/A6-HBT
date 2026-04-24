"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  confirmMessage?: string;
};

export default function SubmitButton({
  children,
  pendingLabel = "Saving...",
  variant = "primary",
  className = "",
  confirmMessage,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const variantClassName =
    variant === "primary"
      ? "bg-[#f2eaff] text-[#5d4e7d] hover:bg-[#e8dbff]"
      : variant === "danger"
        ? "bg-[#ffe6ec] text-[#a44e67] hover:bg-[#ffd8e2]"
        : "bg-white text-foreground hover:bg-[#fffaf3]";

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variantClassName} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
