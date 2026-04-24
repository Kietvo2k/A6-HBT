"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  nextPath: string;
};

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      startTransition(() => {
        router.push(nextPath || "/admin");
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="paper-card rounded-[2rem] p-6 sm:p-7" onSubmit={handleSubmit}>
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-full bg-[#f2eaff] p-3 text-[#6a5a8d]">
          <KeyRound className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Admin auth
          </p>
          <p className="text-sm text-foreground">
            Đăng nhập để quản lý nội dung kỷ yếu
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-[#d6bddd] focus:bg-white"
            placeholder="admin@classyearbook.vn"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-[1.2rem] border border-line bg-white/80 px-4 py-3 outline-none transition focus:border-[#d6bddd] focus:bg-white"
            placeholder="••••••••"
          />
        </label>

        {errorMessage ? (
          <div className="rounded-[1.3rem] bg-[#fff3f5] px-4 py-3 text-sm text-[#a04f63]">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e7dbff] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập admin"}
        </button>
      </div>
    </form>
  );
}
