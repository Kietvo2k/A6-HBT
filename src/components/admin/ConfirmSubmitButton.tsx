"use client";

type ConfirmSubmitButtonProps = {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
};

export default function ConfirmSubmitButton({
  children,
  confirmMessage,
  className = "",
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className={`inline-flex items-center justify-center rounded-full bg-[#ffe6ec] px-4 py-2.5 text-sm font-semibold text-[#a44e67] transition hover:bg-[#ffd8e2] ${className}`}
    >
      {children}
    </button>
  );
}
