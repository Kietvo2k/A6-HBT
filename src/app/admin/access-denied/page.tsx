import Link from "next/link";

export default function AdminAccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell w-full rounded-[2.4rem] px-6 py-12 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Access denied
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl">
          Bạn đã đăng nhập nhưng chưa có quyền admin
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Hãy kiểm tra role trong bảng `profiles` của Supabase. Chỉ tài khoản có
          role `admin` mới truy cập được dashboard quản trị.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e8dbff]"
          >
            Về trang chính
          </Link>
          <Link
            href="/login?next=/admin"
            className="inline-flex rounded-full border border-line bg-white/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </main>
  );
}
