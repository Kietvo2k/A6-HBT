import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSignOutButton from "@/components/auth/AdminSignOutButton";
import { requireAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = await requireAdminAccess("/admin");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="paper-card flex flex-col gap-4 rounded-[2rem] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Thanh xuân vườn trường
          </p>
          <h1 className="mt-2 text-2xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            Xin chào {profile.displayName || profile.email || "Admin"}, mọi nội
            dung đang được quản lý dưới cùng một lớp quyền Supabase Auth +
            profiles.
          </p>
        </div>

        <AdminSignOutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}
