import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminGuestbookMessages } from "@/lib/admin-data";
import { deleteGuestbookAction, moderateGuestbookAction } from "../actions";

type AdminGuestbookPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminGuestbookPage({
  searchParams,
}: AdminGuestbookPageProps) {
  const [messages, params] = await Promise.all([
    getAdminGuestbookMessages(),
    searchParams,
  ]);
  const query = params.q?.trim().toLowerCase() ?? "";
  const filteredMessages = query
    ? messages.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query) ||
          message.createdAt.toLowerCase().includes(query),
      )
    : messages;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Guestbook"
        title="Moderation lưu bút"
        description="Chỉ message có status `approved` mới được hiển thị public. Các message mới từ public side mặc định vào trạng thái `pending`."
      />

      <AdminSectionCard title="Tìm kiếm">
        <form className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Tìm theo tên, nội dung hoặc ngày..."
            className="w-full rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <button
            type="submit"
            className="inline-flex rounded-full bg-[#f2eaff] px-5 py-3 text-sm font-semibold text-[#5d4e7d]"
          >
            Lọc
          </button>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách message">
        {filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <article key={message.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">
                      {message.isAnonymous ? "Ẩn danh" : message.name}
                    </p>
                    <p className="text-sm text-muted">
                      {message.targetMemberName
                        ? `Gửi tới: ${message.targetMemberName}`
                        : "Gửi tới: Cả lớp"}{" "}
                      • {message.status}
                    </p>
                    <p className="text-sm leading-7 text-foreground">
                      {message.message}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      {new Date(message.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["approved", "rejected", "pending"].map((status) => (
                      <form key={status} action={moderateGuestbookAction}>
                        <input type="hidden" name="id" value={message.id} />
                        <input type="hidden" name="status" value={status} />
                        <SubmitButton variant={status === "approved" ? "primary" : status === "rejected" ? "danger" : "secondary"}>
                          {status === "approved"
                            ? "Approve"
                            : status === "rejected"
                              ? "Reject"
                              : "Đưa về pending"}
                        </SubmitButton>
                      </form>
                    ))}
                    <form action={deleteGuestbookAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <ConfirmSubmitButton confirmMessage="Xóa lời nhắn này khỏi database?">
                        Xóa
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Không có message phù hợp"
            description="Hiện chưa có lưu bút nào hoặc không có kết quả khớp với bộ lọc tìm kiếm."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
