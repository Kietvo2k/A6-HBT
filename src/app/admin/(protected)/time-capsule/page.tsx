import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSectionCard from "@/components/admin/AdminSectionCard";
import SubmitButton from "@/components/admin/SubmitButton";
import { getAdminTimeCapsules } from "@/lib/admin-data";
import { deleteTimeCapsuleAction, updateTimeCapsuleAction } from "../actions";

export default async function AdminTimeCapsulePage() {
  const capsules = await getAdminTimeCapsules();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Time capsule"
        title="Manage time capsules"
        description="Admins can review, reschedule unlock dates, change status, or hide a message from the public side when needed."
      />

      <AdminSectionCard title="Capsules">
        {capsules.length > 0 ? (
          <div className="space-y-4">
            {capsules.map((capsule) => (
              <details
                key={capsule.id}
                className="rounded-[1.6rem] border border-line bg-white/80 p-4"
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {capsule.senderName}
                    </p>
                    <p className="text-sm text-muted">
                      Opens on {capsule.unlockDate} • {capsule.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4efff] px-3 py-1 text-xs font-semibold text-[#6d5b90]">
                    Edit
                  </span>
                </summary>

                <form
                  action={updateTimeCapsuleAction}
                  className="mt-4 grid gap-4 md:grid-cols-2"
                >
                  <input type="hidden" name="id" value={capsule.id} />
                  <input
                    name="sender_name"
                    required
                    defaultValue={capsule.senderName}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <input
                    name="unlock_date"
                    type="date"
                    defaultValue={capsule.unlockDate}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  />
                  <select
                    name="status"
                    defaultValue={capsule.status}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3"
                  >
                    <option value="locked">locked</option>
                    <option value="opened">opened</option>
                    <option value="hidden">hidden</option>
                  </select>
                  <div />
                  <textarea
                    name="message"
                    rows={5}
                    defaultValue={capsule.message}
                    className="rounded-[1.1rem] border border-line bg-white px-4 py-3 md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <SubmitButton>Save capsule</SubmitButton>
                  </div>
                </form>

                <form action={deleteTimeCapsuleAction} className="mt-3">
                  <input type="hidden" name="id" value={capsule.id} />
                  <SubmitButton
                    variant="danger"
                    confirmMessage="Delete this time capsule from the database?"
                  >
                    Delete capsule
                  </SubmitButton>
                </form>
              </details>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No time capsules yet"
            description="When visitors send a message to the future, it will appear here."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
