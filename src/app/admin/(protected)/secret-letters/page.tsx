import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminSecretLetters } from "@/lib/admin-data";
import { deleteSecretLetterAction, moderateSecretLetterAction } from "../actions";

export default async function AdminSecretLettersPage() {
  const letters = await getAdminSecretLetters();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Secret letters"
        title="Moderate secret letters"
        description="New secret letters always start as pending. Only letters that are approved and marked as public can appear on the public website."
      />

      <AdminSectionCard title="Letters">
        {letters.length > 0 ? (
          <div className="space-y-4">
            {letters.map((letter) => (
              <article
                key={letter.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {letter.isAnonymous
                        ? "Anonymous"
                        : letter.senderName || "Unknown sender"}
                    </p>
                    <p className="text-sm text-muted">
                      {letter.targetMemberName
                        ? `To: ${letter.targetMemberName}`
                        : "To: Entire class"}{" "}
                      • {letter.status}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-foreground">
                    {letter.message}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {new Date(letter.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                <form
                  action={moderateSecretLetterAction}
                  className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]"
                >
                  <input type="hidden" name="id" value={letter.id} />
                  <select
                    name="status"
                    defaultValue={letter.status}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                  <label className="inline-flex items-center gap-3 rounded-[1.1rem] border border-line bg-white px-4 py-3 text-sm">
                    <input
                      name="is_public"
                      type="checkbox"
                      defaultChecked={letter.isPublic}
                    />
                    Show publicly
                  </label>
                  <SubmitButton>Save moderation</SubmitButton>
                </form>

                <form action={deleteSecretLetterAction} className="mt-3">
                  <input type="hidden" name="id" value={letter.id} />
                  <SubmitButton
                    variant="danger"
                    confirmMessage="Delete this secret letter from the database?"
                  >
                    Delete letter
                  </SubmitButton>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No secret letters yet"
            description="When visitors send new secret letters, they will show up here for moderation."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
