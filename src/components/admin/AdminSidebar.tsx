"use client";

import {
  BookHeart,
  Camera,
  LayoutDashboard,
  Mailbox,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/members", label: "Thành viên", icon: Users },
  { href: "/admin/memories", label: "Khoảnh khắc", icon: Camera },
  { href: "/admin/timeline", label: "Timeline", icon: ScrollText },
  { href: "/admin/guestbook", label: "Lưu bút", icon: BookHeart },
  { href: "/admin/quiz", label: "Quiz", icon: Sparkles },
  { href: "/admin/secret-letters", label: "Thư bí mật", icon: Mailbox },
  { href: "/admin/votes", label: "Bình chọn", icon: Trophy },
  { href: "/admin/time-capsule", label: "Time capsule", icon: TimerReset },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="paper-card h-fit rounded-[2rem] p-4">
      <div className="mb-4 flex items-center gap-3 rounded-[1.5rem] bg-white/70 px-4 py-4">
        <span className="rounded-full bg-[#f2eaff] p-3 text-[#6f5a93]">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Admin area
          </p>
          <p className="text-sm text-foreground">
            Quản trị nội dung kỷ yếu
          </p>
        </div>
      </div>

      <nav className="grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#f3ecff] text-[#5f4c82]"
                  : "text-muted hover:bg-white/70 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
