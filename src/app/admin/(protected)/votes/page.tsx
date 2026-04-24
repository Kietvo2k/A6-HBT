import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminVoteCategories } from "@/lib/admin-data";
import { deleteVoteCategoryAction, upsertVoteCategoryAction } from "../actions";

export default async function AdminVotesPage() {
  const categories = await getAdminVoteCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Votes"
        title="Quản lý category bình chọn và xem kết quả"
        description="Chỉ dùng các category vui, tích cực và an toàn. Mỗi browser được giới hạn một vote cho mỗi category bằng `voter_key`."
      />

      <AdminSectionCard title="Tạo vote category mới">
        <form action={upsertVoteCategoryAction} className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Ví dụ: Cây hài của lớp" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="description" placeholder="Mô tả ngắn" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_active" type="checkbox" defaultChecked />
            Đang hoạt động
          </label>
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_visible" type="checkbox" defaultChecked />
            Hiển thị public
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Tạo category</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách category và kết quả">
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <details key={category.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{category.title}</p>
                    <p className="text-sm text-muted">
                      {category.isActive ? "active" : "inactive"} • {category.isVisible ? "visible" : "hidden"} • {category.totalVotes} votes
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Chỉnh sửa
                  </span>
                </summary>

                <form action={upsertVoteCategoryAction} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={category.id} />
                  <input name="title" required defaultValue={category.title} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="description" defaultValue={category.description || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_active" type="checkbox" defaultChecked={category.isActive} />
                    Đang hoạt động
                  </label>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_visible" type="checkbox" defaultChecked={category.isVisible} />
                    Hiển thị public
                  </label>
                  <div className="md:col-span-2">
                    <SubmitButton>Lưu category</SubmitButton>
                  </div>
                </form>

                <div className="mt-5 rounded-[1.5rem] bg-[#fffdf7] p-4">
                  <p className="text-sm font-semibold text-foreground">Kết quả hiện tại</p>
                  {category.results.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {category.results.map((result, index) => (
                        <div key={result.memberId} className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-white/80 px-4 py-3 text-sm">
                          <span>
                            #{index + 1} {result.memberName}
                          </span>
                          <span className="font-semibold text-[#6a5a8d]">
                            {result.count} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      Chưa có vote nào cho category này.
                    </p>
                  )}
                </div>

                <form action={deleteVoteCategoryAction} className="mt-3">
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmSubmitButton confirmMessage="Xóa vote category này? Toàn bộ votes liên quan cũng sẽ bị xóa.">
                    Xóa category
                  </ConfirmSubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có vote category nào"
            description="Tạo một category đầu tiên để public bắt đầu bình chọn."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
