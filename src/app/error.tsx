"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell w-full max-w-3xl rounded-[2.4rem] px-6 py-12 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Unexpected error
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl">
          Có lỗi xảy ra khi mở website kỷ yếu
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
          {error.message ||
            "Bạn có thể thử tải lại trang hoặc kiểm tra cấu hình Supabase/env variables."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d] transition hover:bg-[#e8dbff]"
        >
          Thử lại
        </button>
      </div>
    </main>
  );
}
