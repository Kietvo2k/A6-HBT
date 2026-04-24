import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminMemories } from "@/lib/admin-data";
import { deleteMemoryAction, upsertMemoryAction } from "../actions";

const categoryOptions = [
  { value: "classroom", label: "Classroom" },
  { value: "outing", label: "Hangout" },
  { value: "event", label: "Event" },
  { value: "funny", label: "Funny photo" },
];

export default async function AdminMemoriesPage() {
  const memories = await getAdminMemories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Memories"
        title="Manage gallery memories"
        description="You can start with image URLs to keep scope light. The public gallery still works with placeholders or fallback images when needed."
      />

      <AdminSectionCard title="Add a new memory">
        <form action={upsertMemoryAction} className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            required
            placeholder="Title"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="memory_date"
            type="date"
            required
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="image_url"
            placeholder="Image URL"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <input
            name="video_url"
            placeholder="Video URL (optional)"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <textarea
            name="caption"
            rows={4}
            placeholder="Caption"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 md:col-span-2"
          />
          <select
            name="category"
            defaultValue="event"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            name="album_name"
            placeholder="Album name (optional)"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
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
            <SubmitButton>Add memory</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Memory list">
        {memories.length > 0 ? (
          <div className="space-y-4">
            {memories.map((memory) => (
              <details
                key={memory.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {memory.title}
                    </p>
                    <p className="text-sm text-muted">
                      {memory.date} • {memory.category} •{" "}
                      {memory.isVisible ? "visible" : "hidden"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Edit
                  </span>
                </summary>

                <form
                  action={upsertMemoryAction}
                  className="mt-4 grid gap-4 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={memory.id} />
                  <input
                    name="title"
                    required
                    defaultValue={memory.title}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="memory_date"
                    type="date"
                    defaultValue={memory.date}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="image_url"
                    defaultValue={memory.imageUrl || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <input
                    name="video_url"
                    defaultValue={memory.videoUrl || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <textarea
                    name="caption"
                    rows={4}
                    defaultValue={memory.caption || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <select
                    name="category"
                    defaultValue={memory.category}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    name="album_name"
                    defaultValue={memory.albumName || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={memory.displayOrder}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_published"
                      type="checkbox"
                      defaultChecked={memory.isVisible}
                    />
                    Visible on public site
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <SubmitButton>Save changes</SubmitButton>
                  </div>
                </form>

                <form action={deleteMemoryAction} className="mt-3">
                  <input type="hidden" name="id" value={memory.id} />
                  <SubmitButton
                    variant="danger"
                    confirmMessage={`Delete memory "${memory.title}"?`}
                  >
                    Delete memory
                  </SubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No memories yet"
            description="Add the first memory so the public gallery can start reading live data from Supabase."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
