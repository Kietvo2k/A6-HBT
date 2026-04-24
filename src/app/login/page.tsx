import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentProfile } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    missing_env?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || "/admin";
  const isSupabaseReady = hasSupabaseEnv();
  const { profile } = isSupabaseReady
    ? await getCurrentProfile()
    : { profile: null };

  if (profile?.role === "admin") {
    redirect(nextPath);
  }

  if (!isSupabaseReady || params.missing_env === "1") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="section-shell section-grid rounded-[2.4rem] px-6 py-10 sm:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
              Supabase setup
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
              Khu vực admin cần Supabase env để bật auth và dashboard
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Hiện tại project chưa có đủ `NEXT_PUBLIC_SUPABASE_URL` và
              `NEXT_PUBLIC_SUPABASE_ANON_KEY`, nên website public vẫn chạy được
              còn khu vực quản trị sẽ chờ bạn cấu hình xong.
            </p>
          </section>

          <section className="paper-card rounded-[2rem] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Cần cấu hình
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
              <p>1. Tạo file `.env.local` trong workspace.</p>
              <p>2. Thêm `NEXT_PUBLIC_SUPABASE_URL`.</p>
              <p>3. Thêm `NEXT_PUBLIC_SUPABASE_ANON_KEY`.</p>
              <p>4. Restart `npm run dev` hoặc chạy lại build.</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="section-shell section-grid rounded-[2.4rem] px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
            Admin login
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Đăng nhập để tiếp tục viết và gìn giữ cuốn kỷ yếu của lớp
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Supabase Auth được dùng để bảo vệ dashboard. Người chưa đăng nhập sẽ
            được chuyển về đây, còn người không có role admin sẽ bị chặn khỏi
            khu vực quản trị.
          </p>
        </section>

        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
