import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminTimelineEvents } from "@/lib/admin-data";
import { deleteTimelineAction, upsertTimelineAction } from "../actions";

export default async function AdminTimelinePage() {
  const events = await getAdminTimelineEvents();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Timeline"
        title="Manage timeline milestones"
        description="Add, edit, hide, or remove events. The public timeline still renders from date and display order just like before."
      />

      <AdminSectionCard title="Add a timeline event">
        <form action={upsertTimelineAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Event title"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="event_date"
            type="date"
            required
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="image_url"
            placeholder="Image URL (optional)"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <textarea
            name="description"
            rows={4}
            placeholder="Milestone description"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_published" type="checkbox" defaultChecked />
            Visible on public site
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Add milestone</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Timeline list">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <details
                key={event.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {event.title}
                    </p>
                    <p className="text-sm text-muted">
                      {event.eventDate} • order {event.displayOrder} •{" "}
                      {event.isVisible ? "visible" : "hidden"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Edit
                  </span>
                </summary>

                <form
                  action={upsertTimelineAction}
                  className="mt-4 grid gap-4 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={event.id} />
                  <input
                    name="title"
                    required
                    defaultValue={event.title}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="event_date"
                    type="date"
                    defaultValue={event.eventDate}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="image_url"
                    defaultValue={event.imageUrl || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={event.description}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={event.displayOrder}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_published"
                      type="checkbox"
                      defaultChecked={event.isVisible}
                    />
                    Visible on public site
                  </label>
                  <div className="md:col-span-2">
                    <SubmitButton>Save changes</SubmitButton>
                  </div>
                </form>

                <form action={deleteTimelineAction} className="mt-3">
                  <input type="hidden" name="id" value={event.id} />
                  <SubmitButton
                    variant="danger"
                    confirmMessage={`Delete timeline event "${event.title}"?`}
                  >
                    Delete milestone
                  </SubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No milestones yet"
            description="Add the first event so the public timeline can read live content."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
