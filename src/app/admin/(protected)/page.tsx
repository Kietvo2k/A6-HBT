import { BookHeart, Camera, Mailbox, TimerReset, Trophy, Users } from "lucide-react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import { getAdminOverviewStats } from "@/lib/admin-data";

const statCards = [
  { key: "membersCount", label: "Thành viên", icon: Users, href: "/admin/members" },
  { key: "memoriesCount", label: "Khoảnh khắc", icon: Camera, href: "/admin/memories" },
  { key: "pendingGuestbookCount", label: "Lưu bút chờ duyệt", icon: BookHeart, href: "/admin/guestbook" },
  { key: "pendingSecretLettersCount", label: "Thư bí mật chờ duyệt", icon: Mailbox, href: "/admin/secret-letters" },
  { key: "voteCount", label: "Lượt vote", icon: Trophy, href: "/admin/votes" },
  { key: "timeCapsuleCount", label: "Time capsule", icon: TimerReset, href: "/admin/time-capsule" },
] as const;

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Overview"
        title="Một nơi để quản lý toàn bộ ký ức của lớp"
        description="Dashboard Phase 3 ưu tiên rõ ràng và dễ dùng: bạn có thể kiểm soát nội dung public, các mục cần moderation và những tính năng tương tác của lớp chỉ từ một nơi."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key];

          return (
            <Link key={card.href} href={card.href} className="paper-card rounded-[2rem] p-5 transition hover:-translate-y-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl">{value}</p>
                </div>
                <span className="rounded-full bg-[#f2eaff] p-3 text-[#6a5a8d]">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <AdminSectionCard
        title="Checklist quản trị hôm nay"
        description="Nếu bạn đang dùng website cho lớp thật, đây là những việc nên kiểm tra mỗi lần đăng nhập."
      >
        <ul className="grid gap-3 text-sm leading-7 text-muted">
          <li>Kiểm tra guestbook và secret letters đang ở trạng thái `pending`.</li>
          <li>Đảm bảo quiz active đúng với câu hỏi muốn hiển thị ở màn hình unlock.</li>
          <li>Xem category vote nào đang bật để tránh mở nhầm vote cũ.</li>
          <li>Kiểm tra time capsule có message nào cần ẩn hoặc chỉnh ngày mở.</li>
        </ul>
      </AdminSectionCard>
    </div>
  );
}
