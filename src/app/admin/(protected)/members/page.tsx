import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminMembers } from "@/lib/admin-data";
import { deleteMemberAction, upsertMemberAction } from "../actions";

export default async function AdminMembersPage() {
  const members = await getAdminMembers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Members"
        title="Quản lý danh sách thành viên"
        description="Thêm, sửa, ẩn hoặc xóa thành viên mà không làm thay đổi giao diện public. `sort_order` quyết định thứ tự hiển thị trên website."
      />

      <AdminSectionCard title="Thêm thành viên mới">
        <form action={upsertMemberAction} className="grid gap-4 md:grid-cols-2">
          <input name="name" required placeholder="Tên đầy đủ" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="nickname" placeholder="Nickname" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="avatar_url" placeholder="Avatar URL" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <input name="quote" placeholder="Quote" maxLength={160} className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <textarea name="short_bio" rows={4} placeholder="Short bio" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <input name="hobbies" placeholder="Hobbies, cách nhau bởi dấu phẩy" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <input name="social_facebook" placeholder="Facebook URL" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="social_instagram" placeholder="Instagram URL" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="social_tiktok" placeholder="TikTok URL" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="sort_order" type="number" defaultValue={0} className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_published" type="checkbox" defaultChecked />
            Hiển thị public
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Thêm thành viên</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách hiện có">
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <details key={member.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted">
                      @{member.nickname || "member"} • order {member.displayOrder} • {member.isVisible ? "visible" : "hidden"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Chỉnh sửa
                  </span>
                </summary>

                <form action={upsertMemberAction} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={member.id} />
                  <input name="name" required defaultValue={member.name} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="nickname" defaultValue={member.nickname || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="avatar_url" defaultValue={member.avatarUrl || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="quote" defaultValue={member.quote || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <textarea name="short_bio" rows={4} defaultValue={member.shortBio || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="hobbies" defaultValue={member.hobbies.join(", ")} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="social_facebook" defaultValue={member.socialLinks.facebook || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="social_instagram" defaultValue={member.socialLinks.instagram || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="social_tiktok" defaultValue={member.socialLinks.tiktok || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="sort_order" type="number" defaultValue={member.displayOrder} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_published" type="checkbox" defaultChecked={member.isVisible} />
                    Hiển thị public
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <SubmitButton>Lưu thay đổi</SubmitButton>
                  </div>
                </form>

                <form action={deleteMemberAction} className="mt-3">
                  <input type="hidden" name="id" value={member.id} />
                  <ConfirmSubmitButton confirmMessage={`Xóa thành viên ${member.name}? Thao tác này có thể ảnh hưởng vote và nội dung liên quan.`}>
                    Xóa thành viên
                  </ConfirmSubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có thành viên nào"
            description="Tạo bản ghi đầu tiên để website public có dữ liệu thật từ database."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
