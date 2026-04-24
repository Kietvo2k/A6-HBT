export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell w-full max-w-3xl rounded-[2.4rem] px-6 py-12 text-center sm:px-10">
        <div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-full bg-[#f2eaff]" />
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Loading yearbook
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl">
          Đang mở cuốn kỷ yếu cho bạn
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
          Website đang tải dữ liệu lớp từ Supabase hoặc fallback local nếu môi
          trường chưa được cấu hình xong.
        </p>
      </div>
    </main>
  );
}
