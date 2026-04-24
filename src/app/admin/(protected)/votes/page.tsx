import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminVoteCategories } from "@/lib/admin-data";
import { deleteVoteCategoryAction, upsertVoteCategoryAction } from "../actions";

export default async function AdminVotesPage() {
  const categories = await getAdminVoteCategories();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Votes"
        title="Manage voting categories and results"
        description="Keep categories light, positive, and safe. Each browser is limited to one vote per category through voter_key."
      />

      <AdminSectionCard title="Create a voting category">
        <form
          action={upsertVoteCategoryAction}
          className="grid gap-4 md:grid-cols-2"
        >
          <input
            name="title"
            required
            placeholder="Example: Sunshine smile"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <input
            name="description"
            placeholder="Short description"
            className="rounded-[1.1rem] border border-line bg-white/80 px-4 py-3"
          />
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_active" type="checkbox" defaultChecked />
            Active
          </label>
          <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white/80 px-4 py-3 text-sm">
            <input name="is_visible" type="checkbox" defaultChecked />
            Visible on public site
          </label>
          <div className="md:col-span-2">
            <SubmitButton>Create category</SubmitButton>
          </div>
        </form>
      </AdminSectionCard>

      <AdminSectionCard title="Categories and results">
        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <details
                key={category.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {category.title}
                    </p>
                    <p className="text-sm text-muted">
                      {category.isActive ? "active" : "inactive"} •{" "}
                      {category.isVisible ? "visible" : "hidden"} •{" "}
                      {category.totalVotes} votes
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Edit
                  </span>
                </summary>

                <form
                  action={upsertVoteCategoryAction}
                  className="mt-4 grid gap-4 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input
                    name="title"
                    required
                    defaultValue={category.title}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="description"
                    defaultValue={category.description || ""}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_active"
                      type="checkbox"
                      defaultChecked={category.isActive}
                    />
                    Active
                  </label>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_visible"
                      type="checkbox"
                      defaultChecked={category.isVisible}
                    />
                    Visible on public site
                  </label>
                  <div className="md:col-span-2">
                    <SubmitButton>Save category</SubmitButton>
                  </div>
                </form>

                <div className="mt-5 rounded-[1.5rem] bg-[#fffdf7] p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Current results
                  </p>
                  {category.results.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {category.results.map((result, index) => (
                        <div
                          key={result.memberId}
                          className="flex items-center justify-between gap-3 rounded-[1.2rem] bg-white/80 px-4 py-3 text-sm"
                        >
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
                      No votes have been recorded for this category yet.
                    </p>
                  )}
                </div>

                <form action={deleteVoteCategoryAction} className="mt-3">
                  <input type="hidden" name="id" value={category.id} />
                  <SubmitButton
                    variant="danger"
                    confirmMessage="Delete this voting category? Related votes will also be removed."
                  >
                    Delete category
                  </SubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No voting categories yet"
            description="Create the first category so visitors can start voting."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
