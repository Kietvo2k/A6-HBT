import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminTimelineEvents } from "@/lib/admin-data";
import { deleteTimelineAction, upsertTimelineAction } from "../actions";

export default async function AdminTimelinePage() {
  const events = await getAdminTimelineEvents();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Timeline"
        title="Quản lý các cột mốc kỷ niệm"
        description="Bạn có thể thêm, sửa, ẩn hoặc xóa event. Public timeline vẫn render theo date và display order như trước."
      />

      <AdminSectionCard title="Thêm timeline event">
        <form action={upsertTimelineAction} className="grid gap-4 md:grid-cols-2">
          <input name="title" required placeholder="Tiêu đề sự kiện" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="event_date" type="date" required className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <input name="image_url" placeholder="Image URL (optional)" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <textarea name="description" rows={4} placeholder="Mô tả cột mốc" className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2" />
          <input name="sort_order" type="number" defaultValue={0} className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3" />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_published" type="checkbox" defaultChecked />
            Hiển thị public
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Thêm cột mốc</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Danh sách timeline">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <details key={event.id} className="rounded-[1.6rem] border border-line bg-white/80 p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{event.title}</p>
                    <p className="text-sm text-muted">
                      {event.eventDate} • order {event.displayOrder} • {event.isVisible ? "visible" : "hidden"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Chỉnh sửa
                  </span>
                </summary>

                <form action={upsertTimelineAction} className="mt-4 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="id" value={event.id} />
                  <input name="title" required defaultValue={event.title} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="event_date" type="date" defaultValue={event.eventDate} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <input name="image_url" defaultValue={event.imageUrl || ""} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <textarea name="description" rows={4} defaultValue={event.description} className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2" />
                  <input name="sort_order" type="number" defaultValue={event.displayOrder} className="rounded-[1.1rem] border border-line bg-white px-4 py-3" />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input name="is_published" type="checkbox" defaultChecked={event.isVisible} />
                    Hiển thị public
                  </label>
                  <div className="md:col-span-2">
                    <SubmitButton>Lưu thay đổi</SubmitButton>
                  </div>
                </form>

                <form action={deleteTimelineAction} className="mt-3">
                  <input type="hidden" name="id" value={event.id} />
                  <ConfirmSubmitButton confirmMessage={`Xóa timeline event "${event.title}"?`}>
                    Xóa cột mốc
                  </ConfirmSubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="Chưa có cột mốc nào"
            description="Thêm một event đầu tiên để timeline public bắt đầu đọc dữ liệu thật."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
