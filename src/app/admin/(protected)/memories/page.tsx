import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminMemories } from "@/lib/admin-data";
import { deleteMemoryAction, upsertMemoryAction } from "../actions";

const categoryOptions = [
  { value: "classroom", label: "Lớp học" },
  { value: "outing", label: "Đi chơi" },
  { value: "event", label: "Sự kiện" },
  { value: "funny", label: "Ảnh dìm vui" },
];

export default async function AdminMemoriesPage() {
  const memories = await getAdminMemories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Memories"
        title="Quản lý gallery / khoảnh khắc"
        description="Bạn có thể nhập `image_url` trước để giảm scope. Nếu chưa upload file thật, public UI vẫn hoạt động với placeholder/fallback."
      />

      <AdminSectionCard title="Thêm khoảnh khắc mới">
        <form action={upsertMemoryAction} className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Tiêu đề" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="memory_date" type="date" required className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="image_url" placeholder="Image URL" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <input name="video_url" placeholder="Video URL (optional)" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <textarea name="caption" rows={4} placeholder="Caption" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <select name="category" defaultValue="event" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3">
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input name="album_name" placeholder="Album name (optional)" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="sort_order" type="number" defaultValue={0} className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_published" type="checkbox" defaultChecked />
            Hiển thị public
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Thêm khoảnh khắc</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách memories">
        {memories.length > 0 ? (
          <div className="space-y-4">
            {memories.map((memory) => (
              <details key={memory.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{memory.title}</p>
                    <p className="text-sm text-muted">
                      {memory.date} • {memory.category} • {memory.isVisible ? "visible" : "hidden"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Chỉnh sửa
                  </span>
                </summary>

                <form action={upsertMemoryAction} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={memory.id} />
                  <input name="title" required defaultValue={memory.title} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="memory_date" type="date" defaultValue={memory.date} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="image_url" defaultValue={memory.imageUrl || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="video_url" defaultValue={memory.videoUrl || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <textarea name="caption" rows={4} defaultValue={memory.caption || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <select name="category" defaultValue={memory.category} className="rounded-[1.1rem] border border-line bg-white px-4 py-3">
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input name="album_name" defaultValue={memory.albumName || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="sort_order" type="number" defaultValue={memory.displayOrder} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_published" type="checkbox" defaultChecked={memory.isVisible} />
                    Hiển thị public
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <SubmitButton>Lưu thay đổi</SubmitButton>
                  </div>
                </form>

                <form action={deleteMemoryAction} className="mt-3">
                  <input type="hidden" name="id" value={memory.id} />
                  <ConfirmSubmitButton confirmMessage={`Xóa memory "${memory.title}"?`}>
                    Xóa khoảnh khắc
                  </ConfirmSubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có memory nào"
            description="Thêm một khoảnh khắc đầu tiên để section gallery bắt đầu lấy dữ liệu từ Supabase."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
